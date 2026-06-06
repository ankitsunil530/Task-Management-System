import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Notification from "../models/Notification.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ================= GET MY NOTIFICATIONS ================= */
// Returns the current user's notifications (newest first) plus an unread count.
// Supports an optional ?unread=true filter and a capped limit.
export const getMyNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);
  const onlyUnread = req.query.unread === "true";

  const filter = { recipient: req.user._id };
  if (onlyUnread) filter.read = false;

  const [notifications, unreadCount] = await Promise.all([
    Notification.find(filter)
      .populate("sender", "name email")
      .populate("task", "title")
      .sort({ createdAt: -1 })
      .limit(limit),
    Notification.countDocuments({ recipient: req.user._id, read: false }),
  ]);

  res.json({
    success: true,
    unreadCount,
    count: notifications.length,
    data: notifications,
  });
});

/* ================= MARK ALL AS READ ================= */
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { $set: { read: true } }
  );

  res.json({ success: true, message: "All notifications marked as read" });
});

/* ================= MARK ONE AS READ ================= */
// A user may only mark their own notifications. Matching on both _id and
// recipient closes the IDOR where one user marks another user's notification.
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error("Invalid notification id");
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user._id },
    { $set: { read: true } },
    { new: true }
  );

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json({ success: true, data: notification });
});

/* ================= DELETE NOTIFICATION ================= */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidId(id)) {
    res.status(400);
    throw new Error("Invalid notification id");
  }

  const notification = await Notification.findOneAndDelete({
    _id: id,
    recipient: req.user._id,
  });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res.json({ success: true, message: "Notification removed" });
});
