const mongoose = require("mongoose");
const service = require("../services/poll.service");
const Participant = require("../models/participant.model");

// Helper to ensure database is connected
const ensureDbConnection = async () => {
  if (mongoose.connection.readyState !== 1) {
    const connectDB = require("../config/db");
    await connectDB();
  }
};

exports.getActive = async (req, res) => {
  await ensureDbConnection();
  res.json(await service.getActive());
};

exports.history = async (req, res) => {
  await ensureDbConnection();
  res.json(await service.history());
};

exports.create = async (req, res) => {
  try {
    await ensureDbConnection();
    console.log("Creating poll with data:", req.body);
    const poll = await service.createPoll(req.body);
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
    res.json(participants.map(p => ({ id: p.socketId, name: p.name })));
  } catch (e) {
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
    const poll = await service.vote(pollId, studentName, optionIndex);
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

exports.kick = async (req, res) => {
  try {
    await ensureDbConnection();
    const { name } = req.body;
    const participant = await Participant.findOne({ name });
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
      res.status(404).json({ error: "Participant not found" });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};