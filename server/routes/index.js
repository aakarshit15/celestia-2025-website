import express from "express";
import participantRoutes from "./participants.js";
import gameRoutes from "./games.js";
import pointsRoutes from "./points.js";
import adminRoutes from "./admin.js";

const router = express.Router();

router.use("/participants", participantRoutes);
router.use("/games", gameRoutes);
router.use("/points", pointsRoutes);
router.use("/admin", adminRoutes);

export default router;
