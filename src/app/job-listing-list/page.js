'use client';

import React, {useContext, useEffect, useState} from 'react';
import JobProcessingContext from '@/commons/contexts/JobProcessingContext';
import * as JobListing from "@/commons/models/JobListing";

const JobCastListView = () => {
    const [jobCastList, setJobCastList] = useState([]);
    const [jobStatus, setJobStatus] = useState({});
    const {processingJobId, setProcessingJobId} = useContext(JobProcessingContext);

    useEffect(() => {
        fetchJobCastList();
    }, []);

    const fetchJobCastList = async () => {
        try {
            const response = await fetch('/api/job-listings?type=listing');
            const data = await response.json();
            setJobCastList(data);
        } catch (error) {
            console.error('Error fetching job cast list:', error);
        }
    };

    const handleBulkExecute = async (jobListingId) => {
        setProcessingJobId(jobListingId);
        try {
            const eventSource = new EventSource(`/api/job-listings/${jobListingId}/bulk-execute`);
            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setJobStatus(prevStatus => ({ ...prevStatus, [jobListingId]: data.status || prevStatus[jobListingId] }));
                if (data.pendingCount !== undefined) {
                    setJobCastList(prevList => prevList.map(job => job.id === jobListingId ? { ...job, pendingCount: data.pendingCount } : job));
                }
                if (data.status === JobListing.STATUS.ALL_JOB_FINISHED) {
                    setProcessingJobId(null);
                    eventSource.close();
                }
            };

            await fetch(`/api/job-listings/${jobListingId}/bulk-execute`, {
                method: 'POST'
            });
            fetchJobCastList(); // Refresh the list after bulk execution
        } catch (error) {
            console.error('Error executing bulk job reservation rates:', error);
            setProcessingJobId(null);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Cast List</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Area Code</th>
                    <th className="py-2 px-4 border-b">Target Date</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Complete Count</th>
                    <th className="py-2 px-4 border-b">Failed Count</th>
                    <th className="py-2 px-4 border-b">Pending Count</th>
                    <th className="py-2 px-4 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                {jobCastList.map(job => (
                    <tr key={job.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{job.areaCode}</td>
                        <td className="py-2 px-4 border-b">{job.targetDate}</td>
                        <td className="py-2 px-4 border-b">{jobStatus[job.id] || job.status}</td>
                        <td className="py-2 px-4 border-b">{job.completeCount}</td>
                        <td className="py-2 px-4 border-b">{job.failedCount}</td>
                        <td className={`py-2 px-4 border-b ${processingJobId === job.id ? 'animate-blink' : ''}`}>{job.pendingCount}</td>
                        <td className="py-2 px-4 border-b">
                            {job.pendingCount === 0 ? (
                                <button className="bg-gray-500 text-white px-4 py-2 rounded" disabled>Finished</button>
                            ) : (
                                <button
                                    onClick={() => handleBulkExecute(job.id)}
                                    className={`px-4 py-2 rounded ${processingJobId === job.id ? 'bg-yellow-500 text-white animate-blink' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                                    disabled={processingJobId !== null && processingJobId !== job.id}
                                >
                                    {processingJobId === job.id ? 'Processing' : 'Bulk Execute'}
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobCastListView;