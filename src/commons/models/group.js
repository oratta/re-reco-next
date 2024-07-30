import prisma from '@/commons/libs/prisma';

export async function updateGroupStatistics() {
    try {
        const groups = await prisma.group.findMany({
            include: { casts: { include: { jobReservationRates: true } } },
        });

        for (const group of groups) {
            const allReservationRates = group.casts.flatMap(cast => cast.jobReservationRates);

            const totalReservations = allReservationRates.reduce((sum, rate) => sum + rate.reservedCount, 0);
            const totalCount = allReservationRates.reduce((sum, rate) => sum + rate.totalCount, 0);

            const recent1 = allReservationRates[0] || { reservedRate: 0 };
            const recent5 = allReservationRates.slice(0, 5);
            const recent30days = allReservationRates.filter(rate =>
                new Date(rate.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            );

            await prisma.group.update({
                where: { id: group.id },
                data: {
                    totalReservationRate: totalReservations / totalCount,
                    recent1ReservationRate: recent1.reservedRate,
                    recent5ReservationRate: recent5.reduce((sum, rate) => sum + rate.reservedRate, 0) / recent5.length,
                    recent30daysReservationRate: recent30days.reduce((sum, rate) => sum + rate.reservedRate, 0) / recent30days.length,
                },
            });
        }

        return { success: true, message: 'Group statistics updated successfully' };
    } catch (error) {
        console.error('Failed to update group statistics:', error);
        return { success: false, message: error.message };
    }
}