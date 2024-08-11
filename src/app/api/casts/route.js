import prisma from '@/commons/libs/prisma';
import {NextResponse} from 'next/server';

const MODE_GROUP = "group";
const MODE_CAST = "cast";
const ORDER = {
    RECENT: "recent",
    RECENT5: "recent5",
    RECENT30: "recent30",
    TOTAL: "total",
}

export async function GET(req) {
    const url = new URL(req.url);
    const page = url.searchParams.get('page') || 1;
    const areaCode = url.searchParams.get('areaCode') || "";
    const groupCode = url.searchParams.get('groupCode') || "";
    const mode = url.searchParams.get('mode') || "";
    const order = url.searchParams.get('order') || '';

    console.log(req.query);
    let orderBy = {}
    switch (order) {
        case ORDER.RECENT:
            orderBy = {
                recent1ReservationRate: "desc"
            };
            break;
        case ORDER.RECENT5:
            orderBy = {
                recent5ReservationRate: "desc"
            };
            break;
        case ORDER.RECENT30:
            orderBy = {
                recent30daysReservationRate: "desc"
            };
            break;
        default:
            orderBy = {
                totalReservationRate: "desc"
            }
            break;
    }

    let where = {}
    if (!mode || !areaCode) {
        throw new Error("invalid request: no mode");
    }
    if (mode === MODE_CAST) {
        where = {
            areaCode: areaCode,
        }
        if (groupCode) {
            where = {
                ...where,
                group: groupCode,
            }
        }
    } else if (mode === MODE_GROUP) {
        where = {
            group: groupCode,
        }
    }


    const limit = 10; // 一ページあたりのデータ数を設定
    const offset = (page - 1) * limit;

    const data = await prisma.cast.findMany({
        where: where,
        orderBy: orderBy,
        take: limit,
        skip: offset
    });

    return NextResponse.json(data);
}