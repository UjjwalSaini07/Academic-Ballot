const express = require("express");
const router = express.Router();
const controller = require("../controllers/poll.controller");

router.get("/active", controller.getActive);
router.get("/history", controller.history);
router.get("/participants", controller.getParticipants);
router.get("/check-kicked", controller.checkKicked);
router.get("/analytics", controller.getAnalytics);
router.post("/", controller.create);
router.post("/vote", controller.vote);
router.post("/kick", controller.kick);
router.post("/register", controller.registerParticipant);
router.post("/admin/flush", controller.flushDatabase);
router.put("/:id/complete", controller.complete);
router.put("/:id/reveal", controller.revealAnswer);

module.exports = router;