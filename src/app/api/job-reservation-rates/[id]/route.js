import { NextResponse } from 'next/server';
import prisma from "@/commons/libs/prisma";
import {consoleError} from "@/commons/utils/log";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import runJobReservationRate from "@/features/listingCast/services/runJobReservationRate";


export async function POST(request, { params }) {
    const { id } = params;

    try {
        // JobReservationRateの存在確認
        let jobReservationRate = await JobReservationRate.get(id);
        if (!jobReservationRate) {
            return NextResponse.json({ message: 'JobReservationRate not found' }, { status: 404 });
        }
        // ここで非同期のジョブを開始する
        runJobReservationRate(jobReservationRate);

        return NextResponse.json({ message: 'Job started successfully' });
    } catch (error) {
        consoleError(error,'Error starting job:', );
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

async function startBackgroundJob(id) {
    // この関数は非同期でジョブを実行します
    // 実際の実装はプロジェクトの要件に応じて変更してください
    try {
        // ジョブの実行ロジックをここに記述
        // 例: データのスクレイピング、計算の実行など

        // ジョブ完了後、ステータスを'completed'に更新
        await prisma.jobReservationRate.update({
            where: { id: id },
            data: {
                status: 'completed',
                completedAt: new Date(),
                // 他の更新するフィールド（reservedRate, reservedCount など）
            },
        });
    } catch (error) {
        console.error('Error in background job:', error);
        // エラー時はステータスを'failed'に更新
        await prisma.jobReservationRate.update({
            where: { id: id },
            data: {
                status: 'failed',
                completedAt: new Date(),
                result: error.message
            },
        });
    }
}