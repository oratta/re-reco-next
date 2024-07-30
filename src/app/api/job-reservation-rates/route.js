import { mockData } from '@/commons/utils/mockData';
import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json(mockData.jobReservationRates);
}