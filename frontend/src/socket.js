import { io } from "socket.io-client";

const URL = "http://localhost:8000/api";

export const socket = io(URL, {
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