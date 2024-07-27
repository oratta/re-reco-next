export default function JobListingList({jobListings, onSelectJobListing}) {
    return (
        <div>
            <h2 className="mb-4 text-xl font-semibold">Job List</h2>
            <ul className="space-y-2">
                {jobListings.map(jobListing => (
                    <li
                        key={jobListing.id}
                        onClick={() => onSelectJobListing(jobListing)}
                        className="p-2 rounded cursor-pointer hover:bg-gray-100"
                    >
                        {jobListing.areaId} - {jobListing.targetDate} ({jobListing.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};