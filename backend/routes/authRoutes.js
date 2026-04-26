import express from "express";
import { register, login, getChildren } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/children", authMiddleware, getChildren);

export default router;
