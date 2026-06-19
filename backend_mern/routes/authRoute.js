import express from "express";
import rateLimit from "express-rate-limit";
import {
  registerUser,
  loginUser,
  logoutUser,
  userProfile,
  updateProfilePicture,
  getAllUsers,
  deleteUser,
} from "../controllers/authController.js";

import { validate } from "../middlewares/validate.js";
import protect from "../middlewares/authWebToken.js";
import admin from "../middlewares/adminMiddleware.js";
import {
  loginAuthSchema,
  registerAuthSchema,
} from "../validations/authValidation.js";

const router = express.Router();
const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
});

// 🔐 Auth
router.post("/register", authLimiter, validate(registerAuthSchema), registerUser);
router.post("/login", authLimiter, validate(loginAuthSchema), loginUser);
router.post("/logout", protect, logoutUser);

// 👤 User
router.get("/profile", protect, userProfile);
router.patch("/profile/picture", protect, updateProfilePicture);

// 👑 Admin only
router.get("/users", protect, admin, getAllUsers);
router.delete("/delete/:id", protect, admin, deleteUser);

export default router;
    