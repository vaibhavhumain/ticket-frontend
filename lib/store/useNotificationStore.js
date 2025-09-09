"use client";

import { create } from "zustand";
import { apiRequest } from "@/lib/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  // fetch from backend
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const data = await apiRequest("/notifications");
      set({ notifications: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // add new notif (socket.io real-time)
  addNotification: (notif) =>
    set((state) => ({
      notifications: [notif, ...state.notifications],
    })),

  // mark one as read
  markAsRead: async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, "PUT");
      set({
        notifications: get().notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
      });
    } catch (err) {
      console.error("❌ Error marking notification:", err.message);
    }
  },

  // mark all as read
  markAllAsRead: async () => {
    try {
      await apiRequest("/notifications/read-all", "PUT");
      set({
        notifications: get().notifications.map((n) => ({ ...n, read: true })),
      });
    } catch (err) {
      console.error("❌ Error marking all as read:", err.message);
    }
  },

  // clear on logout
  reset: () => set({ notifications: [], loading: false, error: null }),

  // delete one
  deleteNotification: async (id) => {
    try {
      await apiRequest(`/notifications/${id}`, "DELETE");
      set({
        notifications: get().notifications.filter((n) => n._id !== id),
      });
    } catch (err) {
      console.error("❌ Error deleting notification:", err.message);
    }
  },

  // clear all
  clearAll: async () => {
    try {
      await apiRequest("/notifications", "DELETE");
      set({ notifications: [] });
    } catch (err) {
      console.error("❌ Error clearing notifications:", err.message);
    }
  },

  // 🆕 rehydrate (after login)
  rehydrate: async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) return;

    try {
      const data = await apiRequest("/notifications");
      set({ notifications: data, loading: false, error: null });
    } catch (err) {
      console.error("❌ Error rehydrating notifications:", err.message);
    }
  },
}));
