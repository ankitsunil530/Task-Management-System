import mongoose from "mongoose";

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
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const activitySchema = new mongoose.Schema({
  action: String, // "status_changed", "assigned", "updated"
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subTasks: [subTaskSchema],

    comments: [commentSchema],

    activityLogs: [activitySchema],

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//
// ===== Indexes for performance =====
//
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ deadline: 1 });
taskSchema.index({ title: "text" });

export default mongoose.model("Task", taskSchema);
