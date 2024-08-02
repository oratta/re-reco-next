import prisma from "@/commons/libs/prisma";
import {scrapeCastList} from "@/features/listingCast/services/actions/scrapeCastList";
import * as JobListing  from "@/commons/models/JobListing";

export default async function runJobListing(job=null) {
    const jobId = job.id;
    job = await JobListing.saveRunning(jobId)

    //TODO Implement Job task
    try{
        await scrapeCastList(job);
        job = await JobListing.saveComplete(jobId)
    }catch(error){
        console.log(error);
        console.log(error.message);
        console.log(error.stack);
        job = JobListing.saveFailed(jobId, error.message);
    }

    return job;
}