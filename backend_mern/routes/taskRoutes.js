import express from "express";
import protect from "../middlewares/authWebToken.js";
import admin from "../middlewares/adminMiddleware.js";
import { validate } from "../middlewares/validate.js";

import {
  createTask,
  getMyTasks,
  getAllTasks,
  updateTask,
  deleteTask,
  assignTask,
  getTaskStats,
} from "../controllers/taskController.js";

import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
} from "../validations/taskValidation.js";

const router = express.Router();

// User
router.post("/", protect, validate(createTaskSchema), createTask);
router.get("/my", protect, getMyTasks);
router.put("/:id", protect, validate(updateTaskSchema), updateTask);
router.delete("/:id", protect, deleteTask);

// Admin
router.get("/", protect, admin, getAllTasks);
router.patch("/:id/assign", protect, admin, validate(assignTaskSchema), assignTask);
router.get("/stats", protect, admin, getTaskStats);

export default router;
