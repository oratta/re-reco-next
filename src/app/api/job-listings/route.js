import { mockData } from '@/commons/utils/mockData';
import { NextResponse } from 'next/server';
import prisma from '@/commons/libs/prisma';

export async function POST(request, {params}) {
    console.log("request post api/job-listings");
    try {
        // リクエストボディを一度だけ読み取り、変数に保存
        const body = await request.json();
        const { areaId, targetDate, condition } = body;

        const jobListing = await prisma.jobListing.create({
            data: {
                status: 'pending',
                areaId,
                targetDate: new Date(targetDate),
                condition,
                listCount: 0, // This will be updated after scraping
            },
        });

        // runJobを非同期で実行し、その結果を待つ
        await runJob(jobListing.id);

        return NextResponse.json(jobListing, { status: 201 });
    } catch (error) {
        console.error('Failed to create job listing:', error);
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
        return NextResponse.json({ error: 'Failed to create job listing', details: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const jobListings = await prisma.jobListing.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return NextResponse.json(jobListings);
    } catch (error) {
        console.error('Failed to fetch job listings:', error);
        return NextResponse.json({ error: 'Failed to fetch job listings' }, { status: 500 });
    }
}

async function runJob(id) {
    if(!id) throw new Error('Job ID is required');

    let job = await prisma.jobListing.findUnique({where: {id: id}});
    if(!job) throw new Error('Job not found');

    job = await prisma.jobListing.update({
        where: {id},
        data: {status: 'running', startedAt: new Date()}
    });

    //TODO Implement Job task
    await new Promise(resolve => setTimeout(resolve, 5000));

    job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: 'completed',
            completedAt: new Date(),
            result: 'Job completed successfully'
        },
    });

    return job;
}