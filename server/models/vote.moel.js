const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll" },
  studentName: String,
  optionIndex: Number
}, { timestamps: true });

voteSchema.index({ pollId: 1, studentName: 1 }, { unique: true });

module.exports = mongoose.model("Vote", voteSchema);