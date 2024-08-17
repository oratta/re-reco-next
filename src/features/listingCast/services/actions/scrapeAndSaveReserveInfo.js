import prisma from '@/commons/libs/prisma';
import {URL_BASE_CAST_LIST} from '@/configs/appConst';
import {MAX_CAST_LIST_SIZE} from "@/configs/appSetting";
import {consoleError, consoleLog} from "@/commons/utils/log";
import {getAreaName, getCastList, getListSize, getPagingList} from "@/commons/libs/domHeaven.v1";
import {formatDate} from "date-fns";
import {getQuery} from "@/commons/utils/cheerioUtil";

/**
 * TODO ページング対応
 * @param jobListing
 * @returns {Promise<{success: boolean, listSize, message: string}>}
 */
export async function scrapeCastListFromJob(jobListing) {
    try {
        const url = getUrl(jobListing);
        const $ = await getQuery(url);
        const {areaName, listSize} = scrapeCastListInfo($);


        consoleLog(`List Size: ${listSize}`);
        if (isNaN(listSize) || listSize > MAX_CAST_LIST_SIZE) {
            throw new Error(`Error: Invalid or too large list size: ${listSize}`);
        }

        await scrapeAndSaveReserveInfo($, jobListing.id);

        return { success: true, message: 'Scraping completed', listSize: listSize};
    } catch (error) {
        consoleError(error, "failed to get scraping list", false);
        return { success: false, message: 'Scraping failed'};
    }
}

export function scrapeCastListInfo($){
    const listSize = getListSize($);
    const areaName = getAreaName($);
    if(!areaName){
        throw new Error('Error: Area name is empty');
    }
    return {areaName, listSize};
}

export async function scrapeAndSaveReserveInfo($, jobListId){
    try{
        const pageList = getPagingList($);
        consoleLog(`pageSize: ${pageList.length+1}`);
        consoleLog(pageList);

        await createJobReserveRate($, jobListId);
        for(const page of pageList) {
            const $ = await getQuery(page);
            await createJobReserveRate($, jobListId);
        }

        return true;

    }catch (error) {
        throw error;
    }
}

async function createJobReserveRate($, jobListingId) {
    const castList = getCastList($);

    if (castList.length <= 0) {
        throw new Error('Error: List size is ZERO');
    }
    castList.at(-1).isLastList = true;

    // トランザクションを使用してデータベース操作を行う
    for (const cast of castList) {
        try {
            await prisma.$transaction(async (tx) => {
                await tx.area.upsert({
                    where: {code: cast.areaCode},
                    update: {},
                    create: {
                        name: cast.areaCode,
                        code: cast.areaCode,
                    },
                })

                // Group の connectOrCreate
                await tx.group.upsert({
                    where: {code: cast.groupCode},
                    update: {},
                    create: {
                        code: cast.groupCode,
                        areaCode: cast.areaCode,
                        totalReservationRate: 0,
                        recent1ReservationRate: 0,
                        recent5ReservationRate: 0,
                        recent30daysReservationRate: 0,
                        reservationListUrl: cast.group.reservationListUrl,
                    },
                });

                // Cast の connectOrCreate
                await tx.cast.upsert({
                    where: {code: cast.code},
                    update: {},
                    create: {
                        code: cast.code,
                        areaCode: cast.areaCode,
                        groupCode: cast.groupCode,
                        averageTotalCount: 0,
                        totalReservationRate: 0,
                        recent1ReservationRate: 0,
                        recent5ReservationRate: 0,
                        recent30daysReservationRate: 0,
                        reservationUrl: cast.reservationUrl,
                    },
                });

                // JobReservationRate の作成
                await tx.jobReservationRate.create({
                    data: {
                        status: 'pending',
                        areaCode: cast.areaCode,
                        castCode: cast.code,
                        groupCode: cast.groupCode,
                        reservedRate: 0,
                        reservedCount: 0,
                        emptyCount: 0,
                        totalCount: 0,
                        jobListingId: jobListingId,
                        isLastList: cast.isLastList || false,
                    },
                });
                consoleLog("create jobReservationRate");
            });
        } catch (error) {
            consoleLog("[Alert] fail to save at jobListing:" + error.message);
            consoleLog(cast);
        }
    }
    consoleLog("Job finished: 1 page");
}

function getUrl(jobListing) {
    // return "https://www.cityheaven.net/tokyo/A1304/A130401-A130404/girl-list/";
    consoleLog(jobListing);
    return `${URL_BASE_CAST_LIST}/${jobListing.areaCode}/${jobListing.condition}/${formatDate(jobListing.targetDate,"'date'yyyyMMdd")}/`;
}