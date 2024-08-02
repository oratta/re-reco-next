import prisma from "@/commons/libs/prisma";

export async function saveFailed(id, message) {
    const job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: 'failed',
            completedAt: new Date(),
            result: message
        },
    });

    return job;
}

export async function saveRunning(id){
    const job = await prisma.jobListing.update({
                    where: {id},
                    data: {status: 'running', startedAt: new Date()}
                });
    return job;
}

export async function saveComplete(id){
    const job = await prisma.jobListing.update({
        where: {id},
        data: {
            status: 'completed',
            completedAt: new Date(),
            result: 'Job completed successfully'
        },
    });
    return job;
}