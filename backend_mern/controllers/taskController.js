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

const checkPermission = (task, user) => {
  if (
    task.assignedTo.toString() !== user._id.toString() &&
    user.role !== "admin"
  ) {
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
    assignedTo: req.user._id,
  });

  const responseTask = buildTaskResponse(task);

  // 🔔 Real-time emit
  emitTaskCreated(req.user._id, responseTask);

  res.status(201).json({
    success: true,
    data: responseTask,
  });
});

/* ================= GET MY TASKS ================= */

export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id })
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

  if (title) task.title = title.trim();
  if (description !== undefined) task.description = description;
  if (priority) task.priority = priority;
  if (deadline) task.deadline = deadline;
  if (status) task.status = status;

  await task.save();

  const responseTask = buildTaskResponse(task);

  // 🔔 Real-time emit
  emitTaskUpdate(task.assignedTo, responseTask);

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

  // Optional soft delete:
  // task.isDeleted = true;
  // await task.save();

  await task.deleteOne();

  // 🔔 Real-time emit
  emitTaskDeleted(task.assignedTo, task._id);

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});

/* ================= ADMIN: ASSIGN TASK ================= */

export const assignTask = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;

  if (!validateObjectId(userId) || !validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid user or task id");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await Task.findById(id).session(session);
    if (!task) throw new Error("Task not found");

    const user = await User.findById(userId).session(session);
    if (!user) throw new Error("User not found");

    task.assignedTo = userId;
    await task.save({ session });

    await session.commitTransaction();

    const responseTask = buildTaskResponse(task);

    // 🔔 Real-time emit
    emitTaskUpdate(userId, responseTask);

    res.json({
      success: true,
      message: "Task assigned successfully",
      data: responseTask,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
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

    // Status count
    Task.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),

    // Priority count
    Task.aggregate([
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const statusCount = {
    todo: 0,
    "in-progress": 0,
    done: 0,
  };

  statusAggregation.forEach((s) => {
    statusCount[s._id] = s.count;
  });

  const priorityCount = {
    low: 0,
    medium: 0,
    high: 0,
  };

  priorityAggregation.forEach((p) => {
    priorityCount[p._id] = p.count;
  });

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

