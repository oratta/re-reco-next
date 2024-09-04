import prisma from "@/commons/libs/prisma";
import {consoleError} from "@/commons/utils/log";
import {STATUS} from "@/commons/models/JobListing";
import {STATUS as JOB_RE_RE_STATUS} from "@/commons/models/JobReservationRate";
import {bulkExecuteJobReRe as JobReRe_bulkExecuteJobReRe} from "@/services/JobReservationRateService";
import {debugMsg, errorMsg, infoMsg} from "@/commons/utils/logger";
import * as JobListing from "@/commons/models/JobListing";
import {scrapeCastListFromJob} from "@/services/actions/scrapeAndSaveReserveInfo";

const stopExecutionMap = new Map();

export async function createJobListing({areaCode, targetDate, condition}) {
    let jobListing = {};
    try{
        console.log("parameter: ", {areaCode, targetDate, condition});
        jobListing = await prisma.jobListing.create({
            data: {
                status: STATUS.LIST_PENDING,
                areaCode,
                targetDate: new Date(targetDate.match(/^\d{4}-\d{2}-\d{2}$/)
                    ? targetDate
                    : targetDate.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
                condition,
                listCount: 0, // This will be updated after scraping
            },
        });
    }catch(error){
        errorMsg( "failed to create jobListing", error);
        throw error;
    }
    return jobListing;
}

export async function runJobList(job) {
    // runJobを非同期で実行し、その結果を待つ
    try{
        const jobId = job.id;
        job = await JobListing.saveRunning(jobId)

        try{
            const {listSize} = await scrapeCastListFromJob(job);
            job = await JobListing.saveComplete(jobId, listSize);
        }catch(error){
            console.log(error);
            console.log(error.message);
            console.log(error.stack);
            job = JobListing.saveFailed(jobId, error.message);
        }

        return job;
    }catch (error) {
        consoleError(error, "failed to run jobListing", false);
        throw error;
    }
}

/**
 * 同じjobListingを持つjobReservationRatesをバルクで実行する
 * 実行前に、他に実行中のjobReservationRateがある場合はジョブを終了する
 * 実行中のjobReservationRateが完了した場合は、待機しているjobReservationRateを実行する
 * @param jobListing
 * @returns {Promise<void>}
 */
export async function handleBulkExecute(jobListing){
    try {
        const isExecute = await prisma.jobListing.findFirst({
            where: {
                id: jobListing.id,
                status: STATUS.EXEC_RUNNING
            },
            select: {
                status: true
            }
        });
        if(isExecute){
            consoleError("jobListing is already running", "failed to bulkExecuteJobReRe", false);
            throw new Error("jobListing is already running");
        }

        await bulkExecuteJobReRe(jobListing);

        const otherPendingJobList = await prisma.jobListing.findFirst({
            where: {
                status: STATUS.LIST_COMPLETED,
            }
        });
        if(otherPendingJobList?.id){
            bulkExecuteJobReRe(otherPendingJobList).then(r => console.log("bulkExecuteJobReRe", r));
        }
    }catch(error){
        consoleError(error, "failed to bulkExecuteJobReRe", false);
        throw error;
    }
}

async function startBulkExecute(jobListingId){
    const jobListing = await JobListing.startBulkExecute(jobListingId);
    if(!jobListing) throw new Error("jobListing is not found");

    stopExecutionMap.set(jobListingId, false);
    if (globalThis.sseClients && globalThis.sseClients[jobListingId]) {
        globalThis.sseClients[jobListingId]({status: STATUS.EXEC_RUNNING});
    }

    return jobListing;
}

async function failBulkExecute(jobListingId){
    await JobListing.failBulkExecute(jobListingId, "Error in Reservation Rate jobs: ");
}

async function finishBulkExecute(jobListingId){
    await JobListing.finishBulkExecute(jobListingId);
}

export async function bulkExecuteJobReRe(jobListing) {
    const jobListingId = jobListing.id;
    try{
        await startBulkExecute(jobListingId);
        await JobReRe_bulkExecuteJobReRe(jobListing, stopExecutionMap);
        await finishBulkExecute(jobListingId);
    }catch(error){
        await failBulkExecute(jobListingId);
        consoleError(error, "failed to bulkExecuteJobReRe", false);
        throw error;
    }
}

export async function getActiveJobListings() {
    try {
        const jobListings = await prisma.jobListing.findMany({
            where: {
                status: {
                    in: [STATUS.LIST_RUNNING, STATUS.EXEC_RUNNING, STATUS.LIST_COMPLETED, STATUS.EXEC_COMPLETED]
                },
                listCount: {
                    not: 0
                }
            },
            include: {
                area: true,
                jobReservationRates: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const activeJobListings = await Promise.all(jobListings.map(formatActiveJobListing));

        return activeJobListings;
    } catch (error) {
        errorMsg('Error fetching active job listings:', error);
        throw error;
    }
}

export async function formatActiveJobListing(job, completeCount=null, pendingCount=null,failedCount=null) {
    const queuePosition = job.status === STATUS.LIST_COMPLETED ? await getQueuePosition(job.id) : null;
    return {
        id: job.id,
        status: job.status,
        areaName: job.area?.name || 'Unknown Area',
        targetDate: job.targetDate,
        isNow: job.condition.includes('play'),
        listSize: job.listCount,
        completeCount: completeCount!==null ? completeCount : job.jobReservationRates.filter(rate => rate.status === JOB_RE_RE_STATUS.COMPLETED).length,
        pendingCount: pendingCount!==null ? pendingCount : job.jobReservationRates.filter(rate => rate.status === JOB_RE_RE_STATUS.PENDING).length,
        failedCount: failedCount!==null ? failedCount : job.jobReservationRates.filter(rate => rate.status === JOB_RE_RE_STATUS.FAILED).length,
        startTime: job.startedAt,
        estimatedEndTime: job.completedAt || null,
        queuePosition: queuePosition
    };
}

async function getQueuePosition(jobId) {
    try {
        // 現在のジョブの updatedAt を取得
        const currentJob = await prisma.jobListing.findUnique({
            where: { id: jobId },
            select: { updatedAt: true }
        });

        if (!currentJob) {
            throw new Error(`Job with id ${jobId} not found`);
        }

        // LIST_COMPLETED 状態のジョブで、現在のジョブより古い（または同じ）updatedAt を持つジョブの数をカウント
        const queuePosition = await prisma.jobListing.count({
            where: {
                status: STATUS.LIST_COMPLETED,
                updatedAt: {
                    lte: currentJob.updatedAt
                }
            }
        });

        return queuePosition;
    } catch (error) {
        console.error(`Error getting queue position for job ${jobId}:`, error);
        errorMsg(`Error getting queue position for job ${jobId}:`, error);
        return 0;
    }
}

export async function updateJobListingStatus(jobId, newStatus, additionalData = {}) {
    try {
        const updatedJob = await prisma.jobListing.update({
            where: { id: jobId },
            data: {
                status: newStatus,
                ...additionalData
            },
            include: {
                area: true,
                jobReservationRates: true
            }
        });

        const jobData = {
            id: updatedJob.id,
            status: updatedJob.status,
            areaName: updatedJob.area.name,
            targetDate: updatedJob.targetDate,
            isNow: updatedJob.condition.includes('play1'),
            listSize: updatedJob.listCount,
            completeCount: updatedJob.jobReservationRates.filter(rate => rate.status === 'completed').length,
            pendingCount: updatedJob.jobReservationRates.filter(rate => rate.status === 'pending').length,
            failedCount: updatedJob.jobReservationRates.filter(rate => rate.status === 'failed').length,
            startTime: updatedJob.startedAt,
            estimatedEndTime: updatedJob.completedAt || null,
            queuePosition: updatedJob.status === STATUS.LIST_COMPLETED ? await getQueuePosition(updatedJob.id) : null
        };
        console.log(jobData);
        // Notify all clients about the update
        globalThis.notifyAllClients({ type: 'update', data: jobData });

        return jobData;
    } catch (error) {
        errorMsg('Error updating job listing status:', error);
        throw error;
    }
}

export async function resumeIncompleteJobs() {
    try {
        // 実行中のジョブを探す
        let jobToResume = await findJobByStatus(STATUS.EXEC_RUNNING);

        // 実行中のジョブがない場合、完了待ちのジョブを探す
        if (!jobToResume) {
            jobToResume = await findJobByStatus(STATUS.LIST_COMPLETED);
        }

        if (jobToResume) {
            infoMsg(`Resuming job: ${jobToResume.id}`);
            await bulkExecuteJobReRe(jobToResume);
        } else {
            debugMsg('No jobs to resume');
        }
    } catch (error) {
        errorMsg('Error resuming incomplete jobs:', error);
    }
}

async function findJobByStatus(status) {
    return await prisma.jobListing.findFirst({
        where: { status: status },
        orderBy: { createdAt: 'asc' }
    });
}

// 定期的にジョブの状態をチェックし、必要に応じて再開する関数
export async function checkAndResumeJobs() {
    try {
        const runningJob = await findJobByStatus(STATUS.EXEC_RUNNING);
        if (!runningJob) {
            await resumeIncompleteJobs();
        }
    } catch (error) {
        errorMsg('Error checking and resuming jobs:', error);
    }
}

