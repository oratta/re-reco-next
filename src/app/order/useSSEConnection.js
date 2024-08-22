import { useState, useEffect, useCallback } from 'react';
import { consoleLog } from "@/commons/utils/log";
import clientConsole from "@/commons/utils/clientConsole";

export function useSSEConnection() {
    const [orderList, setOrderList] = useState([]);
    const [connectionError, setConnectionError] = useState(null);

    const handleSSEMessage = useCallback((event) => {
        try {
            const data = JSON.parse(event.data);
            clientConsole.debug('Received SSE message:', data);

            if (data.type === 'connection' && data.status === 'success') {
                clientConsole.info('SSE Connection established successfully');
                setConnectionError(null);
            } else if (data.type === 'initial') {
                clientConsole.info('Received initial order list:', data.data);
                setOrderList(data.data);
            } else if (data.type === 'update') {
                setOrderList(prevList => {
                    const updatedList = prevList.map(order =>
                        order.id === data.jobListingId ? { ...order, ...data.data } : order
                    );
                    consoleLog('Updated order list:', updatedList);
                    return updatedList;
                });
            } else if (data.type === 'ping') {
                clientConsole.debug('Ping received');
            }
        } catch (error) {
            clientConsole.warn('Error parsing SSE message:', error);
        }
    }, []);

    useEffect(() => {
        let eventSource;

        const connectSSE = () => {
            eventSource = new EventSource('/api/users/sse');

            eventSource.onmessage = handleSSEMessage;

            eventSource.onerror = (error) => {
                clientConsole.info('SSE connection error:', error);
                setConnectionError('Connection lost. Attempting to reconnect...');
                eventSource.close();
                setTimeout(connectSSE, 5000);
            };

            eventSource.onopen = () => {
                clientConsole.info('SSE connection opened');
                setConnectionError(null);
            };
        };

        connectSSE();

        return () => {
            if (eventSource) {
                clientConsole.info('Closing SSE connection');
                eventSource.close();
            }
        };
    }, [handleSSEMessage]);

    return { orderList, connectionError };
}