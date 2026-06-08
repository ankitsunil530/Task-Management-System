import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { getTaskNotification } from "../utils/taskNotification.js";
import {
  emitTaskCreated,
  emitTaskUpdate,
  emitTaskDeleted,
  emitNotification,
} from "../utils/socket.js";

const VALID_STATUS = ["todo", "in-progress", "done"];
const VALID_PRIORITY = ["low", "medium", "high"];
const MAX_LIMIT = 50;

/* ================= HELPERS ================= */

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Characters that spreadsheet applications (Excel, Google Sheets, LibreOffice
// Calc) interpret as the start of a formula when they are the first character
// of a cell. A leading TAB or CR also triggers evaluation in some apps.
const CSV_FORMULA_TRIGGERS = new Set(["=", "+", "-", "@", "\t", "\r"]);

const csvEscape = (value) => {
  if (value === null || value === undefined) return "";

  let stringValue =
    value instanceof Date
      ? value.toISOString()
      : String(value).replace(/\r?\n/g, " ");

  // CSV / formula injection guard (CWE-1236, OWASP "CSV Injection").
  // Spreadsheet apps strip the surrounding CSV quotes on parse and then
  // evaluate any cell whose first character is = + - @ TAB or CR as a formula.
  // Prefixing a single quote marks the cell as literal text: the apostrophe is
  // not displayed and the underlying value is unchanged, but the formula engine
  // no longer executes it.
  if (stringValue.length > 0 && CSV_FORMULA_TRIGGERS.has(stringValue[0])) {
    stringValue = `'${stringValue}`;
  }

  return `"${stringValue.replace(/"/g, '""')}"`;
};

const formatDateForCsv = (value, includeTime = false) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return includeTime
    ? date.toISOString().replace("T", " ").slice(0, 19)
    : date.toISOString().slice(0, 10);
};

const buildTasksCsv = (tasks) => {
  const headers = [
    "Task Title",
    "Description",
    "Status",
    "Priority",
    "Due Date",
    "Created Date",
  ];

  const rows = tasks.map((task) => [
    csvEscape(task.title),
    csvEscape(task.description || ""),
    csvEscape(task.status),
    csvEscape(task.priority),
    csvEscape(formatDateForCsv(task.deadline)),
    csvEscape(formatDateForCsv(task.createdAt, true)),
  ]);

  return [headers.map(csvEscape).join(","), ...rows.map((row) => row.join(","))].join(
    "\r\n"
  );
};

const buildTaskResponse = (task) => ({
  ...task._doc,
  isOverdue:
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== "done",
  notification: getTaskNotification(task),
  activityLogs: task.activityLogs
    ? [...task.activityLogs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [],
});

// 🔥 FIXED (array support)
const checkPermission = (task, user) => {
  const uid = user._id.toString();
  const isAssigned = task.assignedTo.some((u) => u.toString() === uid);
  // The creator must retain access even after an admin reassigns the task to
  // other users (assignTask replaces assignedTo wholesale).
  const isCreator = task.createdBy && task.createdBy.toString() === uid;

  if (!isAssigned && !isCreator && user.role !== "admin") {
    const error = new Error("Not authorized");
    error.status = 403;
    throw error;
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
    activityLogs: [
      {
        action: "created",
        user: req.user._id,
        newValue: title.trim(),
      },
    ],
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
    // Exclude soft-deleted tasks so a deleted task disappears from listings.
    isDeleted: { $ne: true },
    // Return tasks the user is assigned to OR created, so a creator still sees
    // their task after being reassigned off the assignedTo list.
    $or: [
      { assignedTo: { $in: [req.user._id] } },
      { createdBy: req.user._id },
    ],
  })
    .populate("createdBy", "name email profilePicture")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks.map(buildTaskResponse),
  });
});

/* ================= EXPORT MY TASKS CSV ================= */

