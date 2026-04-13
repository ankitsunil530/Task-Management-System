import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { socket } from "./socket";

// Public pages
import Home from "./components/Home";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Layout from "./pages/Layout";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboards
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Auth guard
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector((state) => state.auth);

  /* ================= SOCKET CONNECTION ================= */

  useEffect(() => {
    if (user?._id) {
      if (!socket.connected) {
        socket.connect();
      }

      // 🔥 Join personal room (for notifications)
      socket.emit("join", user._id);

      console.log("🔌 Socket connected for user:", user._id);

      /* ================= SOCKET LISTENERS ================= */

      // 🔥 Real-time task updates
      socket.on("taskUpdated", (task) => {
        console.log("📌 Task updated:", task);
        // 👉 later dispatch redux action
      });

      socket.on("taskCreated", (task) => {
        console.log("🆕 Task created:", task);
      });

      socket.on("taskDeleted", (taskId) => {
        console.log("❌ Task deleted:", taskId);
      });

      // 🔥 NEW: comment event
      socket.on("newComment", (data) => {
        console.log("💬 New comment:", data);
      });

      // 🔥 NEW: notification event (mentions/watchers)
      socket.on("notification", (data) => {
        console.log("🔔 Notification:", data);
      });
    }

    return () => {
      // 🔥 clean listeners (VERY IMPORTANT)
      socket.off("taskUpdated");
      socket.off("taskCreated");
      socket.off("taskDeleted");
      socket.off("newComment");
      socket.off("notification");

      if (!user && socket.connected) {
        socket.disconnect();
        console.log("❌ Socket disconnected");
      }
    };
  }, [user]);

  return (
    <Routes>
      {/* ========== PUBLIC ROUTES ========== */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="services" element={<Services />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      {/* ========== AUTH ROUTES ========== */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            />
          ) : (
            <Register />
          )
        }
      />

      {/* ========== USER DASHBOARD ========== */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* ========== ADMIN DASHBOARD ========== */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* ========== FALLBACK ========== */}
      <Route
        path="*"
        element={
          user ? (
            <Navigate
              to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;