import express from "express";
import protect from "../middlewares/authWebToken.js";
import {
  getMyNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// List my notifications (+ unread count)
router.get("/", protect, getMyNotifications);

// Mark every notification read. Declared before the parameterized id route
// so the literal path is never captured by it.
router.patch("/read-all", protect, markAllAsRead);

// Mark a single notification read
router.patch("/:id/read", protect, markAsRead);

// Delete a single notification
router.delete("/:id", protect, deleteNotification);

export default router;
