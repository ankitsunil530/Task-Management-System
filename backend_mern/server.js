import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

import connectDB from "./db/db.js";
import authRoute from "./routes/authRoute.js";
import taskRoute from "./routes/taskRoutes.js";
import notificationRoute from "./routes/notificationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const isDev = NODE_ENV === "development";

/* ===============================
   🔌 DATABASE CONNECTION (SAFE)
================================ */
let isConnected = false;

app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      next();
    } catch (err) {
      console.error("❌ Database connection error:", err);
      return res.status(500).json({ error: "Database connection error" });
    }
  } else {
    next();
  }
});

/* ===============================
   🌍 CORS CONFIG (PRODUCTION SAFE)
================================ */
const allowedOrigins = isDev
  ? [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:8000",
      "https://task-management-system-tawny-eta.vercel.app",
    ]
  : process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) callback(null, true);
    else callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ===============================
   🛡️ SECURITY MIDDLEWARE
================================ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

/* ===============================
   🧾 DEV LOGGER
================================ */
if (isDev) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

/* ===============================
   🚏 ROUTES
================================ */
app.use("/api/user", authRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/notifications", notificationRoute);

/* ===============================
   ❤️ HEALTH CHECK
================================ */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    environment: NODE_ENV,
  });
});

app.get("/api/ping", (req, res) => {
  res.json({ status: "backend alive" });
});

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Task Management Backend is running",
    environment: NODE_ENV,
  });
});

/* ===============================
   ❌ 404 HANDLER
================================ */
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

/* ===============================
   ⚠️ GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  const status = err.status || (res.statusCode >= 400 ? res.statusCode : 500);

  if (isDev) {
    console.error("❌ ERROR:", err.message);
    console.error(err.stack);
  }

  res.status(status).json({
    error: isDev ? err.message : "Internal Server Error",
  });
});

/* ===============================
   🚀 HTTP + SOCKET SERVER START
================================ */
const port = process.env.PORT || 5000;

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("⚡ Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

httpServer.listen(port, () => {
  console.log(`✅ Server running on port ${port} (${NODE_ENV})`);
});

/* ===============================
   🔻 GRACEFUL SHUTDOWN
================================ */
process.on("SIGTERM", () => {
  console.log("📛 SIGTERM received, shutting down...");
  httpServer.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("📛 SIGINT received, shutting down...");
  httpServer.close(() => process.exit(0));
});

process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
  process.exit(1);
});
