import mongoose from "mongoose";

//
// ===== Subtask Schema =====
//
const subTaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

//
// ===== Comment Schema =====
//
const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },

  mentions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  edited: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//
// ===== Activity Schema =====
//
const activitySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: [
      "created",
      "status_changed",
      "assigned",
      "priority_changed",
      "comment_added",
      "updated",
      "deleted",
    ],
    required: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  oldValue: String,
  newValue: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//
// ===== Attachment Schema (Optional but PRO) =====
//
const attachmentSchema = new mongoose.Schema({
  fileUrl: String,
  fileName: String,

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

//
// ===== Main Task Schema =====
//
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    deadline: Date,

    //
    // ===== Workspace / Team Support =====
    //
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },

    //
    // ===== Creator =====
    //
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //
    // ===== MULTI USER ASSIGNMENT (IMPORTANT) =====
    //
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    //
    // ===== Watchers (Notification subscribers) =====
    //
    watchers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    //
    // ===== Subtasks =====
    //
    subTasks: [subTaskSchema],

    //
    // ===== Comments =====
    //
    comments: [commentSchema],

    //
    // ===== Activity Logs =====
    //
    activityLogs: [activitySchema],

    //
    // ===== Attachments =====
    //
    attachments: [attachmentSchema],

    //
    // ===== Soft Delete =====
    //
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//
// ===== Indexes (VERY IMPORTANT FOR PERFORMANCE) =====
//
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ workspace: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ title: "text" });

export default mongoose.model("Task", taskSchema);