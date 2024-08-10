import JobListingForExec from "@/features/listingCast/components/JobListingForExec";

const JobCastListView = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Cast List</h1>
            <JobListingForExec />
        </div>
    );
};

export default JobCastListView;