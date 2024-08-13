import {mockData} from '@/commons/utils/mockData';
import {NextResponse} from 'next/server';

export async function GET(req) {

    return NextResponse.json(mockData.groups);
}