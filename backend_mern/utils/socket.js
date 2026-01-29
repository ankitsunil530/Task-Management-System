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
