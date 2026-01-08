import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/db.js";
import authRoute from "./routes/authRoute.js";
import taskRoute from "./routes/taskRoutes.js";
dotenv.config();
const app = express();
const NODE_ENV = process.env.NODE_ENV || "development";
const isDev = NODE_ENV === "development";

// ✅ Connect to DB
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
      next();
    } catch (err) {
      console.error("❌ Database connection error:", err);
      res.status(500).json({ error: "Database connection error" });
    }
  } else {
    next();
  }
});
// ✅ CORS setup - environment-aware
const allowedOrigins = isDev
  ? ["http://localhost:5173", "http://localhost:5000", "http://127.0.0.1:5173"]
  : (process.env.ALLOWED_ORIGINS || "https://yourdomain.com").split(",").map(origin => origin.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (isDev) {
        console.warn(`CORS: Origin '${origin}' not in allowed list`);
      }
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET","PATCH","POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "application/json", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ Security Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ✅ Request Logging (development only)
if (isDev) {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// ✅ Routes
app.use("/api/user", authRoute);
app.use("/api/tasks", taskRoute);
// ✅ Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", environment: NODE_ENV });
});
app.get("/api/ping", (req, res) => {
  res.json({ status: "backend alive" });
});
app.get("/", (req, res) => {
  res.status(200).json({ message: "Backend is running", environment: NODE_ENV });
});

// ✅ 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler Middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = isDev ? err.message : "Internal Server Error";
  
  if (isDev) {
    console.error(`[ERROR] ${err.message}`);
    console.error(err.stack);
  }
  
  res.status(status).json({
    error: message,
    ...(isDev && { stack: err.stack })
  });
});

// ✅ Start Server with Graceful Shutdown
const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port} (${NODE_ENV})`);
});

// ✅ Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("📛 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("📛 SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
