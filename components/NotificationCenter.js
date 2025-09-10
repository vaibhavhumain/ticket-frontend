"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/lib/store/useNotificationStore";
import { io } from "socket.io-client";

let socket;

export default function NotificationCenter() {
  const {
    notifications,
    fetchNotifications,
    markAsRead,
    addNotification,
  } = useNotificationStore();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) return; // not logged in → skip

    fetchNotifications();

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
    });

    const user = JSON.parse(storedUser);
    if (user?._id) {
      socket.emit("join", user._id);
    }

    socket.on("notification", (notif) => {
      console.log("📩 New notification:", notif);
      addNotification(notif);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [fetchNotifications, addNotification]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute top-4 right-4 z-50">
      {/* Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 bg-white rounded-full shadow hover:bg-slate-100"
      >
        <Bell className="h-6 w-6 text-slate-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-4 max-h-96 overflow-y-auto space-y-2"
          >
            {notifications.length === 0 && (
              <p className="text-sm text-center text-slate-500 py-4">
                🎉 You’re all caught up!
              </p>
            )}

            {notifications.map((n) => {
              const ticketId =
                typeof n.ticket === "object" ? n.ticket._id : n.ticket;

              return (
                <div
                  key={n._id}
                  onClick={() => {
                    markAsRead(n._id);
                    if (ticketId) {
                      router.push(`/tickets/${ticketId}`);
                      setOpen(false);
                    }
                  }}
                  className={`p-2 rounded cursor-pointer ${
                    n.read ? "bg-slate-100" : "bg-blue-50"
                  } hover:bg-blue-100 transition`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  {typeof n.ticket === "object" && (
                    <p className="text-xs text-slate-500">{n.ticket.title}</p>
                  )}
                  <span className="block text-xs text-gray-400 mt-0.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
