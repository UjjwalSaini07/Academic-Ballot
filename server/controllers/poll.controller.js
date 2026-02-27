const service = require("../services/poll.service");
const Participant = require("../models/participant.model");

exports.getActive = async (req, res) => {
  res.json(await service.getActive());
};

exports.history = async (req, res) => {
  res.json(await service.history());
};

exports.create = async (req, res) => {
  try {
    const poll = await service.createPoll(req.body);
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
    const participants = await Participant.find({ isActive: true });
    res.json(participants.map(p => ({ id: p.socketId, name: p.name })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.checkKicked = async (req, res) => {
  try {
    const { name } = req.query;
    const participant = await Participant.findOne({ name, isKicked: true });
    res.json({ isKicked: !!participant });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};