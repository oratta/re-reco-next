import prisma from "@/commons/libs/prisma";
import * as JobReservationRate from "@/commons/models/JobReservationRate"

export async function getJobListingsForAction() {
    const jobListings = await prisma.jobListing.findMany({
        orderBy: {createdAt: 'desc'},
        include: {
            jobReservationRates: true
        }
    });

    return jobListings.map(job => ({
        id: job.id,
        areaCode: job.areaCode,
        targetDate: job.targetDate,
        status: job.status,
        completeCount: job.jobReservationRates.filter(rate => rate.status === JobReservationRate.STATUS.COMPLETED).length,
        failedCount: job.jobReservationRates.filter(rate => rate.status === JobReservationRate.STATUS.FAILED).length,
        pendingCount: job.jobReservationRates.filter(rate => rate.status === JobReservationRate.STATUS.PENDING).length
    }));
}

