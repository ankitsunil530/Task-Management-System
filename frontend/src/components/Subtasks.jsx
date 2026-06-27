import { useEffect, useState } from "react";
import {
  addSubtaskAPI,
  toggleSubtaskAPI,
  deleteSubtaskAPI,
} from "../features/tasks/taskService";
import EmptyState from "./EmptyState";
import { ListTodo } from "lucide-react";

// Subtask checklist for a task. Mirrors the Comments component pattern:
// keeps its own local state seeded from the task, then syncs each change
// to the backend and updates local state from the response.
const Subtasks = ({ taskId, initialSubtasks = [] }) => {
  const [subtasks, setSubtasks] = useState(initialSubtasks);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  // Re-seed when the parent loads a different task.
  useEffect(() => {
    setSubtasks(initialSubtasks || []);
  }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const handleAdd = async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      setLoading(true);
      const saved = await addSubtaskAPI({ taskId, title: trimmed });
      setSubtasks((prev) => [...prev, saved]);
      setTitle("");
    } catch (err) {
      console.error("Failed to add subtask", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (subId) => {
    try {
      const updated = await toggleSubtaskAPI({ taskId, subId });
      setSubtasks((prev) =>
        prev.map((s) => (s._id === subId ? { ...s, completed: updated.completed } : s))
      );
    } catch (err) {
      console.error("Failed to toggle subtask", err);
    }
  };

  const handleDelete = async (subId) => {
    try {
      await deleteSubtaskAPI({ taskId, subId });
      setSubtasks((prev) => prev.filter((s) => s._id !== subId));
    } catch (err) {
      console.error("Failed to delete subtask", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-white">Subtasks</p>
        {totalCount > 0 && (
          <span className="text-xs text-gray-400">
            {completedCount}/{totalCount} done
          </span>
        )}
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="w-full h-2 bg-gray-900 rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}

      {/* List */}
      <div className="space-y-2 mb-3">
        {subtasks.length === 0 ? (
          <EmptyState
          icon={<ListTodo className="h-10 w-10" />}title="No Subtasks"
          description="Break your task into smaller steps by creating your first subtask."
          />
        ) : (
          subtasks.map((s) => (
            <div
              key={s._id}
              className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded"
            >
              <input
                type="checkbox"
                checked={s.completed}
                onChange={() => handleToggle(s._id)}
                className="h-4 w-4 accent-blue-500 cursor-pointer"
              />
              <span
                className={`flex-1 text-sm ${
                  s.completed ? "line-through text-gray-500" : "text-gray-200"
                }`}
              >
                {s.title}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(s._id)}
                aria-label="Delete subtask"
                className="text-gray-500 hover:text-red-400 text-sm"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add input */}
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a subtask…"
          className="flex-1 border border-gray-700 bg-gray-900 text-white p-2 rounded text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading}
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm disabled:opacity-50"
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default Subtasks;
