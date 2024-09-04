'use client';

import JobListingForExec from "@/app/job-listing-list/JobListingForExec";
import {useContext, useEffect, useState} from "react";
import {fetchApi} from "@/commons/utils/api";
import JobProcessingContext from "@/commons/components/contexts/JobProcessingContext";
import {establishSSEConnection,} from "@/commons/utils/sseConnection";
import {useAreas} from "@/commons/components/contexts/AreasContext";
import {useLoadingSetter} from "@/commons/components/contexts/LoadingContext";

const JobCastListView = () => {
    const [jobStatus, setJobStatus] = useState({});
    const { processingJobId, setProcessingJobId } = useContext(JobProcessingContext);
    const [jobListings, setJobListings] = useState([]);
    const areas = useAreas();
    const setIsLoading = useLoadingSetter();

    useEffect(() => {
        async function fetchData() {
            setJobListings(await fetchApi('/api/job-listings?type=listing', 'GET', setIsLoading));
        }
        fetchData();
        if (processingJobId) {
            establishSSEConnection(processingJobId, setJobStatus, setJobListings, setProcessingJobId);
        }
    }, []);

    const handleBulkExecute = async (jobListingId) => {
        setProcessingJobId(jobListingId);
        establishSSEConnection(processingJobId, setJobStatus, setJobListings, setProcessingJobId);
        try {
            await fetch(`/api/job-listings/${jobListingId}/bulk-execute`, {
                method: 'POST'
            });
            setJobListings(await fetchApi('/api/job-listings?type=listing', 'GET', setIsLoading));
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
            <JobListingForExec
                areas={areas}
                jobListings={jobListings}
                jobStatus={jobStatus}
                processingJobId={processingJobId}
                onStop={handleStopExecute}
                onExecute={handleBulkExecute}
            />
        </div>
    );
};

export default JobCastListView;