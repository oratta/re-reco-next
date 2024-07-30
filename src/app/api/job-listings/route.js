import { mockData } from '@/commons/utils/mockData';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import services from '@/features/listingCast/services/index.js';

export async function POST(request) {
    try {
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

        await runJob(jobListing.id);

        return NextResponse.json(jobListing, { status: 201 });
    } catch (error) {
        console.error('Failed to create job listing:', error);
        return NextResponse.json({ error: 'Failed to create job listing' }, { status: 500 });
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

async function runJob(id){
    if(!id) throw new Error('Job ID is required');
    let job = await prisma.job.findUnique({where: {id: id}})
    if(!job) throw new Error('Job not found');

    job = await prisma.job.update({
        where: {id},
        data: {status: 'running', startedAt: new Date()}
    });

    //TODO Implement Job task
    await new Promise(resolve => setTimeout(resolve, 5000));

    job = await prisma.job.update({
        where: {id},
        data: {
            status: 'completed',
            completedAt: new Date(),
            result: 'Job completed successfully'
        },
    })
}