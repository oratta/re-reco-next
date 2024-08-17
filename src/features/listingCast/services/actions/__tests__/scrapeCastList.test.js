import { scrapeCastListFromJob} from '@/features/listingCast/services/actions/scrapeAndSaveReserveInfo';
import prisma from '@/commons/libs/prisma';
import { getQuery } from '@/commons/utils/cheerioUtil';
import { consoleError, consoleLog } from '@/commons/utils/log';
import { getCastList, getListSize, getPagingList } from '@/commons/libs/domHeaven.v1';
import { MAX_CAST_LIST_SIZE } from '@/configs/appSetting';

jest.mock('@/commons/libs/prisma', () => ({
    jobListing: {
        update: jest.fn(),
    },
    $transaction: jest.fn(),
    area: { upsert: jest.fn() },
    group: { upsert: jest.fn() },
    cast: { upsert: jest.fn() },
    jobReservationRate: { create: jest.fn() },
}));
jest.mock('@/commons/utils/cheerioUtil');
jest.mock('@/commons/utils/log');
jest.mock('@/commons/libs/domHeaven.v1');

describe('scrapeCastList', () => {
    const jobListing = { id: 1, areaCode: 'A1304', condition: 'some-condition', targetDate: new Date() };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // ... 既存のテストケース ...
    it('completes scraping successfully with valid list size', async () => {
        getQuery.mockResolvedValueOnce({});
        getListSize.mockReturnValueOnce(3);
        getPagingList.mockReturnValueOnce([]);
        getCastList.mockReturnValueOnce([{ code: 'cast1', areaCode: 'A1304', groupCode: 'group1', reservationUrl: 'url1' }]);

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: true, message: 'Scraping completed', listSize: 3 });
    });

    it('fails when list size is NaN', async () => {
        getQuery.mockResolvedValueOnce({});
        getListSize.mockReturnValueOnce(NaN);

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: false, message: 'Scraping failed' });
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error), "failed to get scraping list", false);
    });

    it('fails when list size exceeds maximum', async () => {
        getQuery.mockResolvedValueOnce({});
        getListSize.mockReturnValueOnce(MAX_CAST_LIST_SIZE + 1);

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: false, message: 'Scraping failed' });
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error), "failed to get scraping list", false);
    });

    it('handles multiple pages correctly', async () => {
        getQuery.mockResolvedValueOnce({});
        getListSize.mockReturnValueOnce(3);
        getPagingList.mockReturnValueOnce(['page1', 'page2']);
        getCastList.mockReturnValueOnce([{ code: 'cast1', areaCode: 'A1304', groupCode: 'group1', reservationUrl: 'url1' }]);

        getQuery.mockResolvedValueOnce({});
        getCastList.mockReturnValueOnce([{ code: 'cast2', areaCode: 'A1304', groupCode: 'group1', reservationUrl: 'url2' }]);

        getQuery.mockResolvedValueOnce({});
        getCastList.mockReturnValueOnce([{ code: 'cast3', areaCode: 'A1304', groupCode: 'group1', reservationUrl: 'url3' }]);

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: true, message: 'Scraping completed', listSize: 3 });
    });

    it('handles empty list correctly', async () => {
        getQuery.mockResolvedValue({});
        getListSize.mockReturnValue(0);
        getPagingList.mockReturnValue([]);
        getCastList.mockReturnValue([]);

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: false, message: 'Scraping failed' });
    });

    it('handles list size equal to MAX_CAST_LIST_SIZE', async () => {
        getQuery.mockResolvedValue({});
        getListSize.mockReturnValue(MAX_CAST_LIST_SIZE);
        getPagingList.mockReturnValue([]);
        getCastList.mockReturnValue(Array(MAX_CAST_LIST_SIZE).fill({ code: 'cast', areaCode: 'A1304', groupCode: 'group' }));

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: true, message: 'Scraping completed', listSize: MAX_CAST_LIST_SIZE });
    });

    it('handles getQuery throwing an error', async () => {
        getQuery.mockRejectedValue(new Error('Network error'));

        const result = await scrapeCastListFromJob(jobListing);

        expect(result).toEqual({ success: false, message: 'Scraping failed' });
        expect(consoleError).toHaveBeenCalledWith(expect.any(Error), "failed to get scraping list", false);
    });

    describe('createJobReserveRate functionality (through scrapeCastList)', () => {
        const jobListing = { id: 1, areaCode: 'A1304', condition: 'some-condition', targetDate: new Date() };
        const mockCastList = [
            {
                code: 'cast1',
                areaCode: 'area1',
                groupCode: 'group1',
                reservationUrl: 'url1',
                group: { reservationListUrl: 'groupUrl1' },
            },
            {
                code: 'cast2',
                areaCode: 'area2',
                groupCode: 'group2',
                reservationUrl: 'url2',
                group: { reservationListUrl: 'groupUrl2' },
            },
        ];

        beforeEach(() => {
            jest.clearAllMocks();
            getQuery.mockResolvedValue({});
            getListSize.mockReturnValue(mockCastList.length);
            getPagingList.mockReturnValue([]);
            getCastList.mockReturnValue(mockCastList);
            prisma.$transaction.mockImplementation((callback) => callback(prisma));
        });

        it('processes cast list and creates job reservation rates', async () => {
            await scrapeCastListFromJob(jobListing);

            expect(getCastList).toHaveBeenCalled();
            expect(prisma.$transaction).toHaveBeenCalledTimes(mockCastList.length);

            mockCastList.forEach((cast, index) => {
                expect(prisma.area.upsert).toHaveBeenCalledWith(expect.objectContaining({
                    where: { code: cast.areaCode },
                }));
                expect(prisma.group.upsert).toHaveBeenCalledWith(expect.objectContaining({
                    where: { code: cast.groupCode },
                }));
                expect(prisma.cast.upsert).toHaveBeenCalledWith(expect.objectContaining({
                    where: { code: cast.code },
                }));
                expect(prisma.jobReservationRate.create).toHaveBeenCalledWith(expect.objectContaining({
                    data: expect.objectContaining({
                        castCode: cast.code,
                        jobListingId: jobListing.id,
                        isLastList: index === mockCastList.length - 1,
                    }),
                }));
            });

            expect(consoleLog).toHaveBeenCalledWith("Job finished: 1 page");
        });

        it('handles empty cast list', async () => {
            getCastList.mockReturnValue([]);

            const result = await scrapeCastListFromJob(jobListing);

            expect(result).toEqual({ success: false, message: 'Scraping failed' });
            expect(consoleError).toHaveBeenCalledWith(expect.any(Error), "failed to get scraping list", false);
        });

        it('logs an error if transaction fails', async () => {
            const mockError = new Error('Transaction failed');
            prisma.$transaction.mockRejectedValue(mockError);

            await scrapeCastListFromJob(jobListing);

            expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining("[Alert] fail to save at jobListing:"));
            expect(consoleLog).toHaveBeenCalledWith(expect.any(Object)); // cast object logging
        });
    });
});

