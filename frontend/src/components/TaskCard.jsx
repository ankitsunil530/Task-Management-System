import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask } from "../features/tasks/taskSlice";

import TaskDetailModal from "./TaskCardDetails";
import StatusDropdown from "./StatusDropdown";
import AssignTaskModal from "./AssignTaskModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

export default function TaskCard({ task }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [openDetails, setOpenDetails] = useState(false);
  const [openAssign, setOpenAssign] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isAdmin = user?.role === "admin";

  const badge =
    task.notification?.type === "overdue"
      ? "bg-red-500/10 text-red-400"
      : task.notification?.type === "due-soon"
      ? "bg-yellow-500/10 text-yellow-400"
      : "bg-gray-700 text-gray-300";

  // 🔥 MULTI USER SUPPORT
  const assignedNames = Array.isArray(task.assignedTo)
    ? task.assignedTo.map((u) => u.name).join(", ")
    : "You";

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
    setConfirmDelete(false);
  };

  return (
    <>
      {/* ================= CARD ================= */}
      <div
        onClick={() => setOpenDetails(true)}
        className="bg-gray-900 border border-gray-800 rounded-xl p-4 cursor-pointer hover:border-gray-600 transition"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-white">{task.title}</h3>
          <span className={`text-xs px-2 py-1 rounded ${badge}`}>
            {task.notification?.type || task.status}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-gray-400 text-sm mt-1">{task.description}</p>

        {/* ASSIGNED USERS */}
        <p className="text-xs text-gray-400 mt-2">
          Assigned to:{" "}
          <span className="text-gray-200 font-medium">
            {assignedNames}
          </span>
        </p>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-xs text-gray-500">
              Priority: {task.priority}
            </span>

            {task.deadline && (
              <span className="text-xs text-gray-500 ml-3">
                Due: {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* STATUS */}
            <div onClick={(e) => e.stopPropagation()}>
              <StatusDropdown task={task} />
            </div>

            {/* ADMIN ASSIGN */}
            {isAdmin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenAssign(true);
                }}
                className="text-xs bg-indigo-600 text-black px-2 py-1 rounded"
              >
                Assign
              </button>
            )}

            {/* DELETE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(true);
              }}
              className="text-xs text-red-400 hover:text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* 🔥 TASK DETAIL (COMMENTS HERE) */}
      {openDetails && (
        <TaskDetailModal
          task={task}
          users={[]} // 👉 pass users here later
          onClose={() => setOpenDetails(false)}
        />
      )}

      {/* ASSIGN */}
      {openAssign && (
        <AssignTaskModal
          task={task}
          onClose={() => setOpenAssign(false)}
        />
      )}

      {/* DELETE */}
      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete Task?"
          message="This task will be permanently deleted."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </>
  );
}