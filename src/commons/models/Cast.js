import prisma from '../libs/prisma';
import {URL_BASE_CAST_LIST} from "@/configs/appConst";
import {consoleLog} from "@/commons/utils/log";

export function urlToCastData(href){
    //[0]https:/[1]/[2]www.cityheaven.net/[3]tokyo/[4]A1304/[5]A130401/[6]blendatokyo-s/[7]A6ShopReservation/[8]?girl_id=54263599
    const idMatch = href.match(/girl_id=(\d+)/);
    const id = idMatch ? idMatch[1] : null;

    // areaCodeを抽出
    const areaCodeMatch = href.match(/\/([^\/]+\/[^\/]+\/[^\/]+)\//);
    const areaCode = areaCodeMatch ? areaCodeMatch[1] : null;

    // groupCodeを抽出
    const groupCodeMatch = href.match(/\/([^\/]+)\/A6ShopReservation\//);
    const groupCode = groupCodeMatch ? groupCodeMatch[1] : null;

    const reservationUrl = `${URL_BASE_CAST_LIST}${href}`;
    return {
        code: id,
        areaCode,
        groupCode,
        reservationUrl: reservationUrl,
        group: {
            reservationListUrl: reservationUrl.split('?')[0]
        }
    };
}

export async function finishJobReservationRate(cast, updateInfo = {}) {
    try {
        const jobReRes = await prisma.jobReservationRate.findMany({
            where: {
                castCode: cast.code,
                status: 'completed',
            },
            orderBy: {createdAt: 'desc'},
        });

        consoleLog(`[Info] JobReservationRate for cast:${cast.code} count:${jobReRes.length}`);

        if (jobReRes.length === 0) {
            consoleLog(`[Alert] No jobReservationRate for cast:${cast.code}`);
            throw new Error("No jobReservationRate");
        }

        const totalCountSum = jobReRes.reduce((sum, record) => sum + record.totalCount, 0);
        const reservedRateSum = jobReRes.reduce((sum, record) => sum + record.reservedRate, 0);
        const recent1ReservationRate = jobReRes[0].reservedRate;
        const recent5ReservationRate = jobReRes.slice(0, 5).reduce((sum, record) => sum + record.reservedRate, 0) / Math.min(5, jobReRes.length);
        const recent30daysReservationRate = jobReRes.filter(record => (new Date() - new Date(record.createdAt)) <= 30 * 24 * 60 * 60 * 1000)
            .reduce((sum, record, _, arr) => sum + record.reservedRate / arr.length, 0);

        await prisma.cast.update({
            where: {code: cast.code},
            data: {
                averageTotalCount: totalCountSum / jobReRes.length,
                totalReservationRate: reservedRateSum,
                recent1ReservationRate,
                recent5ReservationRate,
                recent30daysReservationRate,
                ...updateInfo
            }
        });

        return {success: true, message: 'Cast statistics updated successfully.'};
    } catch (error) {
        console.error('Failed to update cast statistics:', error);
        return {success: false, message: error.message};
    }
}

export function getSumbnailUrl(cast){
    //https://img.cityheaven.net/img/girls/tt/smc-gotanda/sn_grpb0036197866_0000000000mb.jpg
    return `https://img.cityheaven.net/img/girls/tt/${cast.groupCode}/sn_grpb00${cast.code}_0000000000mb.jpg`
}
