'use client';

import React, {useEffect, useState} from 'react';
import { ClipboardList,RefreshCw, ListIcon, Clock, CheckCircle, XCircle, PlayCircle, PauseCircle } from 'lucide-react';
import { STATUS as JOB_LISTING_STATUS } from "@/commons/models/JobListing";
import clientConsole from "@/commons/utils/clientConsole";
import JobListingCard from "@/commons/components/features/JobListingCard";

export default function OrderList({
                                      orderList,
                                      onResume,
                                      showResumeOverlay,
                                      setShowResumeOverlay,
                                  }) {
    const [showCompleted, setShowCompleted] = useState(false);
    const [resumeThresholdHours, setResumeThresholdHours] = useState(10);

    useEffect(() => {
        const shouldShowResume = checkResumeCondition(orderList);
        clientConsole.info('Received ShouldShowResume', shouldShowResume);
        setShowResumeOverlay(shouldShowResume);

    }, [orderList, resumeThresholdHours]);

    const checkResumeCondition = (jobs) => {
        const waitingCount = jobs.filter(job => job.status === JOB_LISTING_STATUS.LIST_COMPLETED).length;
        const runningCount = jobs.filter(job => job.status === JOB_LISTING_STATUS.EXEC_RUNNING).length;
        clientConsole.info(waitingCount, jobs);
        clientConsole.info(runningCount, jobs);
        if(jobs.length === 0 || waitingCount + runningCount === 0) {
            return false;
        }else if( runningCount === 0 && waitingCount > 0){
            return true;
        }
        const execRunningJob = jobs.find(job => job.status === JOB_LISTING_STATUS.EXEC_RUNNING);

        const now = new Date();
        const jobStartTime = new Date(execRunningJob.startTime);
        const hoursPassed = (now - jobStartTime) / (1000 * 60 * 60);
        return hoursPassed > resumeThresholdHours;
    };

    const handleResumeClick = () => {
        onResume();
    };

    const filteredOrderList = showCompleted
        ? orderList
        : orderList.filter(order => order.status !== JOB_LISTING_STATUS.EXEC_COMPLETED);

    return (
        <div className="mt-8 w-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ClipboardList className="mr-2" size={24}/>
                    Order List
                </h2>
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="showCompleted"
                        checked={showCompleted}
                        onChange={(e) => setShowCompleted(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <label htmlFor="showCompleted" className="text-sm text-gray-700">
                        Show completed jobs
                    </label>
                </div>
            </div>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {Array.isArray(filteredOrderList) && filteredOrderList.map((order) => {
                    if (!order || typeof order !== 'object') {
                        console.error('Invalid order object:', order);
                        return null;
                    }
                    clientConsole.info("order",order)
                    return (
                        <JobListingCard
                            key={order.id}
                            jobListing={order}
                            renderAction={()=>{}}
                            showProgress={true}
                            showDuration={true}
                        />
                    );
                })}
                {showResumeOverlay && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-2xl">
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                        <button
                            onClick={handleResumeClick}
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors duration-300 flex items-center mb-4"
                        >
                            <RefreshCw className="mr-2" size={24}/>
                            Resume Jobs
                        </button>
                        <p className="text-white text-center max-w-md px-4">
                            It seems the investigation has been interrupted midway. Please press the Resume button to
                            continue.
                        </p>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
}