const service = require("../services/poll.service");
const Participant = require("../models/participant.model");

module.exports = (io) => {

  io.on("connection", async (socket) => {
    
    // Emit current participants to newly connected client
    try {
      const dbParticipants = await Participant.find({ isActive: true });
      const participants = dbParticipants.map(p => ({ id: p.socketId, name: p.name }));
      io.emit("participants", participants);
    } catch (err) {
      console.error("Failed to load participants:", err);
    }

    // Load existing participants from database when connected
    const loadParticipants = async () => {
      try {
        const dbParticipants = await Participant.find({ isActive: true });
        const participants = dbParticipants.map(p => ({ id: p.socketId, name: p.name }));
        io.emit("participants", participants);
        return participants;
      } catch (err) {
        console.error("Failed to load participants:", err);
        return [];
      }
    };

    socket.on("join", async (name) => {
      try {
        // Check if participant already exists
        let participant = await Participant.findOne({ name, isActive: true });
        
        if (participant) {
          // Update socket ID for existing participant
          participant.socketId = socket.id;
          await participant.save();
        } else {
          // Create new participant
          participant = await Participant.create({ name, socketId: socket.id });
        }
        
        // Emit updated list
        const dbParticipants = await Participant.find({ isActive: true });
        const participants = dbParticipants.map(p => ({ id: p.socketId, name: p.name }));
        io.emit("participants", participants);
      } catch (err) {
        console.error("Failed to join:", err);
      }
    });

    socket.on("create_poll", async (data) => {
      try {
        const poll = await service.createPoll(data);
        io.emit("poll_created", poll);
      } catch (e) {
        socket.emit("error_message", e.message);
      }
    });

    socket.on("vote", async (data) => {
      try {
        const poll = await service.vote(data);
        io.emit("vote_update", poll);
      } catch (e) {
        socket.emit("error_message", e.message);
      }
    });

    socket.on("chat_message", (msg) => {
      io.emit("chat_message", msg);
    });

    socket.on("kick", async (id) => {
      try {
        io.to(id).emit("kicked");
        
        // Mark participant as inactive in database
        await Participant.findOneAndUpdate({ socketId: id }, { isActive: false });
        
        // Emit updated list
        const dbParticipants = await Participant.find({ isActive: true });
        const participants = dbParticipants.map(p => ({ id: p.socketId, name: p.name }));
        io.emit("participants", participants);
      } catch (err) {
        console.error("Failed to kick:", err);
      }
    });

    socket.on("disconnect", async () => {
      try {
        // Mark participant as inactive
        await Participant.findOneAndUpdate({ socketId: socket.id }, { isActive: false });
        
        // Emit updated list
        const dbParticipants = await Participant.find({ isActive: true });
        const participants = dbParticipants.map(p => ({ id: p.socketId, name: p.name }));
        io.emit("participants", participants);
      } catch (err) {
        console.error("Failed to disconnect:", err);
      }
    });

  });
};