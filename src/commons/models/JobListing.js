import prisma from "@/commons/libs/prisma";

export const STATUS = {
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
    ALL_JOB_FINISHED: 'all_job_finished',
};

export async function saveFailed(id, message) {
    const job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: STATUS.FAILED,
            completedAt: new Date(),
            result: message
        },
    });

    return job;
}

export async function saveRunning(id){
    const job = await prisma.jobListing.update({
                    where: {id},
                    data: {status: STATUS.RUNNING, startedAt: new Date()}
                });
    return job;
}

export async function saveComplete(id){
    const job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: STATUS.COMPLETED,
            completedAt: new Date(),
            result: 'Job completed successfully'
        },
    });
    return job;
}