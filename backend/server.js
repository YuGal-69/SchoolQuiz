import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import pollHandler from './sockets/pollHandler.js';
import { getHistory } from './store/pollStore.js';

// --- Server Setup ---
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// --- Middleware ---
app.use(cors({ origin: '*' })); // Use a more specific origin in production
app.use(express.json());

// --- REST API Routes ---
// Route to get the history of completed polls
app.get('/api/polls/history/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = getHistory(sessionId); // update pollStore.js to filter by session

  if (!history || history.length === 0) {
    return res.status(404).json({ message: `No poll history found for session ${sessionId}` });
  }

  res.json(history);
});



// --- Socket.IO Setup ---
const io = new Server(server, {
  cors: {
    origin: '*', // Use a more specific origin in production
    methods: ['GET', 'POST'],
  },
});

// --- Main Connection Handler ---
const onConnection = (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Pass the io and socket instances to the handler
  pollHandler(io, socket);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    // The disconnect logic is now handled within pollHandler
  });
};

io.on('connection', onConnection);

// --- Start Server ---
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});