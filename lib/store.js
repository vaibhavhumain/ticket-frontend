import { create } from "zustand";
import { apiRequest } from "./api"; 

export const useNotificationStore = create((set) => ({
  notifications: [],

  fetchNotifications: async () => {
    try {
      const data = await apiRequest("/notifications", "GET");
      set({ notifications: data });
    } catch (err) {
      console.error("❌ Error fetching notifications:", err.message);
    }
  },

  markAsRead: async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, "PUT");
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (err) {
      console.error("❌ Error marking notification as read:", err.message);
    }
  },
}));
