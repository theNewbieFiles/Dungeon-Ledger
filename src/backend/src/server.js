import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use(cors({
  origin: "http://localhost:5173", // frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // allow cookies if needed
}));



// REST routes
app.use('/auth', authRoutes);

// Create HTTP server from Express app
const server = http.createServer(app);

// Set up WebSocket server on same HTTP server
const wss = new WebSocketServer({ server });

// Optional: log connections
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('message', (message) => {
    console.log('Received:', message.toString());
    // Echo back for testing
    ws.send(`Server says: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start server (both REST and WebSocket run on same port)
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});