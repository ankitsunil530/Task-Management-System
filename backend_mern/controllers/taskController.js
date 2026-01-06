import asyncHandler from "express-async-handler";
import Task from "../models/Task.js";
import User from "../models/User.js";
import { getTaskNotification } from "../utils/taskNotification.js";

/* ================= CREATE TASK (USER) ================= */
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, priority, deadline } = req.body;

  if (!title) {
    res.status(400);
    throw new Error("Task title is required");
  }

  const task = await Task.create({
    title,
    description,
    priority,
    deadline,
    createdBy: req.user._id,
    assignedTo: req.user._id,
  });

  res.status(201).json({
    success: true,
    data: task,
  });
});

/* ================= GET MY TASKS (USER) ================= */
export const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });

  const updatedTasks = tasks.map((task) => {
    const notification = getTaskNotification(task);

    return {
      ...task._doc,
      isOverdue:
        task.deadline &&
        new Date(task.deadline) < new Date() &&
        task.status !== "done",
      notification,
    };
  });

  res.json({
    success: true,
    count: updatedTasks.length,
    data: updatedTasks,
  });
});

/* ================= GET ALL TASKS (ADMIN) ================= */
export const getAllTasks = asyncHandler(async (req, res) => {
  const { status, priority, search, page = 1, limit = 5 } = req.query;

  let filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const skip = (pageNumber - 1) * pageSize;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize);

  const updatedTasks = tasks.map((task) => {
    const notification = getTaskNotification(task);

    return {
      ...task._doc,
      isOverdue:
        task.deadline &&
        new Date(task.deadline) < new Date() &&
        task.status !== "done",
      notification,
    };
  });

  const total = await Task.countDocuments(filter);

  res.json({
    success: true,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize),
    count: updatedTasks.length,
    data: updatedTasks,
  });
});

/* ================= UPDATE TASK ================= */
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.assignedTo.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this task");
  }

  const { title, description, priority, deadline } = req.body;

  task.title = title || task.title;
  task.description = description || task.description;
  task.priority = priority || task.priority;
  task.deadline = deadline || task.deadline;

  const updatedTask = await task.save();

  res.json({
    success: true,
    data: updatedTask,
  });
});

/* ================= UPDATE TASK STATUS ================= */
export const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!["todo", "in-progress", "done"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.assignedTo.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  task.status = status;
  await task.save();

  res.json({
    success: true,
    data: task,
  });
});

/* ================= DELETE TASK ================= */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (
    task.assignedTo.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete");
  }

  await task.deleteOne();

  res.json({
    success: true,
    message: "Task deleted",
  });
});

/* ================= ADMIN: ASSIGN TASK ================= */
export const assignTask = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("userId is required");
  }

  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  task.assignedTo = userId;
  await task.save();

  res.json({
    success: true,
    message: "Task assigned successfully",
    data: task,
  });
});

/* ================= ADMIN: TASK STATS ================= */
export const getTaskStats = asyncHandler(async (req, res) => {
  const total = await Task.countDocuments();
  const completed = await Task.countDocuments({ status: "done" });
  const pending = await Task.countDocuments({ status: { $ne: "done" } });
  const overdue = await Task.countDocuments({
    deadline: { $lt: new Date() },
    status: { $ne: "done" },
  });

  res.json({
    success: true,
    data: {
      total,
      completed,
      pending,
      overdue,
    },
  });
});
