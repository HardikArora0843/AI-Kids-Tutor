import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createTest,
  getTestsForChild,
  submitTest,
} from "../controllers/testController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/create", createTest);
router.get("/:childId", getTestsForChild);
router.post("/submit", submitTest);

export default router;
