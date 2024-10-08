import { bulkExecuteJobReRe, stopBulkExecuteJobReservationRates } from "@/services/JobReservationRateService";

export async function POST(req, { params }) {
    const { id } = params;
    try {
        const jobListing = await prisma.jobListing.findOne({
            where: {
                id: id
            }
        })
        await bulkExecuteJobReRe(jobListing);
        return new Response(JSON.stringify({ message: 'Bulk execution started' }), { status: 200 });
    } catch (error) {
        console.error('Error executing bulk job reservation rates:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;
    try {
        await stopBulkExecuteJobReservationRates(id);
        return new Response(JSON.stringify({ message: 'Bulk execution stopped' }), { status: 200 });
    } catch (error) {
        console.error('Error stopping bulk job reservation rates:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}