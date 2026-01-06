import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask } from "../features/tasks/taskSlice";

export default function CreateTaskModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
  });

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!form.title) return;
    dispatch(createTask(form));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-950 border border-gray-800 rounded-xl p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold text-white mb-4">Create Task</h3>

        <form onSubmit={submit} className="space-y-3">
          <input
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            placeholder="Title"
            onChange={(e)=>setForm({...form,title:e.target.value})}
            required
          />
          <textarea
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            placeholder="Description"
            onChange={(e)=>setForm({...form,description:e.target.value})}
          />
          <select
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            onChange={(e)=>setForm({...form,priority:e.target.value})}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="datetime-local"
            className="w-full p-2 rounded bg-gray-900 border border-gray-700 text-white"
            onChange={(e)=>setForm({...form,deadline:e.target.value})}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="text-gray-400">
              Cancel
            </button>
            <button className="bg-indigo-600 px-4 py-2 rounded text-white">
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
