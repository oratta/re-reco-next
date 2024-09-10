import {NextResponse} from 'next/server';
import * as JobReservationRate from "@/commons/models/JobReservationRate";
import {getWebParameter} from "@/commons/utils/api";
import * as Cast from "@/commons/models/Cast";

const AS = {
    CAST: "cast",
}

export async function GET(req, {params}) {
    const {id} = params;
    const {as} = getWebParameter(req, "as");
    let result = null;
    if (as === AS.CAST) {
        const jobReRes = await prisma.jobReservationRate.findMany({
            where: {
                jobListingId: id,
                status: JobReservationRate.STATUS.COMPLETED,
                reservedRate: {
                    not: 0
                }
            },
            include: {
                cast: true,
            }
        })
        result = jobReRes.map((jobReRe) => {
            const cast = jobReRe.cast;
            cast.thumbnailUrl = Cast.getThumbnailUrl(cast);
            return cast;
        });
    } else {
        throw new Error("not implemented yet");
    }

    return NextResponse.json(result);
}