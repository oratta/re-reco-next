import {consoleError} from "@/commons/utils/log";
import {chromium} from "playwright";
import {getReservationUrl} from "@/features/listingCast/services/actions/domHeaven.v1";
import {getQuery} from "@/commons/utils/cheerioUtil";

export async function scrapeReservationRate(jobReRe) {
    try{
        const url = getUrl(jobReRe);
        const $ = await getQuery(url);

        return  await getReservationStatus($);
    }
    catch(error){
        consoleError(error, "Failed to scrape reservation rate");
        throw error;
    }
}

function getUrl(jobReRe){
    return getReservationUrl(jobReRe.cast);
}

async function getReservationStatus($){
    let dashCount = 0;
    let telCount = 0;
    let circleCount = 0;
    let otherCount = 0;

    $('#chart > div > table tbody tr td').each((_, cell) => {
        const cellText = $(cell).text().trim();
        const rowspan = parseInt($(cell).attr('rowspan')) || 1;

        // rowspan-single属性がある場合は1としてカウント
        const count = rowspan ? 1 : rowspan;

        if (cellText === '‐') {
            dashCount += count;
        } else if (cellText === 'TEL') {
            telCount += count;
        } else if (cellText.includes('○')) {
            circleCount += count;
        } else if (cellText !== '') {
            otherCount += count;
        }
    });

    //telは予約の有無が判断できないので除外
    return {
        totalCount: dashCount+circleCount+otherCount,
        reservedCount: otherCount,
        emptyCount: circleCount
    };
}