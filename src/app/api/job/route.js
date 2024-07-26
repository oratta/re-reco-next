import {NextResponse} from "next/server";
import {jobManager} from "@/lib/jobs";

export async function POST() {
    const jobId = await jobManager.createJob();
    // await jobManager.runJob(jobId);
    return NextResponse.json({jobId: jobId});
}

export async function GET() {
    const jobs = await jobManager.getJobs();
    return NextResponse.json({jobs})
}

export const dynamic = 'force-dynamic';