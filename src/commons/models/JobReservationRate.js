import prisma from "@/commons/libs/prisma";

export async function start(jobReRe){
    const jobReservationRate =  await prisma.jobReservationRate.update({
        where: { id: jobReRe.id },
        data: {
            status: 'processing',
            startedAt: new Date()
        },
        include:{
            cast: true
        }
    });

    return jobReservationRate;
}

export async function get(id){
    const jobReRe = await prisma.jobReservationRate.findUnique({
        where: { id: id },
        include: {
            cast: true
        }
    });
    return jobReRe;
}

export async function getRunableList(page, pageSize) {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 今日の日付の00:00:00に設定

    const jobReReList = await prisma.jobReservationRate.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
            createdAt: 'desc'  // 作成日時の降順でソート
        },
        where: {
            status: 'pending',
            jobListing: {
                targetDate: {
                    gte: today
                }
            }
        },
        include: {
            jobListing: true // JobListingの情報も取得
        }
    });

    return jobReReList;
}

export async function getRunableListCount() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 今日の日付の00:00:00に設定

    const jobReReList = await prisma.jobReservationRate.count({
        where: {
            status: 'pending',
            jobListing: {
                targetDate: {
                    gte: today
                }
            }
        },
    });

    return jobReReList;
}

export async function finish(jobReRe,msg="job completely finished"){
    const result = await prisma.jobReservationRate.update({
        where: { id: jobReRe.id },
        data: {
            status: 'completed',
            completedAt: new Date(),
            result: msg
        },
    });

    return result;
}

export async function failed(jobReRe, msg="job failed"){
    const result = await prisma.jobReservationRate.update({
        where: { id: jobReRe.id },
        data: {
            status: 'failed',
            completedAt: new Date(),
            result: msg
        },
    });

    return result;
}