const mongoose = require("mongoose");
const Poll = require("../models/poll.model");
const Vote = require("../models/vote.moel");

class PollService {

  async createPoll(data) {
    if (!data || !data.options) {
      throw new Error("Invalid poll data: options are required");
    }
    
    if (!Array.isArray(data.options)) {
      throw new Error("Invalid poll data: options must be an array");
    }
    
    if (data.options.length < 2) {
      throw new Error("Invalid poll data: at least 2 options are required");
    }
    
    // Complete any existing active poll first
    await Poll.updateMany({ status: "active" }, { status: "completed" });

    const results = data.options.map((_, i) => ({
      optionIndex: i,
      votes: 0
    }));

    const poll = await Poll.create({
      ...data,
      status: "active",
      startTime: Date.now(),
      correctOption: data.correctOption !== undefined ? data.correctOption : -1,
      showAnswer: false,
      results
    });

    return poll;
  }

  async revealAnswer(id, correctOption) {
    const poll = await Poll.findByIdAndUpdate(
      id,
      { showAnswer: true, correctOption },
      { new: true }
    );
    if (!poll) throw new Error("Poll not found");
    return poll;
  }

  async vote(data) {
    // Use the pollId directly - mongoose handles string to ObjectId conversion
    const poll = await Poll.findById(data.pollId);
    
    if (!poll) {
      // Try querying by string ID directly
      const polls = await Poll.find({ _id: data.pollId });
      if (polls.length > 0) {
        return await this._processVote(polls[0], data);
      }
      throw new Error("Poll not found");
    }
    
    return await this._processVote(poll, data);
  }

  async _processVote(poll, data) {
    if (poll.status !== "active") {
      throw new Error("Poll not active");
    }

    const elapsed = (Date.now() - poll.startTime) / 1000;
    if (elapsed > poll.duration) {
      throw new Error("Time expired");
    }

    await Vote.create(data);

    poll.results[data.optionIndex].votes += 1;
    await poll.save();

    return poll;
  }

  async completePoll(id) {
    return Poll.findByIdAndUpdate(id, { status: "completed" }, { new: true });
  }

  async getActive() {
    return Poll.findOne({ status: "active" });
  }

  async history() {
    return Poll.find({ status: "completed" }).sort({ createdAt: -1 });
  }
}

module.exports = new PollService();