export const exportMyTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    assignedTo: { $in: [req.user._id] },
    isDeleted: { $ne: true },
  })
    .sort({ createdAt: -1 })
    .lean();

  const csv = `\uFEFF${buildTasksCsv(tasks)}`;
  const fileName = `tasks_${new Date().toISOString().slice(0, 10)}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
  res.setHeader("Cache-Control", "no-store");

  res.send(csv);
});

/* ================= GET ALL TASKS (ADMIN) ================= */

export const getAllTasks = asyncHandler(async (req, res) => {
  let { status, priority, search, page = 1, limit = 5 } = req.query;

  limit = Math.min(Number(limit) || 5, MAX_LIMIT);
  page = Number(page) || 1;

  const filter = { isDeleted: { $ne: true } };

  if (status && VALID_STATUS.includes(status)) filter.status = status;
  if (priority && VALID_PRIORITY.includes(priority)) filter.priority = priority;
  if (search) filter.title = { $regex: search, $options: "i" };

  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("assignedTo", "name email profilePicture")
      .populate("createdBy", "name email profilePicture")
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

/* ================= GET TASK DETAILS ================= */

export const getTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, isDeleted: { $ne: true } })
    .populate("createdBy", "name email profilePicture")
    .populate("assignedTo", "name email profilePicture")
    .populate("activityLogs.user", "name email profilePicture");

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  checkPermission(task, req.user);

  res.json({
    success: true,
    data: buildTaskResponse(task),
  });
});

/* ================= UPDATE TASK ================= */

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, isDeleted: { $ne: true } });
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
  const updates = [];

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

  if (title && title.trim() !== task.title) {
    updates.push(`Title: "${task.title}" → "${title.trim()}"`);
    task.title = title.trim();
  }

  if (description !== undefined && description !== task.description) {
    updates.push("Description updated");
    task.description = description;
  }

  const originalDeadline = task.deadline ? new Date(task.deadline) : null;
  const newDeadline = deadline ? new Date(deadline) : null;
  if (
    deadline &&
    (!originalDeadline || originalDeadline.toISOString() !== newDeadline.toISOString())
  ) {
    updates.push(
      `Deadline: "${originalDeadline?.toLocaleDateString() || "none"}" → "${newDeadline.toLocaleDateString()}"`
    );
    task.deadline = deadline;
  }

  if (updates.length > 0) {
    task.activityLogs.push({
      action: "updated",
      user: req.user._id,
      oldValue: updates.join("; "),
      newValue: "Task fields updated",
    });
  }

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

  const task = await Task.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  checkPermission(task, req.user);

  // Soft delete: flag the document instead of removing it, so an accidental
  // delete can be restored and an audit trail survives. All list/detail
  // queries filter { isDeleted: { $ne: true } }, so a soft-deleted task
  // disappears from the UI exactly like a hard delete would.
  task.isDeleted = true;
  task.deletedAt = new Date();
  await task.save();

  // 🔥 emit to all users
  task.assignedTo.forEach((uid) => emitTaskDeleted(uid, task._id));

  res.json({
    success: true,
    message: "Task deleted successfully",
  });
});

/* ================= RESTORE TASK ================= */

export const restoreTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  // Look up explicitly among soft-deleted tasks (the normal queries exclude
  // them). Sets isDeleted in the query so it can find the deleted document.
  const task = await Task.findOne({ _id: id, isDeleted: true });
  if (!task) {
    res.status(404);
    throw new Error("Deleted task not found");
  }

  checkPermission(task, req.user);

  task.isDeleted = false;
  task.deletedAt = null;
  await task.save();

  res.json({
    success: true,
    message: "Task restored successfully",
    data: buildTaskResponse(task),
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

  // Verify every provided id is a valid ObjectId
  const invalidIds = userIds.filter((uid) => !validateObjectId(uid));
  if (invalidIds.length > 0) {
    res.status(400);
    throw new Error(`Invalid user id(s): ${invalidIds.join(", ")}`);
  }

  // Verify every provided user actually exists before assigning
  const existingCount = await User.countDocuments({ _id: { $in: userIds } });
  if (existingCount !== userIds.length) {
    res.status(400);
    throw new Error("One or more assigned users do not exist");
  }

  const task = await Task.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

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

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

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

  // Notify mentioned users (excluding the comment author mentioning themselves).
  // Persist a Notification per recipient, then push it to their personal room
  // so it appears in real time and survives a page reload.
  const recipientIds = mentionedIds.filter(
    (mid) => mid.toString() !== req.user._id.toString()
  );

  if (recipientIds.length > 0) {
    const created = await Notification.insertMany(
      recipientIds.map((rid) => ({
        recipient: rid,
        sender: req.user._id,
        type: "mention",
        task: task._id,
        message: `${req.user.name} mentioned you in a comment on "${task.title}"`,
      }))
    );

    created.forEach((doc) => emitNotification(doc.recipient, doc));
  }

  task.assignedTo.forEach((uid) => emitTaskUpdate(uid, task));

  res.json({
    success: true,
    data: comment,
  });
});

/* ================= TOGGLE WATCHER ================= */

export const toggleWatcher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id)) {
    res.status(400);
    throw new Error("Invalid task id");
  }

  const task = await Task.findOne({ _id: id, isDeleted: { $ne: true } });
  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Watching a task is a task-scoped action; restrict it to the creator,
  // assignees, or an admin. Previously this endpoint had no permission check,
  // so any authenticated user could watch/unwatch any task by id (IDOR).
  checkPermission(task, req.user);

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
    Task.countDocuments({ isDeleted: { $ne: true } }),
    Task.countDocuments({ status: "done", isDeleted: { $ne: true } }),
    Task.countDocuments({ status: { $ne: "done" }, isDeleted: { $ne: true } }),
    Task.countDocuments({
      deadline: { $lt: now },
      status: { $ne: "done" },
      isDeleted: { $ne: true },
    }),
    Task.aggregate([
      { $match: { isDeleted: { $ne: true } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { isDeleted: { $ne: true } } },
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
