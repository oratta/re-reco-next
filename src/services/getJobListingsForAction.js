import prisma from "@/commons/libs/prisma";
import * as JobReservationRate from "@/commons/models/JobReservationRate"

export async function getJobListingsForAction(countType) {
    const jobListings = await prisma.jobListing.findMany({
        orderBy: {createdAt: 'desc'},
        include: {
            jobReservationRates: true
        }
    });

    return jobListings
        .map(job => {
            const completeCount = job.jobReservationRates.filter(rate => rate.status === JobReservationRate.STATUS.COMPLETED).length;
            const failedCount = job.jobReservationRates.filter(rate => rate.status === JobReservationRate.STATUS.FAILED).length;
            const pendingCount = job.jobReservationRates.filter(rate => rate.status === JobReservationRate.STATUS.PENDING).length;

            return {
                id: job.id,
                areaCode: job.areaCode,
                targetDate: job.targetDate,
                status: job.status,
                listSize: completeCount+failedCount+pendingCount,
                completeCount,
                failedCount,
                pendingCount
            };
        })
        .filter(job => job.completeCount > 0);
}

