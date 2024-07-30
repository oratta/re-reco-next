import prisma from '../libs/prisma';

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