import { NextResponse } from 'next/server';
import prisma from '@/commons/libs/prisma';
import {
    runJobList,
    createJobListing,
    bulkExecuteJobReRe,
    handleBulkExecute
} from "@/features/listingCast/services/JobListingsService";
import {consoleError, consoleLog} from "@/commons/utils/log";
import {getJobListingsForAction} from "@/features/executeJobReRe/services/getJobListingsForAction";
import {getWebParameter} from "@/commons/utils/api";
import {FLAG_IS_NOW} from "@/app/api/job-listings/confirm/confirmJobList";
import {STATUS} from "@/commons/models/JobListing";

export async function POST(request, {params}) {
    console.log("request post api/job-listings");
    try {
        // リクエストボディを一度だけ読み取り、変数に保存
        const body = await request.json();
        const { areaCode, condition } = body;
        let { targetDate} = body;
        if (targetDate === FLAG_IS_NOW) {
            targetDate = new Date();
        }
        // JobListの作成は同期処理
        let jobListing = await createJobListing({areaCode, targetDate, condition});
        jobListing = await runJobList(jobListing);

        //非同期でJobListの実行
        //すでに実行中のジョブがある場合は待機に回る
        //実行中のジョブが完了した場合は、待機しているジョブを実行する
        handleBulkExecute(jobListing.id).then(r => console.log("bulkExecuteJobReRe", r));

        return NextResponse.json(jobListing, { status: 201 });
    } catch (error) {
        consoleError(error,'Failed to create job listing' );
        return NextResponse.json({ error: 'Failed to create job listing', details: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    const {type, countType} = getWebParameter(req, ["type", "countType"]);
    // const url = new URL(req.url);
    // const type = url.searchParams.get('type') || 'latest';

    if (!type || type === 'latest') {
        try {
            const jobListings = await prisma.jobListing.findMany({
                orderBy: {createdAt: 'desc'},
                take: 5,
            });
            return NextResponse.json(jobListings);
        } catch (error) {
            consoleError(error, 'Failed to fetch job listings');
            return NextResponse.json({error: 'Failed to fetch job listings'}, {status: 500});
        }
    } else if (type === 'listing'){
        try {
            const jobCastList = await getJobListingsForAction(countType);
            return new Response(JSON.stringify(jobCastList), { status: 200 });
        } catch (error) {
            console.error('Error fetching job cast list:', error);
            return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
}

export async function PUT(request) {
    try {
        const resumeThresholdHours = 10; // このパラメータは設定可能にすることができます

        // EXEC_RUNNING ジョブを探す
        let jobToResume = await prisma.jobListing.findFirst({
            where: { status: STATUS.EXEC_RUNNING },
            orderBy: { createdAt: 'asc' }
        });

        if (jobToResume) {
            const now = new Date();
            const jobStartTime = new Date(jobToResume.startedAt);
            const hoursPassed = (now - jobStartTime) / (1000 * 60 * 60);

            if (hoursPassed <= resumeThresholdHours) {
                return NextResponse.json({ error: 'There is an active job that has not exceeded the time threshold' }, { status: 400 });
            }

            await prisma.jobListing.update({
                where: {
                    id: jobToResume.id
                },
                data: {
                    status: STATUS.LIST_COMPLETED,
                    result: 'Job interrupted'
                },
            });

        } else {
            // EXEC_RUNNING ジョブがない場合、LIST_COMPLETED ジョブを探す
            jobToResume = await prisma.jobListing.findFirst({
                where: { status: STATUS.LIST_COMPLETED },
                orderBy: { createdAt: 'asc' }
            });
        }

        if (!jobToResume) {
            return NextResponse.json({ error: 'No job to resume' }, { status: 400 });
        }

        // ジョブを再開
        await handleBulkExecute(jobToResume);

        return NextResponse.json({ message: 'Job resumed successfully', jobId: jobToResume.id });
    } catch (error) {
        consoleError(error, 'Failed to resume job');
        return NextResponse.json({ error: 'Failed to resume job', details: error.message }, { status: 500 });
    }
}