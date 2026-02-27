const Poll = require("../models/poll.model");
const Vote = require("../models/vote.moel");

class PollService {

  async createPoll(data) {
    console.log("createPoll called with:", data);
    
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
    const result = await Poll.updateMany({ status: "active" }, { status: "completed" });
    console.log("Completed existing polls:", result);

    const results = data.options.map((_, i) => ({
      optionIndex: i,
      votes: 0
    }));

    const poll = await Poll.create({
      ...data,
      status: "active", // Explicitly set status
      startTime: Date.now(),
      correctOption: data.correctOption !== undefined ? data.correctOption : -1,
      showAnswer: false,
      results
    });

    console.log("Created new poll:", poll);
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

    const poll = await Poll.findById(data.pollId);

    if (!poll || poll.status !== "active")
      throw new Error("Poll not active");

    const elapsed = (Date.now() - poll.startTime) / 1000;
    if (elapsed > poll.duration)
      throw new Error("Time expired");

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