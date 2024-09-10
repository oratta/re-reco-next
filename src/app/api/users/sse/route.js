import crypto from 'crypto';
import {getActiveJobListings} from "@/services/JobListingsService";
import {consoleError, consoleLog} from "@/commons/utils/log";
import {debugMsg, errorMsg} from "@/commons/utils/logger";

const clients = new Map();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const CLIENT_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const MAX_CONNECTIONS = 20; // 最大同時接続数
const PING_INTERVAL = 30000; // 30 seconds

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
    let cleanedCount = 0;
    for (const [clientId, client] of clients.entries()) {
        if (now - client.lastActivityTime > CLIENT_TIMEOUT) {
            client.controller.close();
            clients.delete(clientId);
            cleanedCount++;
        }
    }
    consoleLog(`Cleaned up ${cleanedCount} inactive clients. Active clients: ${clients.size}`);
}

function startCleanupInterval() {
    return setInterval(cleanupClients, CLEANUP_INTERVAL);
}

function startPingInterval() {
    return setInterval(() => {
        const now = Date.now();
        clients.forEach((client, clientId) => {
            try {
                client.send({ type: 'ping', timestamp: now });
                client.lastActivityTime = now;
            } catch (error) {
                consoleLog(`Error pinging client ${clientId}:`, error);
                clients.delete(clientId);
            }
        });
        // debugMsg(`Pinged ${clients.size} clients`);
    }, PING_INTERVAL);
}

let cleanupInterval = startCleanupInterval();
let pingInterval = startPingInterval();

export async function GET(req) {
    debugMsg(`New SSE connection request. Current connections: ${clients.size}`);

    if (clients.size >= MAX_CONNECTIONS) {
        debugMsg(`Maximum connections (${MAX_CONNECTIONS}) reached. Rejecting new connection.`);
        return new Response(JSON.stringify({ error: 'Maximum number of connections reached. Please try again later.' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const clientId = generateClientId(req);
    debugMsg(`Generated client ID: ${clientId}`);

    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            const send = (data) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };

            if (clients.has(clientId)) {
                debugMsg(`Existing client found with ID ${clientId}. Updating connection.`);
                const existingClient = clients.get(clientId);
                existingClient.send = send;
                existingClient.controller = controller;
                existingClient.lastActivityTime = Date.now();
            } else {
                clients.set(clientId, {
                    send,
                    controller,
                    lastActivityTime: Date.now()
                });
                debugMsg(`New client ${clientId} connected. Total clients: ${clients.size}`);
            }

            req.signal.addEventListener('abort', () => {
                if (clients.get(clientId)?.controller === controller) {
                    clients.delete(clientId);
                    debugMsg(`Client ${clientId} disconnected. Remaining clients: ${clients.size}`);
                }
            });

            try {
                const activeJobListings = await getActiveJobListings();
                // console.log("activeJobListings: ", activeJobListings);
                send({ type: 'initial', data: activeJobListings });
                debugMsg('Sending initial job listings:', activeJobListings);

                send({ type: 'connection', status: 'success', message: 'Connected successfully' });
                debugMsg(`Sent connection success message to client ${clientId}`);
            } catch (error) {
                errorMsg(`Error sending initial data to client ${clientId}:`, error);
                send({ type: 'error', message: 'Failed to fetch initial data' });
                controller.close();
            }
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
    let notifiedCount = 0;
    clients.forEach((client, clientId) => {
        try {
            client.send(data);
            client.lastActivityTime = now;
            notifiedCount++;
        } catch (error) {
            errorMsg(`Error sending message to client ${clientId}:`, error);
            clients.delete(clientId);
        }
    });
    debugMsg(`Notified ${notifiedCount} clients with data:`, data);
    console.log(`Notified ${notifiedCount} clients with data:`);
    console.log(data);
};

// Ensure cleanup and ping intervals are cleared when the server shuts down
process.on('SIGINT', () => {
    clearInterval(cleanupInterval);
    clearInterval(pingInterval);
    consoleLog('Cleared cleanup and ping intervals');
    process.exit(0);
});