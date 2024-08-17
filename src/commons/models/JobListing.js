import prisma from "@/commons/libs/prisma";

export const STATUS = {
    LIST_PENDING: 'list_pending',
    LIST_RUNNING: 'list_running',
    LIST_COMPLETED: 'list_completed', // = exec_pending
    LIST_FAILED: 'list_failed',

    EXEC_RUNNING: 'bulk_exec_running',
    EXEC_COMPLETED: 'bulk_exec_completed',
    EXEC_FAILED: 'bulk_exec_failed',

    //ここから下はDBには保存しないが、クライアントへの通知用
    ALL_JOB_FINISHED: 'all_job_finished',
    ALL_JOB_STOPPED: 'all_job_stopped'
};

export async function saveFailed(id, message) {
    const job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: STATUS.LIST_FAILED,
            completedAt: new Date(),
            result: message
        },
    });

    return job;
}

export async function saveRunning(id){
    const job = await prisma.jobListing.update({
                    where: {id},
                    data: {status: STATUS.LIST_RUNNING, startedAt: new Date()}
                });
    return job;
}

export async function saveComplete(id, listSize){
    const job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: STATUS.LIST_COMPLETED,
            completedAt: new Date(),
            listCount: listSize,
            result: 'Job completed successfully'
        },
    });
    return job;
}