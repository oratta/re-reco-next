// src/app/job-listing-list/page.js
import React, { useEffect, useState } from 'react';

const JobCastListView = () => {
    const [jobCastList, setJobCastList] = useState([]);

    useEffect(() => {
        fetchJobCastList();
    }, []);

    const fetchJobCastList = async () => {
        try {
            const response = await fetch('/api/job-cast-list');
            const data = await response.json();
            setJobCastList(data);
        } catch (error) {
            console.error('Error fetching job cast list:', error);
        }
    };

    const handleBulkExecute = async (jobListingId) => {
        try {
            await fetch(`/api/job-cast-list/${jobListingId}/bulk-execute`, {
                method: 'POST'
            });
            fetchJobCastList(); // Refresh the list after bulk execution
        } catch (error) {
            console.error('Error executing bulk job reservation rates:', error);
        }
    };

    return (
        <div>
            <h1>Job Cast List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Area Code</th>
                        <th>Target Date</th>
                        <th>Status</th>
                        <th>Complete Count</th>
                        <th>Failed Count</th>
                        <th>Pending Count</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {jobCastList.map(job => (
                        <tr key={job.id}>
                            <td>{job.areaCode}</td>
                            <td>{job.targetDate}</td>
                            <td>{job.status}</td>
                            <td>{job.completeCount}</td>
                            <td>{job.failedCount}</td>
                            <td>{job.pendingCount}</td>
                            <td>
                                {job.pendingCount > 0 && (
                                    <button onClick={() => handleBulkExecute(job.id)}>Bulk Execute</button>
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