import { NextResponse } from 'next/server';
import prisma from "@/commons/libs/prisma";
import {consoleError} from "@/commons/utils/log";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import runJobReservationRate from "@/features/executeJobReRe/services/runJobReservationRate";


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