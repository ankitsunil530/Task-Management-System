import express from "express";
import protect from "../middlewares/authWebToken.js";
import admin from "../middlewares/adminMiddleware.js";
import { validate } from "../middlewares/validate.js";

import {
  createTask,
  getMyTasks,
  exportMyTasks,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  restoreTask,
  assignTask,
  getTaskStats,
  addComment,        //  NEW
  editComment,       //  NEW
  toggleWatcher,     //  NEW
  addSubtask,        //  NEW
  toggleSubtask,     //  NEW
  deleteSubtask,     //  NEW
} from "../controllers/taskController.js";

import {
  createTaskSchema,
  updateTaskSchema,
  assignTaskSchema,
  addCommentSchema,
  addSubtaskSchema,
} from "../validations/taskValidation.js";

const router = express.Router();



// Create Task
router.post("/", protect, validate(createTaskSchema), createTask);

// Get My Tasks
router.get("/my", protect, getMyTasks);

// Export My Tasks CSV
router.get("/my/export", protect, exportMyTasks);

// Task Stats (Admin)
router.get("/stats", protect, admin, getTaskStats);

// Get Task Details
router.get("/:id", protect, getTask);

// Update Task
router.put("/:id", protect, validate(updateTaskSchema), updateTask);

// Delete Task (soft delete)
router.delete("/:id", protect, deleteTask);

// Restore a soft-deleted task
router.patch("/:id/restore", protect, restoreTask);

// 🔥 Add Comment
router.post("/:id/comment", protect, validate(addCommentSchema), addComment);

// 🔥 Edit Comment (author or admin only)
router.patch("/:id/comments/:commentId", protect, validate(addCommentSchema), editComment);

// 🔥 Toggle Watcher (subscribe/unsubscribe)
router.patch("/:id/watch", protect, toggleWatcher);

// 🔥 Subtasks (creator / assignee / admin only — enforced in controller)
router.post("/:id/subtasks", protect, validate(addSubtaskSchema), addSubtask);
router.patch("/:id/subtasks/:subId", protect, toggleSubtask);
router.delete("/:id/subtasks/:subId", protect, deleteSubtask);



router.get("/", protect, admin, getAllTasks);


router.patch(
  "/:id/assign",
  protect,
  admin,
  validate(assignTaskSchema),
  assignTask
);

export default router;
