export default function JobDetail ({job, onRunJob}) {
    return (
        <div className="border p-4 rounded">
            <h2 className="text-xl font-bold mb-4">Job Detail</h2>
            <p><strong>ID:</strong>{job.id}</p>
            <p><strong>Status:</strong>{job.status}</p>
            <p><strong>Created:</strong>{new Date(job.createdAt).toLocaleString()}</p>
            {job.startedAt && <p><strong>Started:</strong> {new Date(job.startedAt).toLocaleString()}</p>}
            {job.completedAt && <p><strong>Completed:</strong> {new Date(job.completedAt).toLocaleString()}</p>}
            {job.result && <p><strong>Result:</strong> {job.result}</p>}
            {job.status === 'pending' && (
                <button
                    className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => onRunJob(job.id)}
                >
                    Run Job
                </button>
            )}
        </div>
    );
}