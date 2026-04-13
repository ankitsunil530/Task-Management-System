import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { getTaskNotification } from "../utils/taskNotification.js";
import {
  emitTaskCreated,
  emitTaskUpdate,
  emitTaskDeleted,
} from "../utils/socket.js";

const VALID_STATUS = ["todo", "in-progress", "done"];
const VALID_PRIORITY = ["low", "medium", "high"];
const MAX_LIMIT = 50;

/* ================= HELPERS ================= */

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const buildTaskResponse = (task) => ({
  ...task._doc,
  isOverdue:
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "done",
  notification: getTaskNotification(task),
});

// 🔥 FIXED (array support)
const checkPermission = (task, user) => {
  const isAssigned = task.assignedTo.some(
    (u) => u.toString() === user._id.toString()
  );

  if (!isAssigned && user.role !== "admin") {
    throw new Error("Not authorized");
  }
};

/* ================= CREATE TASK ================= */

export const createTask = asyncHandler(async (req, res) => {
  const { title, description = "", priority = "medium", deadline } = req.body;

  if (!title?.trim()) {
    res.status(400);
    throw new Error("Task title is required");
  }

  if (!VALID_PRIORITY.includes(priority)) {
    res.status(400);
    throw new Error("Invalid priority value");
  }

  if (deadline && isNaN(new Date(deadline))) {
    res.status(400);
    throw new Error("Invalid deadline date");
  }

  const task = await Task.create({
    title: title.trim(),
    description,
    priority,
    deadline,
    createdBy: req.user._id,
    assignedTo: [req.user._id], // 🔥 array
    watchers: [req.user._id], // 🔥 added
  });

  const responseTask = buildTaskResponse(task);

  // 🔥 emit to all assigned users
  task.assignedTo.forEach((uid) => emitTaskCreated(uid, responseTask));

  res.status(201).json({
    success: true,
    data: responseTask,
  });
});

/* ================= GET MY TASKS ================= */

export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    assignedTo: { $in: [req.user._id] }, // 🔥 fix
  })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks.map(buildTaskResponse),
  });
});

/* ================= GET ALL TASKS (ADMIN) ================= */

export const getAllTasks = asyncHandler(async (req, res) => {
  let { status, priority, search, page = 1, limit = 5 } = req.query;

  limit = Math.min(Number(limit) || 5, MAX_LIMIT);
  page = Number(page) || 1;

  const filter = {};

  if (status && VALID_STATUS.includes(status)) filter.status = status;
  if (priority && VALID_PRIORITY.includes(priority)) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    count: tasks.length,
    data: tasks.map(buildTaskResponse),
  });
});

/* ================= UPDATE TASK ================= */

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  checkPermission(task, req.user);

  const { title, description, priority, deadline, status } = req.body;

  if (priority && !VALID_PRIORITY.includes(priority)) {
    res.status(400);
    throw new Error("Invalid priority");
  }

  if (status && !VALID_STATUS.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  if (deadline && isNaN(new Date(deadline))) {
    res.status(400);
    throw new Error("Invalid deadline date");
  }

  // 🔥 Activity Logs
  if (status && status !== task.status) {
    task.activityLogs.push({
      action: "status_changed",
      user: req.user._id,
      oldValue: task.status,
      newValue: status,
    });
    task.status = status;
  }

  if (priority && priority !== task.priority) {
    task.activityLogs.push({
      action: "priority_changed",
      user: req.user._id,
      oldValue: task.priority,
      newValue: priority,
    });
    task.priority = priority;
  }

  if (title) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (deadline) task.deadline = deadline;

  await task.save();

  const responseTask = buildTaskResponse(task);

  // 🔥 emit to all users
  task.assignedTo.forEach((uid) => emitTaskUpdate(uid, responseTask));

  res.json({
    success: true,
    data: responseTask,
  });
});

/* ================= DELETE TASK ================= */

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  checkPermission(task, req.user);

  await task.deleteOne();

  // 🔥 emit to all users
  task.assignedTo.forEach((uid) => emitTaskDeleted(uid, task._id));

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});

/* ================= ASSIGN MULTIPLE USERS ================= */

export const assignTask = asyncHandler(async (req, res) => {
  const { userIds } = req.body;
  const { id } = req.params;

  if (!Array.isArray(userIds)) {
    res.status(400);
    throw new Error("userIds must be an array");
  }

  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  task.assignedTo = userIds;

  task.activityLogs.push({
    action: "assigned",
    user: req.user._id,
  });

  await task.save();

  userIds.forEach((uid) => emitTaskUpdate(uid, task));

  res.json({
    success: true,
    data: task,
  });
});

/* ================= ADD COMMENT (NEW) ================= */

export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) throw new Error("Task not found");

  checkPermission(task, req.user);

  // 🔥 mention detection
  const mentionMatches = text.match(/@(\w+)/g) || [];
  const usernames = mentionMatches.map((u) => u.replace("@", ""));

  const users = await User.find({ username: { $in: usernames } });
  const mentionedIds = users.map((u) => u._id);

  const comment = {
    user: req.user._id,
    text,
    mentions: mentionedIds,
  };

  task.comments.push(comment);

  task.activityLogs.push({
    action: "comment_added",
    user: req.user._id,
  });

  await task.save();

  task.assignedTo.forEach((uid) => emitTaskUpdate(uid, task));

  res.json({
    success: true,
    data: comment,
  });
});

/* ================= TOGGLE WATCHER ================= */

export const toggleWatcher = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new Error("Task not found");

  const userId = req.user._id;

  const index = task.watchers.findIndex(
    (u) => u.toString() === userId.toString()
  );

  if (index === -1) {
    task.watchers.push(userId);
  } else {
    task.watchers.splice(index, 1);
  }

  await task.save();

  res.json({ success: true });
});

/* ================= ADMIN: TASK STATS ================= */

export const getTaskStats = asyncHandler(async (req, res) => {
  const now = new Date();

  const [
    total,
    completed,
    pending,
    overdue,
    statusAggregation,
    priorityAggregation,
  ] = await Promise.all([
    Task.countDocuments(),
    Task.countDocuments({ status: "done" }),
    Task.countDocuments({ status: { $ne: "done" } }),
    Task.countDocuments({
      deadline: { $lt: now },
      status: { $ne: "done" },
    }),
    Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),
  ]);

  const statusCount = { todo: 0, "in-progress": 0, done: 0 };
  statusAggregation.forEach((s) => (statusCount[s._id] = s.count));

  const priorityCount = { low: 0, medium: 0, high: 0 };
  priorityAggregation.forEach((p) => (priorityCount[p._id] = p.count));

  res.json({
    success: true,
    data: {
      total,
      completed,
      pending,
      overdue,
      statusCount,
      priorityCount,
    },
  });
});