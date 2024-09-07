import React from 'react';
import {CheckCircle, Clock, ListIcon, PauseCircle, PlayCircle, XCircle} from 'lucide-react';
import {STATUS as JOB_LISTING_STATUS} from "@/commons/models/JobListing";

export default function JobListingCard({
                                        jobListing,
                                        renderAction,
                                        showProgress = false,
                                        showDuration = false
                                    }) {
    const getStatusText = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.LIST_RUNNING: return 'Preparing';
            case JOB_LISTING_STATUS.EXEC_RUNNING: return 'Running';
            case JOB_LISTING_STATUS.LIST_COMPLETED: return 'Waiting';
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return 'Completed';
            default: return 'Unknown';
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.EXEC_RUNNING: return 'text-blue-500';
            case JOB_LISTING_STATUS.LIST_COMPLETED: return 'text-yellow-500';
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return 'text-green-500';
            default: return 'text-gray-500';
        }
    };

    const getProgressBarColor = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.EXEC_RUNNING: return 'bg-blue-600';
            case JOB_LISTING_STATUS.LIST_COMPLETED: return 'bg-yellow-600';
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return 'bg-green-600';
            default: return 'bg-gray-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case JOB_LISTING_STATUS.EXEC_RUNNING: return <PlayCircle className="animate-spin" />;
            case JOB_LISTING_STATUS.LIST_COMPLETED: return <PauseCircle />;
            case JOB_LISTING_STATUS.EXEC_COMPLETED: return <CheckCircle />;
            default: return null;
        }
    };

    const formatDate = (targetDate, isNow, startTime) => {
        const today = new Date();
        const target = new Date(targetDate);
        const start = new Date(startTime);

        if (isNow && target.toDateString() === today.toDateString()) {
            return `Today @ ${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')}~`;
        }
        return `${target.getMonth() + 1}/${target.getDate()}`;
    };

    const formatDuration = (start, end) => {
        if (!start || !end) return 'N/A';
        const duration = new Date(end) - new Date(start);
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    const renderQueuePosition = (queuePosition) => {
        if (queuePosition === null || queuePosition === undefined || typeof queuePosition === 'object') {
            return 'N/A';
        }
        return queuePosition;
    };

    return (
        <div key={jobListing.id}
             className="bjobListing p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">
                    {formatDate(jobListing?.targetDate, jobListing?.isNow, jobListing?.startTime)}<br/>{jobListing?.areaName || 'Unknown'}
                </h3>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${getStatusColor(jobListing.status)}`}>
                            {getStatusIcon(jobListing.status)}
                    <span className="ml-1">{getStatusText(jobListing.status)}</span>
                        </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                    <Clock className="mr-1" size={16}/>
                    {jobListing.status === JOB_LISTING_STATUS.EXEC_RUNNING && (
                        <span>
                                    Elapsed: {formatDuration(jobListing.startTime, new Date())}
                                </span>
                    )}
                    {jobListing.status === JOB_LISTING_STATUS.EXEC_COMPLETED && (
                        <span>
                                    Duration: {formatDuration(jobListing.startTime, jobListing.estimatedEndTime)}
                                </span>
                    )}
                    {jobListing.status === JOB_LISTING_STATUS.LIST_COMPLETED && (
                        <span>
                                    Queue Position: {renderQueuePosition(jobListing.queuePosition)}
                                </span>
                    )}
                </div>
                <div className="flex items-center justify-end">
                    <CheckCircle className="mr-1" size={16}/>
                    <span>{jobListing.completeCount}</span>
                    <XCircle className="ml-2 mr-1" size={16}/>
                    <span>{jobListing.failedCount}</span>
                    <ListIcon className="ml-2 mr-1" size={16}/>
                    <span>{jobListing.listSize}</span>
                </div>
            </div>
            <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{Math.round((jobListing.completeCount / jobListing.listSize) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`${getProgressBarColor(jobListing.status)} h-2.5 rounded-full`}
                        style={{width: `${(jobListing.completeCount / jobListing.listSize) * 100}%`}}
                    ></div>
                </div>
            </div>
            {jobListing.status === JOB_LISTING_STATUS.EXEC_RUNNING && jobListing.estimatedEndTime && (
                <div className="mt-2 text-sm text-gray-600">
                    Estimated completion: {new Date(jobListing.estimatedEndTime).toLocaleTimeString()}
                </div>
            )}
            {jobListing.status === JOB_LISTING_STATUS.LIST_COMPLETED && (
                <div className="mt-2 text-sm text-gray-600">
                    Estimated
                    start: {new Date(Date.now() + (renderQueuePosition(jobListing.queuePosition) * 30 * 60000)).toLocaleTimeString()}
                </div>
            )}
        </div
        >
    );
}

function formatDuration(start, end) {
    const duration = end - start;
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
}