import {
    useEffect,
    useState
} from 'react';
import useConfig from './useConfig';

// Store WebSocket and messages in a global scope
let socket;
let listeners = [];

const useWsHandler = () => {
    const config = useConfig();
    const [wsMessages, setWsMessages] = useState();

    useEffect(() => {
        const connectWebSocket = () => {
            if (config && !socket) {
                socket = new WebSocket(`${config.wsProtocol}://${config.host}:${config.port}${config.contextPath}${config.realtimeDataChannel}`);

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
        };

        connectWebSocket(); // Initial connection attempt

        const intervalId = setInterval(() => {
            if (!socket || socket.readyState !== WebSocket.OPEN) {
                connectWebSocket(); // Attempt to reconnect if not connected
            }
        }, 6000); // Retry every 10 seconds

        if (!listeners.includes(setWsMessages)) {
            listeners.push(setWsMessages);
        }

        return () => {
            listeners = listeners.filter(listener => listener !== setWsMessages);
            clearInterval(intervalId); // Clear the interval on cleanup
        };
    }, [config]);

    return wsMessages;
};


export default useWsHandler;