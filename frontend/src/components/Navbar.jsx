import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaBell, FaTimes, FaSignOutAlt, FaCheckDouble, FaCircle } from "react-icons/fa";
import { logout } from "../features/auth/authSlice";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  dismissNotification,
} from "../features/notifications/notificationSlice";
import TaskDetailModal from "./TaskCardDetails";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user } = useSelector((s) => s.auth);
  const { list: notifications } = useSelector((s) => s.notifications);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const isAdmin = user?.role === "admin";
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    if (user) {
      dispatch(getNotifications());
    }
  }, [dispatch, user]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      dispatch(markNotificationAsRead(notif._id));
    }
    if (notif.task && notif.task._id) {
      setSelectedTaskId(notif.task._id);
    }
    setIsOpen(false);
  };

  const handleDismiss = (e, notifId) => {
    e.stopPropagation();
    dispatch(dismissNotification(notifId));
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <>
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center relative z-40">
        <h1
          className="text-xl font-bold text-indigo-400 cursor-pointer select-none"
          onClick={() => navigate(isAdmin ? "/admin/dashboard" : "/dashboard")}
        >
          {isAdmin ? "Task Manager — Admin" : "Task Manager"}
        </h1>

        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition focus:outline-none"
              title="Notifications"
            >
              <FaBell className="text-xl" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
                  <h3 className="font-semibold text-sm text-gray-200">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllNotificationsAsRead())}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition"
                    >
                      <FaCheckDouble className="text-[10px]" />
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 bg-gray-900">
                      No notifications yet 🔔
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-4 flex gap-3 cursor-pointer hover:bg-gray-800/60 transition group relative ${
                          !n.isRead ? "bg-indigo-950/20" : ""
                        }`}
                      >
                        {/* Status/Unread Indicator */}
                        <div className="mt-1 flex-shrink-0">
                          {!n.isRead ? (
                            <FaCircle className="text-xs text-indigo-500 mt-1 animate-pulse" />
                          ) : (
                            <FaCircle className="text-xs text-gray-700 mt-1" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pr-6">
                          <p className="text-xs text-gray-400 font-semibold mb-0.5">
                            {n.sender?.name || "System"}
                          </p>
                          <p className="text-sm text-gray-200 leading-snug">
                            {n.message}
                          </p>
                          <span className="text-[10px] text-gray-500 block mt-1">
                            {formatTime(n.createdAt)}
                          </span>
                        </div>

                        {/* Dismiss Action */}
                        <button
                          onClick={(e) => handleDismiss(e, n._id)}
                          className="absolute right-3 top-4 text-gray-500 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition duration-150"
                          title="Dismiss notification"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Info / Avatar */}
          <div className="hidden sm:flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${user?.name}&background=4f46e5&color=fff`}
              alt="Avatar"
              className="w-8 h-8 rounded-full border border-gray-700"
            />
            <span className="text-sm font-medium text-gray-300">{user?.name}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm bg-red-900/30 text-red-400 border border-red-900/50 px-3.5 py-1.5 rounded-lg hover:bg-red-900 hover:text-white transition font-medium focus:outline-none"
          >
            <FaSignOutAlt className="text-xs" />
            Logout
          </button>
        </div>
      </nav>

      {/* Task Details Modal from Notification click */}
      {selectedTaskId && (
        <TaskDetailModal
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </>
  );
}
