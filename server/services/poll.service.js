const Poll = require("../models/poll.model");
const Vote = require("../models/vote.moel");

class PollService {

  async createPoll(data) {

    const active = await Poll.findOne({ status: "active" });
    if (active) throw new Error("Active poll already exists");

    const results = data.options.map((_, i) => ({
      optionIndex: i,
      votes: 0
    }));

    const poll = await Poll.create({
      ...data,
      startTime: Date.now(),
      results
    });

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