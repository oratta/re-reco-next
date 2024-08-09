import { NextResponse } from 'next/server';
import prisma from '@/commons/libs/prisma';
import {getRunableList, getRunableListCount} from "@/commons/models/JobReservationRate";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = 50;  // 1ページあたり50件

    try {
        // データの総数を取得
        const totalCount = await getRunableListCount();

        // データを取得（ページング処理付き）
        const jobReservationRates = await getRunableList(page, pageSize);
        // console.log(jobReservationRates);

        // 総ページ数を計算
        const totalPages = Math.ceil(totalCount / pageSize);

        return NextResponse.json({
            data: jobReservationRates,
            meta: {
                currentPage: page,
                totalPages: totalPages,
                pageSize: pageSize,
                totalCount: totalCount
            }
        });
    } catch (error) {
        console.error('Error fetching job reservation rates:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}