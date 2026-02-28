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
    
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing" });
    }
    
    const { question, options, duration, correctOption } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    
    if (!options || !Array.isArray(options)) {
      return res.status(400).json({ error: "Options must be an array" });
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
    
    const poll = await service.createPoll(pollData);
    
    // Emit socket event after successful creation
    const io = req.app.get("io");
    if (io) {
      io.emit("poll_created", poll);
    }
    
    res.status(201).json(poll);
  } catch (e) {
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
    res.json(participants.map(p => ({ id: p.socketId, name: p.name })));
  } catch (e) {
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
    
    // Check if already registered AND not kicked
    let participant = await Participant.findOne({ name, isActive: true });
    
    if (participant) {
      // Already active - return success
      return res.json({ success: true, participant: { id: participant.socketId, name: participant.name } });
    }
    
    // Check if previously kicked
    const kickedParticipant = await Participant.findOne({ name, isKicked: true });
    if (kickedParticipant) {
      return res.status(403).json({ error: "You have been kicked out" });
    }
    
    // Create new participant
    participant = await Participant.create({
      name,
      socketId: `http_${Date.now()}`,
      isActive: true,
      isKicked: false
    });
    
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
    
    const { pollId, studentName, optionIndex } = req.body;
    
    if (!pollId || !studentName || optionIndex === undefined) {
      return res.status(400).json({ error: "Missing required fields: pollId, studentName, optionIndex" });
    }
    
    const poll = await service.vote({ pollId, studentName, optionIndex });
    
    // Emit socket event for real-time updates
    const io = req.app.get("io");
    if (io) {
      io.emit("vote_update", poll);
    }
    
    res.json(poll);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// HTTP endpoint for students to register themselves (works without sockets)

exports.kick = async (req, res) => {
  try {
    await ensureDbConnection();
    const { name } = req.body;
    
    // Find participant by name (can be active or inactive)
    const participant = await Participant.findOne({ name });
    
    if (participant) {
      participant.isKicked = true;
      participant.isActive = false;
      await participant.save();
      
      // Emit socket event to the specific participant
      const io = req.app.get("io");
      if (io) {
        io.to(participant.socketId).emit("kicked");
        
        // Emit updated participants list to all clients
        const dbParticipants = await Participant.find({ isActive: true });
        const participants = dbParticipants.map(p => ({ id: p.socketId, name: p.name }));
        io.emit("participants", participants);
      }
      
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Participant not found" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};