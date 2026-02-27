const express = require("express");
const router = express.Router();
const controller = require("../controllers/poll.controller");

router.get("/active", controller.getActive);
router.get("/history", controller.history);

module.exports = router;