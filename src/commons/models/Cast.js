import prisma from '../libs/prisma';
import {URL_BASE_CAST_LIST} from "@/configs/appConst";

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

export async function updateCastData(castId) {
    try {
        const cast = await prisma.cast.findUnique({
            where: { id: castId },
            include: { jobReservationRates: true },
        });

        if (!cast) {
            throw new Error('Cast not found');
        }

        const totalReservations = cast.jobReservationRates.reduce((sum, rate) => sum + rate.reservedCount, 0);
        const totalCount = cast.jobReservationRates.reduce((sum, rate) => sum + rate.totalCount, 0);

        const recent1 = cast.jobReservationRates[0] || { reservedRate: 0 };
        const recent5 = cast.jobReservationRates.slice(0, 5);
        const recent30days = cast.jobReservationRates.filter(rate =>
            new Date(rate.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        const updatedCast = await prisma.cast.update({
            where: { id: castId },
            data: {
                averageTotalCount: totalCount / cast.jobReservationRates.length,
                totalReservationRate: totalReservations / totalCount,
                recent1ReservationRate: recent1.reservedRate,
                recent5ReservationRate: recent5.reduce((sum, rate) => sum + rate.reservedRate, 0) / recent5.length,
                recent30daysReservationRate: recent30days.reduce((sum, rate) => sum + rate.reservedRate, 0) / recent30days.length,
            },
        });

        return { success: true, updatedCast };
    } catch (error) {
        console.error('Failed to update cast data:', error);
        return { success: false, message: error.message };
    }
}