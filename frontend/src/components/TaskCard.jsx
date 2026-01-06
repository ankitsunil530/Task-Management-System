import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../features/tasks/taskSlice";
import { toast } from "react-toastify";

import StatusDropdown from "./StatusDropdown";
import AssignTaskModal from "./AssignTaskModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const isAdmin = user?.role === "admin";
  const [openAssign, setOpenAssign] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const badge =
    task.notification?.type === "overdue"
      ? "bg-red-500/10 text-red-400"
      : task.notification?.type === "due-soon"
      ? "bg-yellow-500/10 text-yellow-400"
      : "bg-gray-700 text-gray-300";

    const handleDelete = () => {
    dispatch(deleteTask(task._id));
    toast.success(isAdmin ? "Task deleted by admin" : "Task deleted");
    setConfirmDelete(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-white">{task.title}</h3>
        <span className={`text-xs px-2 py-1 rounded ${badge}`}>
          {task.notification?.type || task.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-400 text-sm mt-1">{task.description}</p>

      {/* ASSIGNED USER */}
      <p className="text-xs text-gray-400 mt-2">
        Assigned to:{" "}
        <span className="text-gray-200 font-medium">
          {task.assignedTo?.name || "Unassigned"}
        </span>
      </p>

      {/* FOOTER */}
      <div className="flex justify-between items-center mt-4">

        {/* LEFT */}
        <span className="text-xs text-gray-500">
          Priority: {task.priority}
        </span>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">

          {/* STATUS (USER + ADMIN) */}
          <StatusDropdown task={task} />

          {/* ADMIN: ASSIGN */}
          {isAdmin && (
            <button
              onClick={() => setOpenAssign(true)}
              className="text-xs bg-indigo-600 text-black px-2 py-1 rounded"
            >
              Assign
            </button>
          )}
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Delete
          </button>

           {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete Task?"
          message="This task will be permanently deleted."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

        </div>
      </div>

      {/* ASSIGN MODAL */}
      {openAssign && (
        <AssignTaskModal
          task={task}
          onClose={() => setOpenAssign(false)}
        />
      )}
    </div>
  );
}
