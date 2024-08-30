import { bulkExecuteJobReRe, stopBulkExecuteJobReservationRates } from '../JobReservationRateService';
import prisma from "@/commons/libs/prisma";
import runJobReservationRate from "@/features/executeJobReRe/services/runJobReservationRate";
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import * as JobListing from "@/commons/models/JobListing";
import { consoleLog } from "@/commons/utils/log";

jest.mock("@/commons/libs/prisma", () => ({
    jobReservationRate: {
        findMany: jest.fn(),
    },
    jobListing: {
        update: jest.fn(),
    },
}));
jest.mock("@/features/executeJobReRe/services/runJobReservationRate");
jest.mock("@/commons/utils/log");

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
            const mockJobListing = { id: 'job1' };
            const mockJobReservationRates = [
                { id: 'rate1', status: JobReservationRate.STATUS.PENDING },
                { id: 'rate2', status: JobReservationRate.STATUS.PENDING },
            ];
            const mockStopExecutionMap = new Map();

            prisma.jobReservationRate.findMany.mockResolvedValue(mockJobReservationRates);
            runJobReservationRate.mockResolvedValue(undefined);

            const bulkExecutePromise = bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap);

            // Resolve all promises and timers
            await jest.runAllTimersAsync();

            await bulkExecutePromise;

            expect(runJobReservationRate).toHaveBeenCalledTimes(2);
            expect(global.notifyAllClients).toHaveBeenCalledTimes(2);
        });

        it('should stop execution when stopExecutionMap is set', async () => {
            const mockJobListing = { id: 'job1' };
            const mockJobReservationRates = [
                { id: 'rate1', status: JobReservationRate.STATUS.PENDING },
                { id: 'rate2', status: JobReservationRate.STATUS.PENDING },
            ];
            const mockStopExecutionMap = new Map([['job1', true]]);

            prisma.jobReservationRate.findMany.mockResolvedValue(mockJobReservationRates);

            await bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap);

            expect(runJobReservationRate).not.toHaveBeenCalled();
            expect(consoleLog).toHaveBeenCalledWith(expect.stringContaining('stopped'));
        });

        it('should throw an error when no pending job reservation rates are found', async () => {
            const mockJobListing = { id: 'job1' };
            const mockStopExecutionMap = new Map();

            prisma.jobReservationRate.findMany.mockResolvedValue([]);

            await expect(bulkExecuteJobReRe(mockJobListing, mockStopExecutionMap)).rejects.toThrow('jobReservationRates should be not empty');
        });
    });

    describe('stopBulkExecuteJobReservationRates', () => {
        it('should update job listing status and notify clients', async () => {
            const mockJobListingId = 'job1';
            const mockJobListing = { id: mockJobListingId, status: JobListing.STATUS.EXEC_FAILED };
            global.sseClients = { [mockJobListingId]: jest.fn() };
            const mockStopExecutionMap = new Map([['job1', true]]);

            prisma.jobListing.update.mockResolvedValue(mockJobListing);

            await stopBulkExecuteJobReservationRates(mockJobListingId, mockStopExecutionMap);

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