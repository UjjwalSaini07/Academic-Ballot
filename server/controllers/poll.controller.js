const mongoose = require("mongoose");
const service = require("../services/poll.service");
const Participant = require("../models/participant.model");
const connectDB = require("../config/db");

// Helper to ensure database is connected
const ensureDbConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error("DB Connection failed:", err.message);
    }
  }
};

exports.getActive = async (req, res) => {
  await ensureDbConnection();
  try {
    res.json(await service.getActive());
  } catch (e) {
    console.error("getActive error:", e);
    res.status(500).json({ error: e.message });
  }
};

exports.history = async (req, res) => {
  await ensureDbConnection();
  res.json(await service.history());
};

exports.create = async (req, res) => {
  try {
    await ensureDbConnection();
    
    // Debug: Log raw body and headers
    console.log("Request headers:", req.headers);
    console.log("Request body type:", typeof req.body);
    console.log("Request body:", JSON.stringify(req.body));
    
    // Also check if body is in a different location (query params, etc)
    console.log("Request query:", req.query);
    
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing", received: typeof req.body });
    }
    
    const { question, options, duration, correctOption } = req.body;
    
    console.log("Destructured - question:", question, "options:", options);
    
    if (!question) {
      return res.status(400).json({ error: "Question is required", receivedQuestion: question });
    }
    
    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: "Options must be an array", receivedOptions: options });
    }
    
    if (options.length < 2) {
      return res.status(400).json({ error: "At least 2 options are required" });
    }
    
    const pollData = {
      question,
      options,
      duration,
      correctOption
    };
    
    console.log("Poll data to create:", pollData);
    const poll = await service.createPoll(pollData);
    // Emit socket event after successful creation
    const io = req.app.get("io");
    if (io) {
      io.emit("poll_created", poll);
    }
    res.status(201).json(poll);
  } catch (e) {
    console.error("Poll creation error:", e);
    res.status(400).json({ error: e.message });
  }
};

exports.complete = async (req, res) => {
  try {
    await ensureDbConnection();
    const poll = await service.completePoll(req.params.id);
    const io = req.app.get("io");
    if (io) {
      io.emit("poll_ended", poll);
    }
    res.json(poll);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.revealAnswer = async (req, res) => {
  try {
    await ensureDbConnection();
    const poll = await service.revealAnswer(req.params.id, req.body.correctOption);
    const io = req.app.get("io");
    if (io) {
      io.emit("answer_revealed", poll);
    }
    res.json(poll);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getParticipants = async (req, res) => {
  try {
    await ensureDbConnection();
    const participants = await Participant.find({ isActive: true });
    console.log("Get participants:", participants);
    res.json(participants.map(p => ({ id: p.socketId, name: p.name })));
  } catch (e) {
    console.error("getParticipants error:", e);
    res.status(500).json({ error: e.message });
  }
};

// HTTP endpoint for students to register themselves (works without sockets)
exports.registerParticipant = async (req, res) => {
  try {
    await ensureDbConnection();
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    
    // Check if already registered
    let participant = await Participant.findOne({ name, isActive: true });
    
    if (!participant) {
      participant = await Participant.create({
        name,
        socketId: `http_${Date.now()}`,
        isActive: true,
        isKicked: false
      });
    } else if (participant.isKicked) {
      return res.status(403).json({ error: "You have been kicked out" });
    }
    
    res.json({ success: true, participant: { id: participant.socketId, name: participant.name } });
  } catch (e) {
    console.error("registerParticipant error:", e);
    res.status(500).json({ error: e.message });
  }
};

exports.checkKicked = async (req, res) => {
  try {
    await ensureDbConnection();
    const { name } = req.query;
    const participant = await Participant.findOne({ name, isKicked: true });
    res.json({ isKicked: !!participant });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.vote = async (req, res) => {
  try {
    await ensureDbConnection();
    
    console.log("Vote request received:", req.body);
    
    const { pollId, studentName, optionIndex } = req.body;
    
    if (!pollId || !studentName || optionIndex === undefined) {
      return res.status(400).json({ error: "Missing required fields: pollId, studentName, optionIndex" });
    }
    
    const poll = await service.vote(pollId, studentName, optionIndex);
    
    // Emit socket event for real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("vote_update", poll);
    }
    
    res.json(poll);
  } catch (e) {
    console.error("Vote error:", e);
    res.status(400).json({ error: e.message });
  }
};

exports.kick = async (req, res) => {
  try {
    await ensureDbConnection();
    const { name } = req.body;
    
    console.log("Kick request for:", name);
    console.log("All active participants:", await Participant.find({ isActive: true }));
    
    const participant = await Participant.findOne({ name, isActive: true });
    
    if (participant) {
      participant.isKicked = true;
      await participant.save();
      
      // Emit socket event
      const io = req.app.get("io");
      if (io) {
        io.emit("kicked", name);
      }
      
      res.json({ success: true });
    } else {
      console.log("Participant not found:", name);
      res.status(404).json({ error: "Participant not found" });
    }
  } catch (e) {
    console.error("Kick error:", e);
    res.status(500).json({ error: e.message });
  }
};