import { io } from 'socket.io-client';

// --- Configuration ---
const BACKEND_URL = 'http://localhost:4000'; // Replace with your deployed backend URL

// --- Socket Connection ---
// Initialize the socket connection but don't connect automatically.
// This allows us to wait for user details before establishing a connection.
export const socket = io(BACKEND_URL, {
  autoConnect: false,
});
