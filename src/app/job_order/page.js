'use client';

import {useState, useEffect} from "react";
import JobList from "@/app/components/JobList";
import JobDetail from "@/app/components/JobDetails";

export default function JobOrderPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedJob, setSelectedJob] = useState(null);

    const fetchJobs = async () => {
        const response = await fetch('/api/job');
        const data = await response.json();
        setJobs(data.jobs);
    }

    useEffect(()=>{
        fetchJobs();
        const interval = setInterval(fetchJobs, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleCreateJob = async () => {
        await fetch('/api/job', {method: 'POST'});
        fetchJobs();
    }
    const handleRunJob = async (jobId) => {
        await fetch(`/api/job/${jobId}`, { method: 'PUT' });
        fetchJobs();
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Job Order
            </h1>
            <button
                className="bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded mb-4"
                onClick={handleCreateJob}
            >
                New Job
            </button>
            <div className="flex">
                <div className="w-1/2 pr-4">
                    <JobList jobs={jobs} onJobClick={setSelectedJob} />
                </div>
                <div className="w-1/2 pl-4">
                    {selectedJob && <JobDetail job={selectedJob} onRunJob={handleRunJob} />}
                </div>
            </div>
        </div>
        // <div className="md:flex flex-row gap-4">
        //     <div className="basis-1/2">
        //         <h3>Job Order</h3>
        //         <div className="bg-white rounded text-amber-900">
        //             <form>
        //                 <label className="font-bold" htmlFor="">エリア: </label>
        //             </form>
        //         </div>
        //     </div>
        //     <div className="basis-1/2">
        //         <h3>Que</h3>
        //         <div className="bg-white rounded">box
        //             box
        //         </div>
        //     </div>
        // </div>
    );
}