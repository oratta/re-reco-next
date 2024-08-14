'use client';

import {useContext, useEffect, useState} from 'react';
import JobOrderForm from '@/features/listingCast/components/JobOrderForm';
import {fetchApi, fetchApiForce} from "@/commons/utils/api";
import JobListingForExec from "@/features/listingCast/components/JobListingForExec";
import JobProcessingContext from "@/commons/contexts/JobProcessingContext";
import {establishSSEConnection} from "@/features/listingCast/components/actions/sseConnection";

export default function JobOrderView() {
    const [jobStatus, setJobStatus] = useState({});
    const { processingJobId, setProcessingJobId } = useContext(JobProcessingContext);
    const [jobListings, setJobListings] = useState([]);
    const [selectedJobListing, setSelectedJobListing] = useState(null);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setAreas(await fetchApi('/api/areas'));
            setJobListings(await fetchApi('/api/job-listings?type=listing'));
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchJobListings(){
            try {
                setJobListings(await fetchApiForce('/api/job-listings?type=listing'));
            } catch (error) {
                console.error('Failed to fetch areas');
            }
        }
        fetchJobListings();
        const interval = setInterval(fetchJobListings, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (jobListings.length > 0) {
            // jobListings が更新されたときの処理
            console.log('Job listings updated:', jobListings);
        }
    }, [jobListings]);

    const fetchJobListings = async () => {
        const updatedJobListings =  await fetchApiForce('/api/job-listings?type=latest');
        setJobListings(updatedJobListings);
    }

    const handleBulkExecute = async (jobListingId) => {
        setProcessingJobId(jobListingId);
        establishSSEConnection(processingJobId, setJobStatus, setJobListings, setProcessingJobId);
        try {
            await fetch(`/api/job-listings/${jobListingId}/bulk-execute`, {
                method: 'POST'
            });
            setJobListings(await fetchApi('/api/job-listings?type=listing'));
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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Job Order</h1>
            <JobOrderForm areas={areas} onSubmit={fetchJobListings} />
            <div className="w-full m-1">
                <JobListingForExec
                    areas={areas}
                    jobListings={jobListings}
                    jobStatus={jobStatus}
                    processingJobId={processingJobId}
                    onStop={handleStopExecute}
                    onExecute={handleBulkExecute}
                />
            </div>
        </div>
    );
}