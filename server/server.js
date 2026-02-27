const express = require("express");
require("dotenv").config();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const routes = require("./routes/poll.routes");
const pollSocket = require("./sockets/poll.socket");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/poll", routes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Make io available to controllers
app.set("io", io);

pollSocket(io);

server.listen(5000, () => console.log("Server running on 5000"));