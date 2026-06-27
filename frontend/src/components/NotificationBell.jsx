import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaBell } from "react-icons/fa";
import { socket } from "../socket";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  notificationReceived,
} from "../features/notifications/notificationSlice";
import EmptyState from "./EmptyState";
import { BellOff } from "lucide-react";

const timeAgo = (date) => {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Initial load + live updates over the socket.
  useEffect(() => {
    dispatch(fetchNotifications());

    const handler = (notification) =>
      dispatch(notificationReceived(notification));
    socket.on("notification", handler);

    return () => {
      socket.off("notification", handler);
    };
  }, [dispatch]);

  // Close the panel when clicking outside it.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const handleClickNotification = (n) => {
    if (!n.read) dispatch(markNotificationRead(n._id));
  };

  return (
    <div ref={panelRef} className="fixed top-4 right-4 z-[60]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        className="relative flex items-center justify-center h-10 w-10 rounded-full bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[11px] font-bold rounded-full bg-red-500 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-lg bg-slate-900 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <span className="font-semibold text-white">Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => dispatch(markAllNotificationsRead())}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <EmptyState
            icon={<BellOff className="h-10 w-10" />}
            title="No Notifications"
            description="You're all caught up. New notifications will appear here."
            />
          ) : (
            items.map((notification) => (
              <button
                key={n._id}
                type="button"
                onClick={() => handleClickNotification(n)}
                className={`w-full text-left px-4 py-3 border-b border-slate-800 hover:bg-slate-800 transition ${
                  n.read ? "opacity-60" : "bg-slate-800/40"
                }`}
              >
                <p className="text-sm text-slate-200">{n.message}</p>
                <span className="text-xs text-slate-500">
                  {timeAgo(n.createdAt)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
