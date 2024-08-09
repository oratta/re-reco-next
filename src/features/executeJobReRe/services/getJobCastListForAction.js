// src/services/jobCastService.js
import prisma from "@/commons/libs/prisma";

export async function getJobCastListForAction() {
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
        completeCount: job.jobReservationRates.filter(rate => rate.status === 'complete').length,
        failedCount: job.jobReservationRates.filter(rate => rate.status === 'failed').length,
        pendingCount: job.jobReservationRates.filter(rate => rate.status === 'pending').length
    }));
}

