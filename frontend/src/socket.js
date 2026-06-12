import { io } from "socket.io-client";

// Derive the Socket.IO server origin from the existing VITE_API_URL env var.
// VITE_API_URL is "http://host/api" (with the /api path); Socket.IO must
// connect to the bare origin ("http://host") because the server registers only
// the default "/" namespace. Passing "/api" as the URL causes Socket.IO to
// dial the "/api" namespace, which does not exist on the server, so the
// connection fails silently in production and "join" events are never sent.
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
const SOCKET_URL = apiUrl.replace(/\/api$/, "");

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,

  // 🔥 Better reliability
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,

  // 🔥 Optional: timeout
  timeout: 20000,
});

/* ================= SOCKET EVENTS ================= */

// Connected
socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

// Disconnected
socket.on("disconnect", (reason) => {
  console.log("🔴 Socket disconnected:", reason);
});

// Reconnect attempt
socket.on("reconnect_attempt", () => {
  console.log("🔄 Reconnecting...");
});

// Connection error
socket.on("connect_error", (err) => {
  console.error("❌ Socket error:", err.message);
});
