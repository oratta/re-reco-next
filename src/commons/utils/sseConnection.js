import * as JobListing from "@/commons/models/JobListing";

export function establishSSEConnection(jobListingId, setJobStatus, setJobListings, setProcessingJobId) {
    const eventSource = new EventSource(`/api/job-listings/${jobListingId}/bulk-execute`);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setJobStatus(prevStatus => ({ ...prevStatus, [jobListingId]: data.status || prevStatus[jobListingId] }));
        if (data.pendingCount !== undefined) {
            setJobListings(prevList => prevList.map(job => job.id === jobListingId ? { ...job, pendingCount: data.pendingCount } : job));
        }
        if (data.status === JobListing.STATUS.ALL_JOB_FINISHED || data.status === 'stopped') {
            setProcessingJobId(null);
            eventSource.close();
        }
    };
};