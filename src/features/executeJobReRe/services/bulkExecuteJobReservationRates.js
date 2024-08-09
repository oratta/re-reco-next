import prisma from "@/commons/libs/prisma";
import runJobReservationRate from "@/features/executeJobReRe/services/runJobReservationRate";
import * as JobReservationRate from "@/commons/models/JobReservationRate";

export async function bulkExecuteJobReservationRates(jobListingId) {
    const jobReservationRates = await prisma.jobReservationRate.findMany({
        where: {
            jobListingId,
            status: JobReservationRate.STATUS.PENDING
        }
    });

    // Execute each pending job reservation rate asynchronously
    await Promise.all(jobReservationRates.map(async (jobReRe) => {
        // Simulate asynchronous execution
        await runJobReservationRate(jobReRe);
        await new Promise(resolve => setTimeout(resolve, 5000)); // 5-second delay
    }));

    // Update the job listing status if all job reservation rates are complete or failed
    const updatedJobReservationRates = await prisma.jobReservationRate.findMany({
        where: {
            jobListingId
        }
    });

    const allCompletedOrFailed = updatedJobReservationRates.every(jobReRe => jobReRe.status === 'complete' || jobReRe.status === 'failed');
    if (allCompletedOrFailed) {
        await prisma.jobListing.update({
            where: { id: jobListingId },
            data: { status: 'complete' }
        });
    }
}

async function executeJobReservationRate(rateId) {
    // Simulate the execution of a job reservation rate
    await new Promise(resolve => setTimeout(resolve, 1000));
    await prisma.jobReservationRate.update({
        where: { id: rateId },
        data: { status: 'complete' } // or 'failed' based on the execution result
    });
}