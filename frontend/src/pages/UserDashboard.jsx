import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMyTasks } from "../features/tasks/taskSlice";
import { logout } from "../features/auth/authSlice";

import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import KanbanBoard from "./KanbanBoard";

// Charts
import StatusPieChart from "../components/charts/StatusPieChart";
import PriorityBarChart from "../components/charts/PriorityBarChart";
import OverdueChart from "../components/charts/OverdueChart";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, isLoading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [view, setView] = useState("list"); // list | kanban
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );

  const notifiedRef = useRef(new Set());

  /* ================= FETCH TASKS ================= */
  useEffect(() => {
    dispatch(getMyTasks());
  }, [dispatch]);

  /* ================= NOTIFICATIONS ================= */
  useEffect(() => {
    list.forEach((task) => {
      if (!task.notification) return;
      if (notifiedRef.current.has(task._id)) return;

      if (task.notification.type === "overdue") {
        toast.error(`⚠️ ${task.title} is overdue`);
      }
      if (task.notification.type === "due-soon") {
        toast.warn(`⏳ ${task.title} is due soon`);
      }

      notifiedRef.current.add(task._id);
    });
  }, [list]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /* ================= PROFILE IMAGE ================= */
  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem("profileImage", reader.result);
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  /* ================= USER STATS (FRONTEND) ================= */
  const statusCount = list.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    { todo: 0, "in-progress": 0, done: 0 }
  );

  const priorityCount = list.reduce(
    (acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    },
    { low: 0, medium: 0, high: 0 }
  );

  const overdueCount = list.filter(
    (t) =>
      t.deadline &&
      new Date(t.deadline) < new Date() &&
      t.status !== "done"
  ).length;

  if (isLoading) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">
          Task Manager
        </h1>

        <button
          onClick={handleLogout}
          className="text-sm bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </nav>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ========== USER PROFILE CARD ========== */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <img
              src={
                profileImage ||
                `https://ui-avatars.com/api/?name=${user?.name}`
              }
              alt="Profile"
              className="w-28 h-28 rounded-full mx-auto mb-4 object-cover border border-gray-700"
            />

            <label className="cursor-pointer text-xs text-indigo-400 hover:underline">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileUpload}
                className="hidden"
              />
            </label>

            <h2 className="mt-4 font-semibold text-lg">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-400">
              {user?.email}
            </p>

            <button
              onClick={() => setOpenTaskModal(true)}
              className="mt-5 w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700"
            >
              + Create Task
            </button>
          </div>

          {/* ========== TASKS SECTION ========== */}
          <div className="lg:col-span-3 space-y-6">

            {/* ===== USER CHARTS ===== */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <StatusPieChart data={statusCount} />
              <PriorityBarChart data={priorityCount} />
              <OverdueChart
                overdue={overdueCount}
                completed={statusCount.done}
              />
            </div>

            {/* ===== HEADER + ACTIONS ===== */}
            <div className="flex flex-wrap justify-between items-center gap-3">
              <h2 className="text-xl font-semibold">
                My Tasks
              </h2>

              <div className="flex gap-2">
                <button
                  onClick={() => setView("list")}
                  className={`px-3 py-1 text-sm rounded ${
                    view === "list"
                      ? "bg-indigo-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  List View
                </button>

                <button
                  onClick={() => setView("kanban")}
                  className={`px-3 py-1 text-sm rounded ${
                    view === "kanban"
                      ? "bg-indigo-600"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  Kanban View
                </button>
              </div>
            </div>

            {/* ===== CONTENT ===== */}
            {view === "list" ? (
              list.length === 0 ? (
                <div className="text-gray-400 text-sm">
                  No tasks yet. Create your first task 🚀
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              )
            ) : (
              <KanbanBoard />
            )}

          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Task Management System — Built with MERN
      </footer>

      {/* ================= MODAL ================= */}
      <CreateTaskModal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
      />
    </div>
  );
}
