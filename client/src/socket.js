import { io } from 'socket.io-client';

// @ts-ignore
const URL = import.meta.env.PROD ? undefined : `http://localhost:${ import.meta.env.VITE_BE_PORT}`;

export const socket = io( URL || `${window.location}`, {
    autoConnect: false
} );