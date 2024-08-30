import prisma from "@/commons/libs/prisma";
import runJobReservationRate from "@/features/executeJobReRe/services/runJobReservationRate";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import * as JobListing from "@/commons/models/JobListing";
import {consoleError, consoleLog} from "@/commons/utils/log";
import {formatActiveJobListing} from "@/features/listingCast/services/JobListingsService";

export async function bulkExecuteJobReRe(jobListing, stopExecutionMap) {
    try {
        const jobReservationRates = await prisma.jobReservationRate.findMany({
            where: {
                jobListingId: jobListing.id,
                status: JobReservationRate.STATUS.PENDING
            }
        });

        if (jobReservationRates.length === 0) {
            throw new Error("jobReservationRates should be not empty");
        }

        jobListing.jobReservationRates = jobReservationRates;

        if (!jobListing.area) {
            const area = await prisma.area.findUnique({
                where: {
                    code: jobListing.areaCode
                }
            });
            if (!area) {
                throw new Error(`Area with code ${jobListing.areaCode} not found`);
            }
            jobListing.area = area;
        }

        const jobReReCount = jobReservationRates.length;
        let completedCount = 0;
        let failedCount = 0;
        let pendingCount = jobReReCount;

        for (const jobReRe of jobReservationRates) {
            if (jobReRe.status === JobReservationRate.STATUS.PENDING) {
                if (stopExecutionMap.get(jobListing.id)) {
                    consoleLog(`Job ReservationRate ${completedCount}/${jobReReCount} stopped: ${jobReRe.id}`);
                    break;
                }

                consoleLog(`Job ReservationRate ${completedCount + 1}/${jobReReCount} started: ${jobReRe.id}`);

                try {
                    const jobReReResult = await runJobReservationRate(jobReRe);
                    if (jobReReResult === true) {
                        completedCount++;
                    } else {
                        failedCount++;
                    }
                } catch (error) {
                    consoleError(error, `Error running job reservation rate ${jobReRe.id}`);
                    failedCount++;
                }

                pendingCount--;

                consoleLog(`Job ReservationRate ${completedCount}/${jobReReCount} finished: ${jobReRe.id}`);
                const formattedData = formatActiveJobListing(jobListing, completedCount, pendingCount, failedCount);
                globalThis.notifyAllClients({
                    type: 'update',
                    data: formattedData
                });

                await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
            }
        }

        return { completedCount, failedCount, pendingCount };
    } catch (error) {
        consoleError(error, "Error in bulkExecuteJobReRe");
        throw error;
    }
}

export async function stopBulkExecuteJobReservationRates(jobListingId, stopExecutionMap) {
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