import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { getMyTasks } from "../features/tasks/taskSlice";
import { logout, setProfilePicture } from "../features/auth/authSlice";
import { exportMyTasksCSVAPI } from "../features/tasks/taskService";
import { updateProfilePictureAPI } from "../features/auth/authService";
import { uploadToCloudinary } from "../utils/cloudinary";

import Avatar from "../components/Avatar";

import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import Navbar from "../components/Navbar";
import KanbanBoard from "./KanbanBoard";

// Charts
import StatusPieChart from "../components/charts/StatusPieChart";
import PriorityBarChart from "../components/charts/PriorityBarChart";
import OverdueChart from "../components/charts/OverdueChart";
import EmptyState from "../components/EmptyState";
import { ClipboardList } from "lucide-react";

export default function UserDashboard() {
  const dispatch = useDispatch();

  const { list, isLoading } = useSelector((s) => s.tasks);
  const { user } = useSelector((s) => s.auth);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [view, setView] = useState("list"); // list | kanban
  const [isExporting, setIsExporting] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  /* ================= PROFILE IMAGE ================= */
  const handleProfileUpload = (e) => {
  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  /* ================= EXPORT CSV ================= */
  const handleExportCsv = async () => {
    try {
      setIsExporting(true);

      const response = await exportMyTasksCSVAPI();
      const blob = new Blob([response.data], {
        type: response.headers["content-type"] || "text/csv;charset=utf-8;",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tasks_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Tasks exported as CSV");
    } catch {
      toast.error("Failed to export tasks");
    } finally {
      setIsExporting(false);
    }
  };

  /* ================= PROFILE PICTURE ================= */
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      await updateProfilePictureAPI(url);
      dispatch(setProfilePicture(url));
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err.message || "Failed to update picture");
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploading(true);
      await updateProfilePictureAPI("");
      dispatch(setProfilePicture(""));
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error(err.message || "Failed to remove picture");
    } finally {
      setUploading(false);
    }
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
      <Navbar />

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ========== USER PROFILE CARD ========== */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
            <Avatar
              src={user?.profilePicture}
              name={user?.name}
              size={112}
              className="mx-auto mb-4 border border-gray-700"
            />

            <div className="flex items-center justify-center gap-3">
              <label
                className={`cursor-pointer text-xs text-indigo-400 hover:underline ${
                  uploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {uploading
                  ? "Uploading..."
                  : user?.profilePicture
                  ? "Change Photo"
                  : "Upload Photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {user?.profilePicture && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={uploading}
                  className="text-xs text-red-400 hover:underline disabled:opacity-50"
                >
                  Remove
                </button>
              )}
            </div>

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

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportCsv}
                  disabled={isExporting}
                  className="px-3 py-1 text-sm rounded bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isExporting ? "Exporting..." : "Export CSV"}
                </button>

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
                <EmptyState
                icon={<ClipboardList className="h-12 w-12" />}
                title="No Tasks Yet"
                description="Create your first task to organize your work efficiently."
                />
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
