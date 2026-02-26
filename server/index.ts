import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { getJwtSecret } from "./config/auth.js";
import movieRoutes from "./routes/movies.js";
import reviewRoutes from "./routes/reviews.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

// Initialize application state
let dbConnected = false;

// Attempt to connect to DB, but don't crash if it fails
connectDB().then((success) => {
  dbConnected = success;
  if (!success) {
    console.warn("WARNING: Database connection failed. Application running in limited mode.");
  }
});

getJwtSecret();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : ["http://localhost:8080"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: dbConnected ? "healthy" : "degraded",
    database: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

// Database Middleware - Check connection before handling DB-dependent routes
app.use("/api", (req, res, next) => {
  if (!dbConnected && mongoose.connection.readyState !== 1) {
     // Try to reconnect if not connected
     if (mongoose.connection.readyState === 0) {
        connectDB().then(success => {
            dbConnected = success;
            if (success) next();
            else res.status(503).json({ message: "Service Unavailable: Database connection failed", error: "Please check MONGO_URI configuration" });
        });
        return;
     }
     return res.status(503).json({ message: "Service Unavailable: Database connection failed", error: "Please check MONGO_URI configuration" });
  }
  next();
});

// API Routes
app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/auth", authRoutes);

// Serve Static Files in Production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
