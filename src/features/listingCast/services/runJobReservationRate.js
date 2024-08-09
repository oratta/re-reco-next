import prisma from "@/commons/libs/prisma";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import {scrapeReservationRate} from "@/features/listingCast/services/actions/scrapeReservationRate";
import {consoleLog} from "@/commons/utils/log";

export default async function runJobReservationRate(jobReRe){
    try {
        consoleLog("Job ReservationRate started: " + jobReRe.id);
        jobReRe = await JobReservationRate.start(jobReRe)
        // ジョブの実行ロジックをここに記述
        // 例: データのスクレイピング、計算の実行など
        const {
            reservationStatus,
            castInfo
        } = await scrapeReservationRate(jobReRe);
        const {
            totalCount,
            reservedCount,
            emptyCount,
        } = reservationStatus;
        consoleLog(`total: ${totalCount}, reserved: ${reservedCount}, empty: ${emptyCount}`);
        if(totalCount >0 ){
            jobReRe.reservedRate = reservedCount/totalCount;
        }
        else {
            throw Error("total Count 0 error");
        }
        jobReRe.totalCount = totalCount;
        jobReRe.reservedCount = reservedCount;
        jobReRe.emptyCount = emptyCount;

        // ジョブ完了後、ステータスをcompleted'に更新
        const finishMsg = "Job ReservationRate finished";
        jobReRe = await JobReservationRate.finish(jobReRe,jobReRe.cast, castInfo, finishMsg)
        consoleLog(`${finishMsg}: ${jobReRe.id}`)
    } catch (error) {
        console.error('Error in background job:', error);
        await JobReservationRate.failed(jobReRe,"Error in Reservation Rate jobs: " + error.message );
    }
}