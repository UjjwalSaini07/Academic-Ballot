const express = require("express");
require("dotenv");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const { getDbStatus } = require("./config/db");
const routes = require("./routes/poll.routes");
const pollSocket = require("./sockets/poll.socket");

connectDB();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  const dbStatus = getDbStatus();
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: {
      connected: dbStatus.connected,
      error: dbStatus.error,
      connectionTime: dbStatus.connectionTime
    },
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api", (req, res) => {
  res.json({
    name: "Academic Ballot API",
    version: "1.0.0",
    endpoints: [
      {
        method: "GET",
        path: "/health",
        description: "Health check endpoint"
      },
      {
        method: "GET",
        path: "/api",
        description: "API information and all available endpoints"
      },
      {
        method: "GET",
        path: "/api/poll/active",
        description: "Get the currently active poll"
      },
      {
        method: "GET",
        path: "/api/poll/history",
        description: "Get all completed polls"
      },
      {
        method: "GET",
        path: "/api/poll/participants",
        description: "Get all active participants"
      },
      {
        method: "GET",
        path: "/api/poll/check-kicked",
        description: "Check if a student is kicked (query param: name)"
      },
      {
        method: "POST",
        path: "/api/poll",
        description: "Create a new poll (body: question, options[], duration, correctOption)"
      },
      {
        method: "PUT",
        path: "/api/poll/:id/complete",
        description: "Complete a poll (mark as ended)"
      },
      {
        method: "PUT",
        path: "/api/poll/:id/reveal",
        description: "Reveal the answer (body: correctOption)"
      }
    ],
    socketEvents: [
      {
        event: "join",
        description: "Join as a participant (payload: name)"
      },
      {
        event: "create_poll",
        description: "Create a new poll (payload: question, options[], duration, correctOption)"
      },
      {
        event: "vote",
        description: "Vote on a poll (payload: pollId, studentName, optionIndex)"
      },
      {
        event: "kick",
        description: "Kick a participant (payload: socketId of participant)"
      },
      {
        event: "chat_message",
        description: "Send a chat message (payload: message object)"
      }
    ],
    socketListeners: [
      {
        event: "poll_created",
        description: "Broadcast when a new poll is created"
      },
      {
        event: "poll_ended",
        description: "Broadcast when a poll is ended"
      },
      {
        event: "vote_update",
        description: "Broadcast when votes are updated"
      },
      {
        event: "answer_revealed",
        description: "Broadcast when answer is revealed"
      },
      {
        event: "participants",
        description: "Broadcast when participants list changes"
      },
      {
        event: "kicked",
        description: "Sent to a kicked participant"
      },
      {
        event: "chat_message",
        description: "Broadcast chat messages"
      },
      {
        event: "error_message",
        description: "Broadcast error messages"
      }
    ]
  });
});

app.use("/api/poll", routes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io available to controllers
app.set("io", io);

pollSocket(io);

server.listen(5000, () => console.log("Server running on 5000"));