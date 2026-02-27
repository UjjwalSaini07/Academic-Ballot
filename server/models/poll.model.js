const mongoose = require("mongoose");

const pollSchema = new mongoose.Schema({
  question: String,
  options: [String],
  duration: Number,
  startTime: Number,
  status: { type: String, default: "active" },
  results: [
    {
      optionIndex: Number,
      votes: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Poll", pollSchema);