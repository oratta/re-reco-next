import prisma from "@/commons/libs/prisma";
import runJobListing from "@/features/listingCast/services/actions/runJobListing";
import {consoleError} from "@/commons/utils/log";
import {STATUS} from "@/commons/models/JobListing";
import * as JobReservationRateService from "@/features/executeJobReRe/services/JobReservationRateService";
import {debugMsg, errorMsg, infoMsg} from "@/commons/utils/logger";

export async function createJobListing({areaCode, targetDate, condition}) {
    let jobListing = {};
    try{
        console.log("parameter: ", {areaCode, targetDate, condition});
        jobListing = await prisma.jobListing.create({
            data: {
                status: STATUS.LIST_PENDING,
                areaCode,
                targetDate: new Date(targetDate.match(/^\d{4}-\d{2}-\d{2}$/)
                    ? targetDate
                    : targetDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
                condition,
                listCount: 0, // This will be updated after scraping
            },
        });
    }catch(error){
        errorMsg( "failed to create jobListing");
        throw error;
    }
    return jobListing;
}

export async function runJobList(jobListing) {
    // runJobを非同期で実行し、その結果を待つ
    try{
        const result = await runJobListing(jobListing);
        return result;
    }catch (error) {
        consoleError(error, "failed to run jobListing", false);
        throw error;
    }
}

/**
 * 同じjobListingを持つjobReservationRatesをバルクで実行する
 * 実行前に、他に実行中のjobReservationRateがある場合はジョブを終了する
 * 実行中のjobReservationRateが完了した場合は、待機しているjobReservationRateを実行する
 * @param jobListing
 * @returns {Promise<void>}
 */
export async function handleBulkExecute(jobListing){
    try {
        const isExecute = await prisma.jobListing.findOne({
            where: {
                id: jobListing.id,
                status: STATUS.EXEC_RUNNING
            },
            select: {
                status: true
            }
        });
        if(isExecute){
            consoleError("jobListing is already running", "failed to bulkExecuteJobReRe", false);
            throw new Error("jobListing is already running");
        }

        await bulkExecuteJobReRe(jobListing.id);

        const otherPendingJobList = await prisma.jobListing.find({
            where: {
                status: STATUS.LIST_COMPLETED,
            }
        });
        if(otherPendingJobList?.id){
            bulkExecuteJobReRe(otherPendingJobList.id).then(r => console.log("bulkExecuteJobReRe", r));
        }
    }catch(error){
        consoleError(error, "failed to bulkExecuteJobReRe", false);
        throw error;
    }
}

export async function bulkExecuteJobReRe(jobListingId) {
    try{
        //TODO
        //jobListingのステータス変更処理をJobReRe側からぬく
        await JobReservationRateService.bulkExecuteJobReRe(jobListingId);
    }catch(error){
        consoleError(error, "failed to bulkExecuteJobReRe", false);
        throw error;
    }
}

export async function getActiveJobListings() {
    const result = await prisma.jobListing.findMany({
        where: {
            status: {
                in: ['EXEC_RUNNING', 'LIST_COMPLETED']
            }
        }
    });

    return result;
}
