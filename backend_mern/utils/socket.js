import { io } from "../server.js";

export const emitTaskUpdate = (userId, task) => {
  io.to(userId.toString()).emit("taskUpdated", task);
};

export const emitTaskCreated = (userId, task) => {
  io.to(userId.toString()).emit("taskCreated", task);
};

export const emitTaskDeleted = (userId, taskId) => {
  io.to(userId.toString()).emit("taskDeleted", taskId);
};

export const emitNotification = (userId, notification) => {
  io.to(userId.toString()).emit("notification", notification);
};

export const emitNewComment = (taskId, comment) => {
  io.to(taskId.toString()).emit("newComment", { taskId, comment });
};
