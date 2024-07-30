import {jobManager} from "@/_refer/jobs";
import {NextResponse} from "next/server";

export async function PUT(request, {params}) {
    const {id} = params;
    await jobManager.runJob(id);
    return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';