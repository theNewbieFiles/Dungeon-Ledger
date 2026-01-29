import "dotenv/config";
import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import authRoutes from "./routes/auth/authRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middleware/requestLogger.js";


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware


// Enable CORS for frontend
app.use(cors({
    origin: "http://localhost:5173", // frontend origin
    //methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // allow cookies if needed
}));

app.use(express.json());

app.use(cookieParser());

app.use(requestLogger); 

// REST routes
app.use("/auth", authRoutes); //auth login, logout, refreshToken

// Create HTTP server from Express app
const server = http.createServer(app);

// Set up WebSocket server on same HTTP server
const wss = new WebSocketServer({ server });

// Optional: log connections
wss.on("connection", (ws) => {
    console.log("Client connected via WebSocket");

    ws.on("message", (message) => {
        console.log("Received:", message.toString());
        // Echo back for testing
        ws.send(`Server says: ${message}`);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Start server (both REST and WebSocket run on same port)
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});