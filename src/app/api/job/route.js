import {NextResponse} from "next/server";
import {jobManager} from "@/lib/jobs";

export async function POST() {
    const jobId = jobManager.createJob();
    jobManager.runJob(jobId);
    return NextResponse.json({jobId: jobId});
}

export async function GET() {
    const jobs = jobManager.getJobs();
    return NextResponse.json({jobs})
}

export const dynamic = 'force-dynamic';