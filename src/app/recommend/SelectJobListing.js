import React from 'react';
import OrderList from '@/app/order/OrderList';
import { Search } from 'lucide-react';
import JobListingList from "@/app/recommend/JobListingList";

export default function SelectJobListing({ areas, jobListings, onSearch }) {
    const formatJobListings = (jobListings) => {
        return jobListings
            .filter(job => job.status === 'bulk_exec_completed')
            .map(job => ({
                id: job.id,
                areaName: areas.find(area => area.code === job.areaCode)?.name || 'Unknown Area',
                targetDate: job.targetDate,
                listCount: job.listCount || 0,
                completeCount: job.completeCount || 0,
            }));
    };

    const handleSearch = (jobId) => {
        onSearch(jobId);
    };

    return (
        <JobListingList
            jobListings={formatJobListings(jobListings)}
            onSearch={handleSearch}
        />
    );
}