import { bulkExecuteJobReRe, stopBulkExecuteJobReservationRates } from "@/features/executeJobReRe/services/JobReservationRateService";

export async function POST(req, { params }) {
    const { id } = params;
    try {
        await bulkExecuteJobReRe(id);
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

export async function GET(req, { params }) {
    const { id } = params;
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            const send = (data) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            // Store the send function to use it in bulkExecuteJobReRe
            globalThis.sseClients = globalThis.sseClients || {};
            globalThis.sseClients[id] = send;

            req.signal.addEventListener('abort', () => {
                delete globalThis.sseClients[id];
                controller.close();
            });
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        }
    });
}