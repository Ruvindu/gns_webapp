import { useEffect, useState } from 'react';

const useWsHandler = () => {
    const [wsMessages, setWsMessages] = useState([]);

    useEffect(() => {
        // Setting up WebSocket connection
        const socket = new WebSocket('ws://localhost:8081/api/real-time-notification-stream');

        // Handling incoming messages from WebSocket
        socket.onmessage = (event) => {
            const newMessage = event.data;
            console.log(newMessage);
            setWsMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        socket.onopen = () => {
            console.log('WebSocket connected');
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        socket.onerror = (error) => {
            console.log('WebSocket error: ', error);
        };

        // Cleanup function to close WebSocket on component unmount
        return () => {
            socket.close();
        };
    }, []);

    return wsMessages;
};

export default useWsHandler;
