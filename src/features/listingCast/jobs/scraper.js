import prisma from '@/commons/libs/prisma';

export async function scrapeJobListing(jobListingId) {
    try {
        const jobListing = await prisma.jobListing.findUnique({
            where: { id: jobListingId },
            include: { area: true },
        });

        if (!jobListing) {
            throw new Error('Job listing not found');
        }

        // ダミーのスクレイピング処理
        // 実際にはここで対象サイトからデータを取得します
        const scrapedData = [
            { castId: 'cast1', reservedRate: 0.8, reservedCount: 8, emptyCount: 2, totalCount: 10 },
            { castId: 'cast2', reservedRate: 0.7, reservedCount: 7, emptyCount: 3, totalCount: 10 },
        ];

        // スクレイピング結果を保存
        for (const data of scrapedData) {
            await prisma.jobReservationRate.create({
                data: {
                    status: 'completed',
                    castId: data.castId,
                    areaCode: jobListing.area.code,
                    groupCode: 'dummy', // グループコードの取得ロジックが必要
                    reservedRate: data.reservedRate,
                    reservedCount: data.reservedCount,
                    emptyCount: data.emptyCount,
                    totalCount: data.totalCount,
                    jobListingId: jobListing.id,
                    isLastList: false, // 最後のリストかどうかの判定ロジックが必要
                },
            });
        }

        // Job Listingの更新
        await prisma.jobListing.update({
            where: { id: jobListingId },
            data: {
                status: 'completed',
                completedAt: new Date(),
                listCount: scrapedData.length,
            },
        });

        return { success: true, message: 'Scraping completed' };
    } catch (error) {
        console.error('Scraping failed:', error);
        return { success: false, message: error.message };
    }
}