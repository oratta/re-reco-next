import {FaSearch} from 'react-icons/fa';
import {useState} from "react";

export default function JobListingForSearch({areas, jobListings, onSearch}) {
    const [searchingJobId, setSearchingJobId] = useState('');
    const handleSearch = (jobId) => {
        console.log("onclick;", jobId);
        onSearch(jobId);
        setSearchingJobId(jobId);
    }
    return (
        <table className="min-w-full bg-white border border-gray-200">
            <thead>
            <tr>
                <th className="py-2 px-4 border-b">Area Name</th>
                <th className="py-2 px-4 border-b">Target Date</th>
                <th className="py-2 px-4 border-b">Count</th>
                <th className="py-2 px-4 border-b">Action</th>
            </tr>
            </thead>
            <tbody>
            {jobListings.map(job => (
                <tr key={job.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b">{areas.find(area=>area.code===job.areaCode)?.name}</td>
                    <td className="py-2 px-4 border-b">{new Date(job.targetDate).toISOString().split('T')[0]}</td>
                    <td className={`py-2 px-4 border-b ${searchingJobId === job.id ? 'animate-blink' : ''}`}>{job.completeCount}</td>
                    <td className="py-2 px-4 border-b">
                        <button
                            onClick={() => handleSearch(job.id)}
                            className={`
                                px-4 py-2 rounded 
                                ${
                                searchingJobId === job.id ?
                                    'bg-orange-500 text-black'
                                    :
                                    'bg-blue-500 text-white hover:bg-blue-700'}`}
                            disabled={searchingJobId !== "" && searchingJobId === job.id}
                        >
                            <FaSearch color="white"/>
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};