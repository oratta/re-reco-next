// src/services/jobCastService.js
import prisma from '@/libs/prisma';

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

export async function bulkExecuteJobReservationRates(jobListingId) {
    const jobReservationRates = await prisma.jobReservationRate.findMany({
        where: {
            jobListingId,
            status: 'pending'
        }
    });

    // Execute each pending job reservation rate asynchronously
    await Promise.all(jobReservationRates.map(async (rate) => {
        // Simulate asynchronous execution
        await executeJobReservationRate(rate.id);
    }));

    // Update the job listing status if all job reservation rates are complete or failed
    const updatedJobReservationRates = await prisma.jobReservationRate.findMany({
        where: {
            jobListingId
        }
    });

    const allCompletedOrFailed = updatedJobReservationRates.every(rate => rate.status === 'complete' || rate.status === 'failed');
    if (allCompletedOrFailed) {
        await prisma.jobCastList.update({
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