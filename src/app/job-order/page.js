'use client';

import {useEffect, useState} from 'react';
import JobOrderForm from '@/features/listingCast/components/JobOrderForm';
import JobListingList from '@/features/listingCast/components/JobListingList';
import JobListingDetail from '@/features/listingCast/components/JobListingDetail';
import {fetchApi, fetchApiForce} from "@/commons/utils/api";

export default function JobOrderView() {
    const [jobListings, setJobListings] = useState([]);
    const [selectedJobListing, setSelectedJobListing] = useState(null);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                setAreas(await fetchApi('/api/areas'));
                setJobListings(await fetchApi('/api/job-listings'));
            } catch (error) {
                console.error('Failed to fetch areas');
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        async function fetchJobListings(){
            try {
                setJobListings(await fetchApiForce('/api/job-listings'));
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

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Job Order</h1>
            <JobOrderForm areas={areas} onSubmit={fetchJobListings} />
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <JobListingList
                        jobListings={jobListings}
                        onSelectJobListing={setSelectedJobListing}
                        areas={areas}
                    />
                </div>
                <div className="w-1/2">
                    {selectedJobListing && <JobListingDetail jobListing={selectedJobListing} areas={areas} />}
                </div>
            </div>
        </div>
    );
}