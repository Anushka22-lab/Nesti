import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Remove /api because Socket.IO connects to the backend origin
const socketUrl = apiUrl.replace(/\/api\/?$/, "");

const socket = io(socketUrl, {
    withCredentials: true
});

export default socket;

