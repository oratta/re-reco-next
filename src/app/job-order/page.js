'use client';

import {useEffect, useState} from 'react';
import JobOrderForm from './JobOrderForm';
import JobListingList from './JobListingList';
import JobListingDetail from './JobListingDetail';
import {fetchApi} from "@/commons/utils/api";

export default function JobOrderView() {
    const [jobListings, setJobListings] = useState([]);
    const [selectedJobListing, setSelectedJobListing] = useState(null);
    const [areas, setAreas] = useState([]);

    useEffect(() => {
        async function fetchAreas() {
            try {
                setAreas(await fetchApi('/api/areas'));
            } catch (error) {
                console.error('Failed to fetch areas');
            }
        }
        fetchAreas();
    }, []);

    const handleJobOrderSubmit = async (formData) => {
        // TODO: API呼び出しを実装
        console.log('Job order submitted:', formData);
        // ダミーデータを追加
        try{
            setJobListings(prevListings => [...prevListings, {
                id: Date.now().toString(),
                status: 'pending',
                ...formData
            }]);
        }catch(e){
            console.error('Failed to fetch areas');
            throw e;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Job Order</h1>
            <JobOrderForm onSubmit={handleJobOrderSubmit} />
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