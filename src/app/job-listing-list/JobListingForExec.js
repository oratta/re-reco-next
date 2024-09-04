import {FaCheck, FaPlay, FaStop} from 'react-icons/fa';

const JobListingForExec = ({ areas, jobListings, jobStatus, processingJobId, onStop, onExecute }) => {
    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
            <tr>
                <th className="py-2 px-4 border-b">Area Name</th>
                <th className="py-2 px-4 border-b">Target Date</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Pending Count</th>
                <th className="py-2 px-4 border-b">Action</th>
            </tr>
            </thead>
            <tbody>
            {jobListings.map(job => (
                <tr key={job.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{areas.find(area=>area.code===job.areaCode)?.name}</td>
                    <td className="py-2 px-4 border-b">{new Date(job.targetDate).toISOString().split('T')[0]}</td>
                    <td className="py-2 px-4 border-b">{jobStatus[job.id] || job.status}</td>
                    <td className={`py-2 px-4 border-b ${processingJobId === job.id ? 'animate-blink' : ''}`}>{job.pendingCount}</td>
                    <td className="py-2 px-4 border-b">
                        {job.pendingCount === 0 ? (
                            <FaCheck className="text-gray-500"/>
                        ) : (
                            <>
                                <button
                                    onClick={() => onExecute(job.id)}
                                    className={`px-4 py-2 rounded ${processingJobId === job.id ? 'bg-yellow-500 text-white animate-blink' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
                                    disabled={processingJobId !== null && processingJobId !== job.id}
                                    style={{backgroundColor: processingJobId !== null && processingJobId !== job.id ? 'gray' : 'orange'}}
                                >
                                    <FaPlay color="white"/>
                                </button>
                                {processingJobId === job.id && (
                                    <button
                                        onClick={() => onStop(job.id)}
                                        className="ml-2 px-4 py-2 rounded text-white hover:bg-red-700 bg-red-500"
                                        style={{backgroundColor: 'red'}}
                                    >
                                        <FaStop color="white"/>
                                    </button>
                                )}
                            </>
                        )}
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default JobListingForExec;