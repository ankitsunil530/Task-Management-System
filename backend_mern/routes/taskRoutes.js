import express from "express";
import protect from "../middlewares/authWebToken.js";
import admin from "../middlewares/adminMiddleware.js";
import { validate } from "../middlewares/validate.js";

import {
  createTask,
  getMyTasks,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  assignTask,
  getTaskStats,
  addComment,        // 🔥 NEW
  toggleWatcher,     // 🔥 NEW
} from "../controllers/taskController.js";

import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  addCommentSchema,
} from "../validations/taskValidation.js";

const router = express.Router();

/* ================= USER ROUTES ================= */

// Create Task
router.post("/", protect, validate(createTaskSchema), createTask);

// Get My Tasks
router.get("/my", protect, getMyTasks);

// Task Stats (Admin)
router.get("/stats", protect, admin, getTaskStats);

// Get Task Details
router.get("/:id", protect, getTask);

// Update Task
router.put("/:id", protect, validate(updateTaskSchema), updateTask);

// Delete Task
router.delete("/:id", protect, deleteTask);

// 🔥 Add Comment
router.post("/:id/comment", protect, validate(addCommentSchema), addComment);

// 🔥 Toggle Watcher (subscribe/unsubscribe)
router.patch("/:id/watch", protect, toggleWatcher);

/* ================= ADMIN ROUTES ================= */

// Get All Tasks (Admin)
router.get("/", protect, admin, getAllTasks);

// Assign Multiple Users (Admin)
router.patch(
  "/:id/assign",
  protect,
  admin,
  validate(assignTaskSchema),
  assignTask
);

export default router;
