import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/axios";
import { logout } from "../features/auth/authSlice";
import { getAllTasks } from "../features/tasks/taskSlice";

import TaskCard from "../components/TaskCard";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: tasks, isLoading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
  });

  /* ================= FETCH STATS ================= */
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/tasks/stats");
        setStats(res.data.data);
      } catch (error) {
        toast.error("Failed to load admin stats");
      }
    };

    fetchStats();
  }, []);

  /* ================= FETCH ALL TASKS ================= */
  useEffect(() => {
    dispatch(getAllTasks());
  }, [dispatch]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-400 flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-400">
          Task Manager — Admin
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

          {/* ========== ADMIN PROFILE CARD ========== */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=4f46e5&color=fff`}
              alt="Admin Avatar"
              className="w-28 h-28 rounded-full mx-auto mb-4 border border-gray-700"
            />

            <h2 className="font-semibold text-lg">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-400">
              {user?.email}
            </p>

            <span className="inline-block mt-3 text-xs bg-indigo-600/20 text-indigo-400 px-3 py-1 rounded-full">
              Administrator
            </span>
          </div>

          {/* ========== CONTENT AREA ========== */}
          <div className="lg:col-span-3 space-y-8">

            {/* STATS CARDS */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Total Tasks" value={stats.total} color="bg-blue-600" />
              <StatCard title="Completed" value={stats.completed} color="bg-green-600" />
              <StatCard title="Pending" value={stats.pending} color="bg-yellow-600" />
              <StatCard title="Overdue" value={stats.overdue} color="bg-red-600" />
            </div>

            {/* TASK LIST */}
            <div>
              <h2 className="text-xl font-semibold mb-4">
                All Tasks
              </h2>

              {tasks.length === 0 ? (
                <p className="text-gray-400 text-sm">
                  No tasks available.
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {tasks.map((task) => (
                    <TaskCard key={task._id} task={task} />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gray-900 border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Task Management System — Admin Panel
      </footer>
    </div>
  );
}

/* ================= STAT CARD ================= */
function StatCard({ title, value, color }) {
  return (
    <div className={`rounded-xl p-5 text-white shadow ${color}`}>
      <h3 className="text-sm opacity-90">{title}</h3>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
