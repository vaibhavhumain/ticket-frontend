"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useNotificationStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function TicketForm({ onCreated }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    category: "general",
    assignedTo: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);

  const currentUser = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : {};

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await apiRequest("/users", "GET");
        const filtered = data.filter((u) => u._id !== currentUser._id);
        setUsers(filtered);
      } catch (err) {
        console.error("❌ Error fetching users:", err.message);
      }
    }
    fetchUsers();
  }, [currentUser._id]);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const ticket = await apiRequest("/tickets", "POST", form);

      toast.success("🎉 Ticket Created", {
        description: `Ticket "${ticket.title}" was raised successfully!`,
      });

      if (onCreated) onCreated(ticket);
      await fetchNotifications();

      setForm({
        title: "",
        description: "",
        priority: "medium",
        category: "general",
        assignedTo: "",
      });

      router.push("/main");
    } catch (err) {
      setError(err.message);
      toast.error("Failed to create ticket", {
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-slate-200 max-w-lg mx-auto"
    >
      <h2 className="font-bold text-2xl text-slate-800 text-center">
        Raise a Ticket
      </h2>

      {error && (
        <p className="text-red-500 text-sm bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </p>
      )}

      {/* Title */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="title" className="text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          placeholder="Enter ticket title"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="description" className="text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe the issue"
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm h-24 resize-none"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Priority */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="priority" className="text-sm font-medium text-slate-700">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Assigned To */}
      <div className="flex flex-col space-y-1">
        <label htmlFor="assignedTo" className="text-sm font-medium text-slate-700">
          Assign To
        </label>
        <select
          id="assignedTo"
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
        >
          <option value="">-- Select a User --</option>
          {users.map((user) => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.role})
            </option>
          ))}
        </select>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2.5 rounded-lg font-medium text-white transition ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit Ticket"}
      </button>
    </form>
  );
}
