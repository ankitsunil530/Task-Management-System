import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  getAllUsers,
  deleteUser,
} from "../controllers/authController.js";

import protect from "../middlewares/authWebToken.js";
import admin from "../middlewares/adminMiddleware.js";

const router = express.Router();

// 🔐 Auth
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);

// 👤 User
router.get("/profile", protect, userProfile);

// 👑 Admin only
router.get("/users", protect, admin, getAllUsers);
router.delete("/delete/:id", protect, admin, deleteUser);

export default router;
    