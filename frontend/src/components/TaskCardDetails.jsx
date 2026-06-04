import { useEffect, useState } from "react";
import Comments from "./Comments";
import { getTaskByIdAPI } from "../features/tasks/taskService";

const actionLabels = {
  created: "Task Created",
  updated: "Task Updated",
  status_changed: "Status Changed",
  priority_changed: "Priority Changed",
  deleted: "Task Deleted",
  comment_added: "Comment Added",
  assigned: "Assigned",
};

export default function TaskDetailModal({ taskId, initialTask, onClose, users }) {
  const [task, setTask] = useState(initialTask || null);
  const [loading, setLoading] = useState(!initialTask);

  useEffect(() => {
    let mounted = true;

    const fetchTask = async () => {
      if (!taskId) return;
      setLoading(true);

      try {
        const data = await getTaskByIdAPI(taskId);
        if (mounted) setTask(data);
      } catch (err) {
        console.error("Failed to load task details", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTask();

    return () => {
      mounted = false;
    };
  }, [taskId]);

  const renderActivityItem = (event) => (
    <div
      key={event._id || event.createdAt}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">
            {actionLabels[event.action] || event.action}
          </p>
          <p className="text-xs text-gray-400">
            {event.user?.name || "System"} · {new Date(event.createdAt).toLocaleString()}
          </p>
        </div>

        {(event.oldValue || event.newValue) && (
          <div className="text-xs text-gray-300 text-right max-w-[260px] break-words">
            {event.oldValue && <p className="text-gray-400">From: {event.oldValue}</p>}
            {event.newValue && <p className="text-white">To: {event.newValue}</p>}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {task?.title || "Task details"}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {task?.description || "No description provided"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl self-start"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-400 mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Priority</p>
                <p className="text-white mt-1">{task?.priority || "N/A"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Due date</p>
                <p className="text-white mt-1">
                  {task?.deadline ? new Date(task.deadline).toLocaleDateString() : "None"}
                </p>
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-3">Assigned Users</p>
              <div className="flex flex-wrap gap-2">
                {task?.assignedTo?.length > 0 ? (
                  task.assignedTo.map((user) => (
                    <span
                      key={user._id}
                      className="bg-gray-900 text-gray-200 px-3 py-1 rounded-full text-xs"
                    >
                      {user.name}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No users assigned.</p>
                )}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-3">Activity Timeline</p>
              {loading ? (
                <p className="text-gray-400">Loading activity…</p>
              ) : task?.activityLogs?.length > 0 ? (
                <div className="space-y-3">
                  {task.activityLogs.map(renderActivityItem)}
                </div>
              ) : (
                <p className="text-gray-400">No activity recorded yet.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-sm font-semibold text-white mb-3">Details</p>
              <div className="text-sm text-gray-300 space-y-2">
                <p>
                  <span className="text-gray-400">Created by:</span>{" "}
                  {task?.createdBy?.name || "Unknown"}
                </p>
                <p>
                  <span className="text-gray-400">Created at:</span>{" "}
                  {task?.createdAt ? new Date(task.createdAt).toLocaleString() : "Unknown"}
                </p>
              </div>
            </div>

            <Comments taskId={taskId} users={users} />
          </div>
        </div>
      </div>
    </div>
  );
}
