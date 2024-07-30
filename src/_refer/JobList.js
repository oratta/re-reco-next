export default function JobList({jobs, onJobClick}) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Job List</h2>
            {jobs.map((job) => (
                <div
                    key={job.id}
                    className="border p-4 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => onJobClick(job)}
                >
                    <p>ID: {job.id}</p>
                    <p>Status: {job.status}</p>
                    <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
                    {job.startedAt && <p>Started: {new Date(job.startedAt).toLocaleString()}</p>}
                    {job.completedAt && <p>Completed: {new Date(job.completedAt).toLocaleString()}</p>}
                </div>
            ))}
        </div>
    );
};