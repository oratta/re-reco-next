import prisma from "@/commons/libs/prisma";
import runJobListing from "@/features/listingCast/services/actions/runJobListing";
import {consoleError} from "@/commons/utils/log";
import {STATUS} from "@/commons/models/JobListing";

export async function createJobListing({areaCode, targetDate, condition}) {
    let jobListing = {};
    try{
        jobListing = await prisma.jobListing.create({
            data: {
                status: STATUS.LIST_PENDING,
                areaCode,
                targetDate: new Date(targetDate),
                condition,
                listCount: 0, // This will be updated after scraping
            },
        });
    }catch(error){
        consoleError(error, "failed to create jobListing", false);
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
