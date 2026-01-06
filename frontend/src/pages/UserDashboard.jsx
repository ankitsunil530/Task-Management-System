import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMyTasks } from "../features/tasks/taskSlice";
import { logout } from "../features/auth/authSlice";

import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list, isLoading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage")
  );

  const notifiedRef = useRef(new Set());

  useEffect(() => {
    dispatch(getMyTasks());
  }, [dispatch]);

  // 🔔 Notifications (once)
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

  // 🚪 Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // 🖼 Profile Image Upload (local for now)
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

          {/* ========== PROFILE CARD ========== */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <img
              src={
                profileImage ||
                "https://ui-avatars.com/api/?name=" + user?.name
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
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold mb-4">
              My Tasks
            </h2>

            {list.length === 0 ? (
              <div className="text-gray-400 text-sm">
                No tasks yet. Create your first task 🚀
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {list.map((task) => (
                  <TaskCard key={task._id} task={task} />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Task Management System — Built with MERN
      </footer>

      {/* MODAL */}
      <CreateTaskModal
        open={openTaskModal}
        onClose={() => setOpenTaskModal(false)}
      />
    </div>
  );
}
