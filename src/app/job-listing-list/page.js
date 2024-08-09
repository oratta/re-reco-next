'use client';

import React, { useEffect, useState } from 'react';

const JobCastListView = () => {
    const [jobCastList, setJobCastList] = useState([]);

    useEffect(() => {
        fetchJobCastList();
    }, []);

    const fetchJobCastList = async () => {
        try {
            const response = await fetch('/api/job-listings?type=listing');
            const data = await response.json();
            setJobCastList(data);
        } catch (error) {
            console.error('Error fetching job cast list:', error);
        }
    };

    const handleBulkExecute = async (jobListingId) => {
        try {
            await fetch(`/api/job-listings/${jobListingId}/bulk-execute`, {
                method: 'POST'
            });
            fetchJobCastList(); // Refresh the list after bulk execution
        } catch (error) {
            console.error('Error executing bulk job reservation rates:', error);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Job Cast List</h1>
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b">Area Code</th>
                        <th className="py-2 px-4 border-b">Target Date</th>
                        <th className="py-2 px-4 border-b">Status</th>
                        <th className="py-2 px-4 border-b">Complete Count</th>
                        <th className="py-2 px-4 border-b">Failed Count</th>
                        <th className="py-2 px-4 border-b">Pending Count</th>
                        <th className="py-2 px-4 border-b">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobCastList.map(job => (
                        <tr key={job.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4 border-b">{job.areaCode}</td>
                            <td className="py-2 px-4 border-b">{job.targetDate}</td>
                            <td className="py-2 px-4 border-b">{job.status}</td>
                            <td className="py-2 px-4 border-b">{job.completeCount}</td>
                            <td className="py-2 px-4 border-b">{job.failedCount}</td>
                            <td className="py-2 px-4 border-b">{job.pendingCount}</td>
                            <td className="py-2 px-4 border-b">
                                {job.pendingCount > 0 && (
                                    <button
                                        onClick={() => handleBulkExecute(job.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                                    >
                                        Bulk Execute
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobCastListView;