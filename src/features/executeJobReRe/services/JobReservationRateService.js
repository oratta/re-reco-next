import prisma from "@/commons/libs/prisma";
import runJobReservationRate from "@/features/executeJobReRe/services/runJobReservationRate";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import * as JobListing from "@/commons/models/JobListing";
import {consoleLog} from "@/commons/utils/log";

export async function bulkExecuteJobReRe(jobListingId,stopExecutionMap) {
    try{
        const jobReservationRates = await prisma.jobReservationRate.findMany({
            where: {
                jobListingId,
                status: JobReservationRate.STATUS.PENDING
            }
        });

        // Execute each pending job reservation rate asynchronously with a 5-second delay
        const jobReReCount = jobReservationRates.length;
        let jobCount = 0;
        let pendingCount = jobReReCount;
        for (const jobReRe of jobReservationRates) {
            if(jobReRe.status === JobReservationRate.STATUS.PENDING) {
                if (stopExecutionMap.get(jobListingId)){
                    consoleLog(`Job ReservationRate ${jobCount}/${jobReReCount} stopped: ${jobReRe.id}`);
                    break;
                }
                consoleLog(`Job ReservationRate ${jobCount+1}/${jobReReCount} started: ${jobReRe.id}`);
                await runJobReservationRate(jobReRe);
                await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second
                jobCount++;
                pendingCount--;
                consoleLog(`Job ReservationRate ${jobCount}/${jobReReCount} finished: ${jobReRe.id}`);

                globalThis.notifyAllClients({
                    type: 'update',
                    jobListingId,
                    data: { pendingCount, jobCount, totalCount: jobReReCount }
                });
            }
        }
    } catch (error) {
        throw error;
    }

}

export async function stopBulkExecuteJobReservationRates(jobListingId) {
    stopExecutionMap.set(jobListingId, true);
    const jobListing = await prisma.jobListing.update({
        where: {
            id: jobListingId,
            status: JobListing.STATUS.EXEC_RUNNING
        },
        data: {
            status: JobListing.STATUS.EXEC_FAILED,
            message: "Job stopped by user"
        }
    });
    if(jobListing){
        if (globalThis.sseClients && globalThis.sseClients[jobListingId]) {
            globalThis.sseClients[jobListingId]({ status: JobListing.STATUS.EXEC_FAILED });
        }
    }
}