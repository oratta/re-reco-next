import { NextResponse } from 'next/server';
import prisma from '@/commons/libs/prisma';
import createAndRunJobList from "@/features/listingCast/services/createAndRunJobListing";
import {consoleError} from "@/commons/utils/log";
import {getJobListingsForAction} from "@/features/executeJobReRe/services/getJobListingsForAction";
import {getWebParameter} from "@/commons/utils/api";

export async function POST(request, {params}) {
    console.log("request post api/job-listings");
    try {
        // リクエストボディを一度だけ読み取り、変数に保存
        const body = await request.json();
        const { areaCode, targetDate, condition } = body;

        const jobListing = await createAndRunJobList({areaCode, targetDate, condition});

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