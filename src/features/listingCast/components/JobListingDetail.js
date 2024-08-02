export default function JobListingDetail({ jobListing, areas}){
    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Job Detail</h2>
            <div className="space-y-2">
                <p><strong>id:</strong>{jobListing.id}</p>
                <p><strong>areaName:</strong>{areas.find(area=>area.code===jobListing.areaCode)?.name || "NoName"}</p>
                <p><strong>targetDate:</strong>{jobListing.targetDate}</p>
                <p><strong>condition:</strong>{jobListing.condition}</p>
                <p><strong>status:</strong>{jobListing.status}</p>
            </div>
        </div>
    );
}