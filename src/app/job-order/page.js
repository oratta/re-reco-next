'use client';

import { useState } from 'react';
import JobOrderForm from './JobOrderForm';
import JobListingList from './JobListingList';
import JobListingDetail from './JobListingDetail';

export default function JobOrderView() {
    const [jobListings, setJobListings] = useState([]);
    const [selectedJobListing, setSelectedJobListing] = useState(null);

    const handleJobOrderSubmit = async (formData) => {
        // TODO: API呼び出しを実装
        console.log('Job order submitted:', formData);
        // ダミーデータを追加
        setJobListings(prevListings => [...prevListings, {
            id: Date.now().toString(),
            status: 'pending',
            ...formData
        }]);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">ジョブ注文</h1>
            <JobOrderForm onSubmit={handleJobOrderSubmit} />
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <JobListingList
                        jobListings={jobListings}
                        onSelectJobListing={setSelectedJobListing}
                    />
                </div>
                <div className="w-1/2">
                    {selectedJobListing && <JobListingDetail jobListing={selectedJobListing} />}
                </div>
            </div>
        </div>
    );
}