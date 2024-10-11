import { useEffect, useState } from 'react';
import useConfig from './useConfig';

// Store WebSocket and messages in a global scope
let socket;
let listeners = [];
// let wsMessagesCache = [];

const useWsHandler = () => {
    const config = useConfig();
    const [wsMessages, setWsMessages] = useState();

    useEffect(() => {
        if (config && !socket) {
            socket = new WebSocket(`${config.wsApiBaseUrl}${config.realtimeDataChannel}`);

            socket.onmessage = (event) => {
                const newMessage = event.data;
                listeners.forEach((listener) => listener(newMessage));
            };

            socket.onopen = () => {
                console.log('WebSocket connected');
            };

            socket.onclose = () => {
                console.log('WebSocket disconnected');
                socket = null;
            };

            socket.onerror = (error) => {
                console.log('WebSocket error: ', error);
            };
        }

        if (!listeners.includes(setWsMessages)) {
            listeners.push(setWsMessages);
        }

        return () => {
            listeners = listeners.filter(listener => listener !== setWsMessages);
        };
    }, [config]);

    return wsMessages;
};


export default useWsHandler;
