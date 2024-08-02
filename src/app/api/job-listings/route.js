import { NextResponse } from 'next/server';
import prisma from '@/commons/libs/prisma';
import createAndRunJobList from "@/features/listingCast/services/createAndRunJobListing";
import {consoleError} from "@/commons/utils/log";

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

export async function GET() {
    try {
        const jobListings = await prisma.jobListing.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        return NextResponse.json(jobListings);
    } catch (error) {
        consoleError(error, 'Failed to fetch job listings');
        return NextResponse.json({ error: 'Failed to fetch job listings' }, { status: 500 });
    }
}