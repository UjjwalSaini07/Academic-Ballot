const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  name: String,
  socketId: String,
  isActive: { type: Boolean, default: true },
  isKicked: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Participant", participantSchema);
