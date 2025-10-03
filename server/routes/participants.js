import express from "express";
import { participantController } from "../controllers/index.js";

const router = express.Router();

// Registration route
router.post("/register", participantController.registerParticipant);

// Get participant by team ID
router.get("/:teamId", participantController.getParticipantByTeamId);

// Get all participants (admin)
router.get("/", participantController.getAllParticipants);

// Get leaderboard
router.get("/leaderboard/top", participantController.getLeaderboard);

export default router;
