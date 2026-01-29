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

  // ✅ SOCKET CONNECTION HANDLER
  useEffect(() => {
    if (user?._id) {
      if (!socket.connected) {
        socket.connect();
      }

      socket.emit("join", user._id);
      console.log("🔌 Socket connected for user:", user._id);
    }

    return () => {
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
