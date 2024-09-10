import React from 'react';
import { ClipboardList, ListIcon, Search } from 'lucide-react';
import JobListingCard from "@/commons/components/features/JobListingCard";

export default function JobListingList({ jobListings, onSearch }) {
    const renderSearchAction = (job) => (
        <button
            onClick={() => onSearch(job.id)}
            className="mr-2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600"
            aria-label="Search"
        >
            <Search size={16} />
        </button>
    );

    return (
        <div className="mt-8 w-full">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ClipboardList className="mr-2" size={24}/>
                Completed Job Listings
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {jobListings.map((job) => (
                    <JobListingCard
                        key={job.id}
                        jobListing={job}
                        renderAction={renderSearchAction}
                        showProgress={false}
                        showDuration={false}
                    />
                ))}
            </div>
        </div>
    );
}