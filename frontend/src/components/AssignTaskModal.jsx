import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { assignTask } from "../features/tasks/taskSlice";

export default function AssignTaskModal({ task, onClose }) {
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        setFetching(true);
        const res = await api.get("/user/users", {
          signal: controller.signal,
        });
        setUsers(res.data.data || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error(err);
          setError("Failed to load users");
        }
      } finally {
        setFetching(false);
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, []);

  const submit = async () => {
    if (!userId || userId === task.assignedTo?._id) return;

    setLoading(true);
    setError(null);

    const res = await dispatch(
      assignTask({ taskId: task._id, userId })
    );

    setLoading(false);

    if (res.meta.requestStatus === "fulfilled") {
      onClose();
    } else {
      setError("Assignment failed. Try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
      onClick={onClose}
    >
      {/* MODAL */}
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Assign Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm"
          >
            ✕
          </button>
        </div>

        {/* USER SELECT */}
        <label className="block text-sm text-gray-400 mb-1">
          Select User
        </label>

        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          disabled={fetching || loading}
          className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        >
          <option value="">-- Choose a user --</option>

          {users.map((u) => (
            <option
              key={u._id}
              value={u._id}
              disabled={u._id === task.assignedTo?._id}
            >
              {u.name}
              {u._id === task.assignedTo?._id ? " (current)" : ""}
            </option>
          ))}
        </select>

        {fetching && (
          <p className="text-xs text-gray-400 mb-2">Loading users...</p>
        )}

        {error && (
          <p className="text-xs text-red-400 mb-2">{error}</p>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-800 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={loading || !userId}
            className="px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
          >
            {loading ? "Assigning..." : "Assign"}
          </button>
        </div>
      </div>
    </div>
  );
}
