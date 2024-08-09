import prisma from "@/commons/libs/prisma";
import * as JobListing from "@/commons/models/JobListing";

export async function getJobListingsForAction() {
    const jobListings = await prisma.jobListing.findMany({
        include: {
            jobReservationRates: true
        }
    });

    return jobListings.map(job => ({
        id: job.id,
        areaCode: job.areaCode,
        targetDate: job.targetDate,
        status: job.status,
        completeCount: job.jobReservationRates.filter(rate => rate.status === JobListing.STATUS.COMPLETED).length,
        failedCount: job.jobReservationRates.filter(rate => rate.status === JobListing.STATUS.FAILED).length,
        pendingCount: job.jobReservationRates.filter(rate => rate.status === JobListing.STATUS.PENDING).length
    }));
}

