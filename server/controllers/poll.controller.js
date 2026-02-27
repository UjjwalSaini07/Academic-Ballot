const service = require("../services/poll.service");

exports.getActive = async (req, res) => {
  res.json(await service.getActive());
};

exports.history = async (req, res) => {
  res.json(await service.history());
};