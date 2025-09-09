"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/lib/store";

export default function NotificationCenter() {
  const { notifications, fetchNotifications, markAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // 👇 fetch notifications from backend on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="absolute top-4 right-4 z-50">
      {/* Bell button */}
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

      {/* Dropdown notifications */}
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
              <p className="text-sm text-slate-500">No notifications</p>
            )}

            {notifications.map((n) => {
              // 👇 handle case where ticket is populated (object) or just an ID
              const ticketId = typeof n.ticket === "object" ? n.ticket._id : n.ticket;

              return (
                <div
                  key={n._id}
                  onClick={() => {
                    markAsRead(n._id);
                    if (ticketId) {
                      router.push(`/tickets/${ticketId}`);
                    }
                  }}
                  className={`p-2 rounded cursor-pointer ${
                    n.read ? "bg-slate-100" : "bg-blue-50"
                  } hover:bg-blue-100`}
                >
                  <p className="text-sm font-medium">{n.title}</p>
                  {typeof n.ticket === "object" && (
                    <p className="text-xs text-slate-500 mt-0.5">
                      {n.ticket.title}
                    </p>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
