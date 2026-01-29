import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTask } from "../features/tasks/taskSlice";

export default function CreateTaskModal({ open, onClose }) {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.tasks);

  const initialState = {
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  };

  const [form, setForm] = useState(initialState);

  useEffect(() => {
    if (!open) {
      setForm(initialState);
    }
  }, [open]);

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      title: form.title.trim(),
      description: form.description,
      priority: form.priority,
      ...(form.deadline && { deadline: form.deadline }),
    };

    const res = await dispatch(createTask(payload));

    if (res.meta.requestStatus === "fulfilled") {
      setForm(initialState);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Create Task</h3>

        <form onSubmit={submit} className="space-y-3">
          <input
            value={form.title}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            placeholder="Title"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          <textarea
            value={form.description}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            placeholder="Description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <select
            value={form.priority}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <input
            type="datetime-local"
            value={form.deadline}
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            onChange={(e) =>
              setForm({ ...form, deadline: e.target.value })
            }
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
              disabled={isLoading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 px-4 py-2 rounded text-white disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
