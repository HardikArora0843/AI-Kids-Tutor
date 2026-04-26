import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getAnalysis,
  getRecommendation,
} from "../controllers/aiController.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/analysis/:childId", getAnalysis);
router.get("/recommendation/:childId", getRecommendation);

export default router;
