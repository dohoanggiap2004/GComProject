// services/socket.js
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
    withCredentials: true,
    autoConnect: false,
    transports: ['websocket', 'polling'],
    upgrade: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000

});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};

export default socket;
