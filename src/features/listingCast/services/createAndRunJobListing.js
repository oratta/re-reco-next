import prisma from "@/commons/libs/prisma";
import runJobListing from "@/features/listingCast/services/actions/runJobListing";
import {consoleError} from "@/commons/utils/log";

export default async function createAndRunJobList({areaCode, targetDate, condition}) {
    let jobListing = {};
    try{
        jobListing = await prisma.jobListing.create({
            data: {
                status: 'pending',
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

// runJobを非同期で実行し、その結果を待つ
    try{
        const result = await runJobListing(jobListing);
        return result;
    }catch (error) {
        consoleError(error, "failed to run jobListing", false);
        throw error;
    }
}
