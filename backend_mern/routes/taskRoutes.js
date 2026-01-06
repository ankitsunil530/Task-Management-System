import express from "express";
import protect from "../middlewares/authWebToken.js";
import admin from "../middlewares/adminMiddleware.js";

import {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus,
  assignTask,
  getTaskStats,
} from "../controllers/taskController.js";

const router = express.Router();

// User
router.post("/", protect, createTask);
router.get("/my", protect, getMyTasks);
router.patch("/:id/status", protect, updateTaskStatus);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);

// Admin
router.get("/", protect, admin, getAllTasks);
router.patch("/:id/assign", protect, admin, assignTask);
router.get("/stats", protect, admin, getTaskStats);

export default router;
