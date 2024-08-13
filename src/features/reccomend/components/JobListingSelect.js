import {useState} from 'react';
import JobListingForSearch from "@/features/reccomend/components/JobListingForSearch";

export default function JobListingSelect({areas, jobListings, onSearch, onSubmit}) {
    console.log(areas);
    const [selectedJobListing, setSelectedJobListing] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ jobListingId: selectedJobListing });
    };

    const handleSearch = (jobListingId) => {
        console.log("handleSearch", jobListingId);
        onSearch(jobListingId);
    }

    return (
        <>
            <JobListingForSearch
                areas={areas}
                jobListings={jobListings}
                onSearch={handleSearch}
            />
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="jobListing" className="block text-sm font-medium text-gray-700">Job Listing</label>
                    <select
                        id="jobListing"
                        value={selectedJobListing}
                        onChange={(e) => setSelectedJobListing(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">選択してください</option>
                        {jobListings.slice(0, 5).map((jobListing) => (
                            <option key={jobListing.id}
                                    value={jobListing.id}>{jobListing.name || `Job Listing ${jobListing.id}`}</option>
                        ))}
                    </select>
                </div>
                <button type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    検索
                </button>
            </form>
        </>
    );
}