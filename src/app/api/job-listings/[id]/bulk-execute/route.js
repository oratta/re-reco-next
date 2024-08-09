// src/app/api/job-cast-list/[id]/bulk-execute/route.js
import { bulkExecuteJobReservationRates } from '@/services/jobCastService';

export async function POST(req, { params }) {
    const { id } = params;
    try {
        await bulkExecuteJobReservationRates(id);
        return new Response(JSON.stringify({ message: 'Bulk execution started' }), { status: 200 });
    } catch (error) {
        console.error('Error executing bulk job reservation rates:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}