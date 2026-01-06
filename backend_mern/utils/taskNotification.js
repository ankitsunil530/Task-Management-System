export const getTaskNotification = (task) => {
  if (!task.deadline || task.status === "done") return null;

  const now = new Date();
  const deadline = new Date(task.deadline);

  const diffMs = deadline - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  // 🔴 Overdue
  if (diffHours < 0) {
    return {
      type: "overdue",
      message: "⚠️ Your task is overdue",
    };
  }

  // 🟡 Due soon (within 24 hours)
  if (diffHours <= 24) {
    return {
      type: "due-soon",
      message: "⏳ Your task is due soon",
    };
  }

  return null;
};
