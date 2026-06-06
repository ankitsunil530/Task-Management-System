import mongoose from "mongoose";

//
// ===== Notification Schema =====
//
// Persists a notification for a single recipient. Used by the comment/mention
// flow so a mentioned user can see, in real time and on next load, that they
// were referenced - independent of whether they are assigned to the task.
//
const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["mention", "comment", "assignment", "status_change"],
      required: true,
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Fast lookup of a user's notifications, newest first, and of unread counts.
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

export default mongoose.model("Notification", notificationSchema);
