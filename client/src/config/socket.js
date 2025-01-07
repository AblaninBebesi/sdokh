import { io } from 'socket.io-client'
const ENDPOINT = "http://127.0.0.1:8080";
const socket = io(ENDPOINT, {
    transports: ['websocket'],
    withCredentials: true
});

export  default socket;