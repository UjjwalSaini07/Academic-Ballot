const service = require("../services/poll.service");

module.exports = (io) => {

  let participants = [];

  io.on("connection", (socket) => {

    socket.on("join", (name) => {
      participants.push({ id: socket.id, name });
      io.emit("participants", participants);
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

    socket.on("kick", (id) => {
      io.to(id).emit("kicked");
      participants = participants.filter(p => p.id !== id);
      io.emit("participants", participants);
    });

    socket.on("disconnect", () => {
      participants = participants.filter(p => p.id !== socket.id);
      io.emit("participants", participants);
    });

  });
};