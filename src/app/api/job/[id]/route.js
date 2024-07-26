import {jobManager} from "@/lib/jobs";
import {NextResponse} from "next/server";

export async function PUT(request) {
    const jobId = request.url.split('/').pop();
    await jobManager.runJob(jobId);
    return NextResponse.json({ success: true });
}