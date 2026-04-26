import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  setLimit,
  getStatus,
  updateUsage,
  toggleLock,
} from "../controllers/screenTimeController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/set-limit", setLimit);
router.get("/status/:childId", getStatus);
router.post("/update-usage", updateUsage);
router.post("/toggle-lock", toggleLock);

export default router;
