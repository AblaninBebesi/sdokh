import { io } from 'socket.io-client'
const ENDPOINT = "https://sdokh.onrender.com";
const socket = io(ENDPOINT, {
    transports: ['websocket'],
    withCredentials: true
});

export  default socket;
