'use client';

import React, { useContext, useEffect, useState } from 'react';
import JobProcessingContext from '@/commons/contexts/JobProcessingContext';
import * as JobListing from "@/commons/models/JobListing";
import { FaPlay, FaStop, FaCheck } from 'react-icons/fa';
import {fetchApi} from "@/commons/utils/api";

const JobCastListView = () => {
    const [jobCastList, setJobCastList] = useState([]);
    const [jobStatus, setJobStatus] = useState({});
    const [areas, setAreas] = useState([]);
    const { processingJobId, setProcessingJobId } = useContext(JobProcessingContext);

    useEffect( () => {
        async function fetchDefault(){
            setJobCastList(await fetchApi('/api/job-listings?type=listing'));
            setAreas(await fetchApi('/api/areas?type=index_code'));
        }
        if (processingJobId) {
            reestablishSSEConnection(processingJobId);
        }
        fetchDefault()
    }, []);

    const reestablishSSEConnection = (jobListingId) => {
        const eventSource = new EventSource(`/api/job-listings/${jobListingId}/bulk-execute`);
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setJobStatus(prevStatus => ({ ...prevStatus, [jobListingId]: data.status || prevStatus[jobListingId] }));
            if (data.pendingCount !== undefined) {
                setJobCastList(prevList => prevList.map(job => job.id === jobListingId ? { ...job, pendingCount: data.pendingCount } : job));
            }
            if (data.status === JobListing.STATUS.ALL_JOB_FINISHED || data.status === 'stopped') {
                setProcessingJobId(null);
                eventSource.close();
            }
        };
    };

    const handleBulkExecute = async (jobListingId) => {
        setProcessingJobId(jobListingId);
        reestablishSSEConnection(jobListingId);
        try {
            await fetch(`/api/job-listings/${jobListingId}/bulk-execute`, {
                method: 'POST'
            });
            setJobCastList(await fetchApi('/api/job-listings?type=listing'));
        } catch (error) {
            console.error('Error executing bulk job reservation rates:', error);
            setProcessingJobId(null);
        }
    };

    const handleStopExecute = async (jobListingId) => {
        try {
            await fetch(`/api/job-listings/${jobListingId}/bulk-execute`, {
                method: 'DELETE'
            });
            setProcessingJobId(null);
        } catch (error) {
            console.error('Error stopping bulk job reservation rates:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Cast List</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                <tr>
                    <th className="py-2 px-4 border-b">Area Name</th>
                    <th className="py-2 px-4 border-b">Target Date</th>
                    <th className="py-2 px-4 border-b">Status</th>
                    <th className="py-2 px-4 border-b">Pending Count</th>
                    <th className="py-2 px-4 border-b">Action</th>
                </tr>
                </thead>
                <tbody>
                {jobCastList.map(job => (
                    <tr key={job.id} className="hover:bg-gray-100">
                        <td className="py-2 px-4 border-b">{areas[job.areaCode]?.name}</td>
                        <td className="py-2 px-4 border-b">{new Date(job.targetDate).toISOString().split('T')[0]}</td>
                        <td className="py-2 px-4 border-b">{jobStatus[job.id] || job.status}</td>
                        <td className={`py-2 px-4 border-b ${processingJobId === job.id ? 'animate-blink' : ''}`}>{job.pendingCount}</td>
                        <td className="py-2 px-4 border-b">
                            {job.pendingCount === 0 ? (
                                <FaCheck className="text-gray-500" />
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleBulkExecute(job.id)}
                                        className={`px-4 py-2 rounded ${processingJobId === job.id ? 'bg-yellow-500 text-white animate-blink' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                                        disabled={processingJobId !== null && processingJobId !== job.id}
                                        style={{ backgroundColor: processingJobId !== null && processingJobId !== job.id ? 'gray' : '' }}
                                    >
                                        <FaPlay color="white" />
                                    </button>
                                    {processingJobId === job.id && (
                                        <button
                                            onClick={() => handleStopExecute(job.id)}
                                            className="ml-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-700"
                                        >
                                            <FaStop />
                                        </button>
                                    )}
                                </>
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