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
        const {totalCount, reservedCount, emptyCount} = await scrapeReservationRate(jobReRe);
        consoleLog(`total: ${totalCount}, reserved: ${reservedCount}, empty: ${emptyCount}`);

        // ジョブ完了後、ステータスを'completed'に更新
        jobReRe = await JobReservationRate.finish(jobReRe, )
        consoleLog(`Job ReservationRate finished: ${jobReRe.id}`)
    } catch (error) {
        console.error('Error in background job:', error);
        await JobReservationRate.failed(jobReRe,"Error in Reservation Rate jobs: " + error.message );
    }
}