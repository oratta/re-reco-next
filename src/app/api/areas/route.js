import { NextResponse } from 'next/server';
import prisma from "@/commons/libs/prisma";
import {consoleError} from "@/commons/utils/log";
import {addArea} from "@/commons/models/Area";

export async function GET(req) {
    const url = new URL(req.url);
    const type = url.searchParams.get('type') || "";
    try {
        let areas = await prisma.area.findMany({
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(areas);
    } catch (error) {
        console.error('Failed to fetch areas', error);
        return NextResponse.json({ error: 'Failed to fetch area' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        // リクエストボディを一度だけ読み取り、変数に保存
        const body = await request.json();
        const { areaName, areaCode } = body;

        const area = await addArea({ name:areaName, code:areaCode });

        return NextResponse.json(area, { status: 201 });
    } catch (error) {
        const errorMessage = 'Failed to create area' ;
        consoleError(error,errorMessage);
        return NextResponse.json({ error: errorMessage, details: error.message }, { status: 500 });
    }
}