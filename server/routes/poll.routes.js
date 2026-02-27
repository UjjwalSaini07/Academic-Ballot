const express = require("express");
const router = express.Router();
const controller = require("../controllers/poll.controller");

router.get("/active", controller.getActive);
router.get("/history", controller.history);
router.get("/participants", controller.getParticipants);
router.post("/", controller.create);
router.put("/:id/complete", controller.complete);
router.put("/:id/reveal", controller.revealAnswer);

module.exports = router;