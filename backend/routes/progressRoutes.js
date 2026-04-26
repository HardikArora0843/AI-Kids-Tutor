import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  saveProgress,
  getChildProgress,
  getTopicStats,
  getAnalytics,
} from "../controllers/progressController.js";

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

router.post("/save", saveProgress);
router.get("/analytics/:childId", getAnalytics);
router.get("/stats/:childId", getTopicStats);
router.get("/:childId", getChildProgress);

export default router;
