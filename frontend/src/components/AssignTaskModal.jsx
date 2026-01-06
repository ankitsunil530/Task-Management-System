import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import api from "../api/axios";
import { assignTask } from "../features/tasks/taskSlice";

export default function AssignTaskModal({ task, onClose }) {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    api.get("/user/users").then((res) => {
      setUsers(res.data.data);
    });
  }, []);

  const submit = () => {
    if (!userId) return;
    dispatch(assignTask({ taskId: task._id, userId }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">

      {/* MODAL */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm text-white shadow-xl">

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

        {/* SELECT USER */}
        <label className="block text-sm text-gray-400 mb-1">
          Select User
        </label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 text-white rounded px-3 py-2 mb-5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">-- Choose a user --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
