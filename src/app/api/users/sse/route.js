import crypto from 'crypto';
import { getActiveJobListings } from "@/features/listingCast/services/JobListingsService";

const clients = new Map();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CLIENT_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const MAX_CONNECTIONS = 20; // 最大同時接続数

function generateClientId(req) {
    const userAgent = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const acceptLanguage = req.headers.get('accept-language') || '';

    const hash = crypto.createHash('sha256');
    hash.update(userAgent + ip + acceptLanguage);
    return hash.digest('hex');
}

function cleanupClients() {
    const now = Date.now();
    for (const [clientId, client] of clients.entries()) {
        if (now - client.lastActivityTime > CLIENT_TIMEOUT) {
            client.controller.close();
            clients.delete(clientId);
        }
    }
}

setInterval(cleanupClients, CLEANUP_INTERVAL);

export async function GET(req) {
    if (clients.size >= MAX_CONNECTIONS) {
        return new Response(JSON.stringify({ error: 'Maximum number of connections reached. Please try again later.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const clientId = generateClientId(req);

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            const send = (data) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            if (clients.has(clientId)) {
                const oldClient = clients.get(clientId);
                oldClient.controller.close();
            }

            clients.set(clientId, {
                send,
                controller,
                lastActivityTime: Date.now()
            });

            req.signal.addEventListener('abort', () => {
                clients.delete(clientId);
                controller.close();
            });

            // Send initial data
            const activeJobListings = await getActiveJobListings();
            send({ type: 'initial', data: activeJobListings });

            // Send connection success message
            send({ type: 'connection', status: 'success', message: 'Connected successfully' });
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

globalThis.notifyAllClients = (data) => {
    const now = Date.now();
    clients.forEach((client, clientId) => {
        try {
            client.send(data);
            client.lastActivityTime = now;
        } catch (error) {
            console.error(`Error sending message to client ${clientId}:`, error);
            clients.delete(clientId);
        }
    });
};

globalThis.pingClients = () => {
    const now = Date.now();
    clients.forEach((client, clientId) => {
        try {
            client.send({ type: 'ping' });
            client.lastActivityTime = now;
        } catch (error) {
            console.error(`Error pinging client ${clientId}:`, error);
            clients.delete(clientId);
        }
    });
};

setInterval(globalThis.pingClients, 30000); // Ping every 30 seconds