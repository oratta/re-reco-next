import prisma from "@/commons/libs/prisma";
import * as Cast from "@/commons/models/Cast";

export const STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETED: 'completed',
    FAILED: 'failed'
};

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

export async function finish(jobReRe, cast, castUpdateInfo, msg = "job completely finished") {
    jobReRe = await prisma.jobReservationRate.update({
        where: { id: jobReRe.id },
        data: {
            status: 'completed',
            completedAt: new Date(),
            totalCount: jobReRe.totalCount,
            reservedCount: jobReRe.reservedCount,
            emptyCount: jobReRe.emptyCount,
            reservedRate: jobReRe.reservedRate,
            result: msg
        },
    });

    await Cast.finishJobReservationRate(cast, castUpdateInfo);

    return jobReRe;
}

export async function failed(jobReRe, msg="job failed"){
    const result = await prisma.jobReservationRate.update({
        where: { id: jobReRe.id },
        data: {
            status: STATUS.FAILED,
            completedAt: new Date(),
            result: msg
        },
    });

    return result;
}