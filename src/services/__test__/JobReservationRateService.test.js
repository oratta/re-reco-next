import { bulkExecuteJobReRe, stopBulkExecuteJobReservationRates } from '../JobReservationRateService';
import prisma from "@/commons/libs/prisma";
import runJobReservationRate from "@/services/runJobReservationRate";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import * as JobListing from "@/commons/models/JobListing";
import { consoleLog, consoleError } from "@/commons/utils/log";
import { formatActiveJobListing } from "@/services/JobListingsService";

jest.mock("@/commons/libs/prisma", () => ({
    jobReservationRate: {
        findMany: jest.fn(),
    },
    jobListing: {
        update: jest.fn(),
    },
    area: {
        findUnique: jest.fn(),
    }
}));
jest.mock("@/services/runJobReservationRate");
jest.mock("@/commons/utils/log");
jest.mock("@/services/JobListingsService");

describe('JobReservationRateService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.notifyAllClients = jest.fn();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('bulkExecuteJobReRe', () => {
        it('should execute all pending job reservation rates', async () => {
            const mockJobListing = { id: 'job1', areaCode: 'area1' };
            const mockJobReservationRates = [
                { id: 'rate1', status: JobReservationRate.STATUS.PENDING },
                { id: 'rate2', status: JobReservationRate.STATUS.PENDING },
            ];
            const mockArea = { code: 'area1', name: 'Test Area' };
            const mockStopExecutionMap = new Map();

            prisma.jobReservationRate.findMany.mockResolvedValue(mockJobReservationRates);
            prisma.area.findUnique.mockResolvedValue(mockArea);
            runJobReservationRate.mockResolvedValue(true);
            formatActiveJobListing.mockReturnValue({ /* mocked formatted data */ });

            const bulkExecutePromise = bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap);

            // Resolve all promises and timers
            await jest.runAllTimersAsync();

            const result = await bulkExecutePromise;

            expect(runJobReservationRate).toHaveBeenCalledTimes(2);
            expect(global.notifyAllClients).toHaveBeenCalledTimes(2);
            expect(result).toEqual({ completedCount: 2, failedCount: 0, pendingCount: 0 });
        });

        it('should handle job reservation rate execution failure', async () => {
            const mockJobListing = { id: 'job1', areaCode: 'area1' };
            const mockJobReservationRates = [
                { id: 'rate1', status: JobReservationRate.STATUS.PENDING },
                { id: 'rate2', status: JobReservationRate.STATUS.PENDING },
            ];
            const mockArea = { code: 'area1', name: 'Test Area' };
            const mockStopExecutionMap = new Map();

            prisma.jobReservationRate.findMany.mockResolvedValue(mockJobReservationRates);
            prisma.area.findUnique.mockResolvedValue(mockArea);
            runJobReservationRate.mockRejectedValueOnce(new Error('Execution failed'))
                .mockResolvedValueOnce(true);
            formatActiveJobListing.mockReturnValue({ /* mocked formatted data */ });

            const bulkExecutePromise = bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap);

            // Resolve all promises and timers
            await jest.runAllTimersAsync();

            const result = await bulkExecutePromise;

            expect(runJobReservationRate).toHaveBeenCalledTimes(2);
            expect(consoleError).toHaveBeenCalledWith(expect.any(Error), expect.stringContaining('Error running job reservation rate'));
            expect(result).toEqual({ completedCount: 1, failedCount: 1, pendingCount: 0 });
        });

        it('should stop execution when stopExecutionMap is set', async () => {
            const mockJobListing = { id: 'job1', areaCode: 'area1' };
            const mockJobReservationRates = [
                { id: 'rate1', status: JobReservationRate.STATUS.PENDING },
                { id: 'rate2', status: JobReservationRate.STATUS.PENDING },
            ];
            const mockArea = { code: 'area1', name: 'Test Area' };
            const mockStopExecutionMap = new Map([['job1', true]]);

            prisma.jobReservationRate.findMany.mockResolvedValue(mockJobReservationRates);
            prisma.area.findUnique.mockResolvedValue(mockArea);

            const result = await bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap);

            expect(runJobReservationRate).not.toHaveBeenCalled();
            expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('stopped'));
            expect(result).toEqual({ completedCount: 0, failedCount: 0, pendingCount: 2 });
        });

        it('should throw an error when no pending job reservation rates are found', async () => {
            const mockJobListing = { id: 'job1', areaCode: 'area1' };
            const mockStopExecutionMap = new Map();

            prisma.jobReservationRate.findMany.mockResolvedValue([]);

            await expect(bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap)).rejects.toThrow('jobReservationRates should be not empty');
        });

        it('should throw an error when area is not found', async () => {
            const mockJobListing = { id: 'job1', areaCode: 'area1' };
            const mockJobReservationRates = [
                { id: 'rate1', status: JobReservationRate.STATUS.PENDING },
            ];
            const mockStopExecutionMap = new Map();

            prisma.jobReservationRate.findMany.mockResolvedValue(mockJobReservationRates);
            prisma.area.findUnique.mockResolvedValue(null);

            await expect(bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap)).rejects.toThrow('Area with code area1 not found');
        });
    });

    describe('stopBulkExecuteJobReservationRates', () => {
        it('should update job listing status and notify clients', async () => {
            const mockJobListingId = 'job1';
            const mockJobListing = { id: mockJobListingId, status: JobListing.STATUS.EXEC_FAILED };
            global.sseClients = { [mockJobListingId]: jest.fn() };
            const mockStopExecutionMap = new Map();

            prisma.jobListing.update.mockResolvedValue(mockJobListing);

            await stopBulkExecuteJobReservationRates(mockJobListingId, mockStopExecutionMap);

            expect(mockStopExecutionMap.get(mockJobListingId)).toBe(true);
            expect(prisma.jobListing.update).toHaveBeenCalledWith({
                where: {
                    id: mockJobListingId,
                    status: JobListing.STATUS.EXEC_RUNNING
                },
                data: {
                    status: JobListing.STATUS.EXEC_FAILED,
                    message: "Job stopped by user"
                }
            });
            expect(global.sseClients[mockJobListingId]).toHaveBeenCalledWith({ status: JobListing.STATUS.EXEC_FAILED });
        });
    });
});