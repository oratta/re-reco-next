import { NextResponse } from 'next/server';
import prisma from "@/commons/libs/prisma";

export async function GET() {
    try {
        const areas = await prisma.area.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(areas);
    } catch (error) {
        console.error('Failed to fetch areas', error);
        return NextResponse.json({ error: 'Failed to fetch area' }, { status: 500 });
    }
}