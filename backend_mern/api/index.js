import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "../db/db.js";
import authRoute from "../routes/authRoute.js";
import taskRoute from "../routes/taskRoutes.js";

dotenv.config();

const app = express();

/* ---------------- ENV ---------------- */
const NODE_ENV = process.env.NODE_ENV || "production";
const isDev = NODE_ENV === "development";

/* ---------------- DB (Serverless-safe) ---------------- */
let isConnected = false;

async function ensureDB() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    if (isDev) console.log("✅ MongoDB connected");
  }
}

/* ---------------- Middlewares ---------------- */
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

const allowedOrigins = isDev
  ? ["http://localhost:5173", "http://127.0.0.1:5173"]
  : (process.env.ALLOWED_ORIGINS || "").split(",").map(o => o.trim());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- Logs (dev only) ---------------- */
if (isDev) {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  });
}

/* ---------------- Routes ---------------- */
app.use("/api/user", authRoute);
app.use("/api/tasks", taskRoute);

/* ---------------- Health / Test ---------------- */
app.get("/api/ping", (req, res) => {
  res.json({ status: "backend alive" });
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", env: NODE_ENV });
});

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ---------------- Error Handler ---------------- */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    error: isDev ? err.message : "Internal Server Error"
  });
});

/* ❌ NO app.listen() in Vercel */
export default app;
