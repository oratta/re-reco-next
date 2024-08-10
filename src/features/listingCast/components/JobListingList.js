export default function JobListingList({jobListings, onSelectJobListing, areas}) {
    areas = Object.values(areas);
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
                        {areas.find(area=>area.code===jobListing.areaCode)?.name || "NoArea"} - {jobListing.targetDate || "NoDate"} ({jobListing.status})
                    </li>
                ))}
            </ul>
        </div>
    );
};