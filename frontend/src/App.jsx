import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

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

  return (
    <Routes>

      {/* ========== PUBLIC ROUTES (ALWAYS VISIBLE) ========== */}
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
          user
            ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} />
            : <Login />
        }
      />
      <Route
        path="/register"
        element={
          user
            ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} />
            : <Register />
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
          user
            ? <Navigate to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} />
            : <Navigate to="/" />
        }
      />

    </Routes>
  );
}

export default App;
