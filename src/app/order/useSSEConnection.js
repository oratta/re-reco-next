import { useState, useEffect, useRef } from 'react';
import { consoleLog } from "@/commons/utils/log";

export function useSSEConnection() {
    const [orderList, setOrderList] = useState([]);
    const [connectionError, setConnectionError] = useState(null);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 5;

        const connectSSE = () => {
            consoleLog('Attempting to connect to SSE...');

            if (eventSourceRef.current) {
                consoleLog('Closing existing connection...');
                eventSourceRef.current.close();
            }

            fetch('/api/users/sse').then(response => {
                consoleLog('Fetch response:', response);
                if (response.status === 503) {
                    response.json().then(data => {
                        setConnectionError(data.error);
                    });
                } else if (response.ok) {
                    const eventSource = new EventSource('/api/users/sse');
                    eventSourceRef.current = eventSource;

                    eventSource.onopen = () => {
                        consoleLog('SSE Connection opened');
                        retryCount = 0; // Reset retry count on successful connection
                    };

                    eventSource.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        consoleLog('Received SSE message:', data);
                        if (data.type === 'connection' && data.status === 'success') {
                            consoleLog('SSE Connection established successfully');
                            setConnectionError(null);
                        } else if (data.type === 'initial') {
                            setOrderList(data.data);
                        } else if (data.type === 'update') {
                            setOrderList(prevList => {
                                return prevList.map(order =>
                                    order.id === data.jobListingId
                                        ? { ...order, ...data.data }
                                        : order
                                );
                            });
                        } else if (data.type === 'ping') {
                            consoleLog('Ping received');
                        }
                    };

                    eventSource.onerror = (error) => {
                        consoleLog('SSE connection error:', error);
                        eventSource.close();
                        setConnectionError('Connection lost. Attempting to reconnect...');

                        if (retryCount < maxRetries) {
                            retryCount++;
                            consoleLog(`Retry attempt ${retryCount} of ${maxRetries}`);
                            setTimeout(connectSSE, 5000 * retryCount); // Exponential backoff
                        } else {
                            setConnectionError('Max retries reached. Please refresh the page.');
                        }
                    };
                } else {
                    setConnectionError('Failed to establish SSE connection');
                }
            }).catch(error => {
                consoleLog('Error establishing SSE connection:', error);
                setConnectionError('Failed to establish SSE connection');
                if (retryCount < maxRetries) {
                    retryCount++;
                    consoleLog(`Retry attempt ${retryCount} of ${maxRetries}`);
                    setTimeout(connectSSE, 5000 * retryCount); // Exponential backoff
                } else {
                    setConnectionError('Max retries reached. Please refresh the page.');
                }
            });
        };

        connectSSE();

        return () => {
            if (eventSourceRef.current) {
                consoleLog('Closing SSE connection on cleanup');
                eventSourceRef.current.close();
            }
        };
    }, []);

    return { orderList, connectionError };
}