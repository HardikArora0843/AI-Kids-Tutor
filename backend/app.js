import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import screenTimeRoutes from "./routes/screenTimeRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import testRoutes from "./routes/testRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS allowlist from env (comma-separated URLs)
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (curl, Postman, health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS: Origin not allowed"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/screentime", screenTimeRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/test", testRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});