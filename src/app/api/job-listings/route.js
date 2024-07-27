import { mockData } from '@/lib/mockData';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(mockData.jobListings);
}

export async function POST(request) {
    const body = await request.json();
    const newJobListing = {
        id: String(mockData.jobListings.length + 1),
        ...body,
        status: 'pending',
        startedAt: null,
        completedAt: null,
    };
    mockData.jobListings.push(newJobListing);
    return NextResponse.json(newJobListing, { status: 201 });
}