"use client";
import { useEffect, useState } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTickets)
      .catch(console.error);
  }, []);

  // Helper for status badges
  const statusBadge = (status) => {
    const colors = {
      open: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-200 text-gray-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          colors[status] || "bg-gray-100 text-gray-600"
        }`}
      >
        {status}
      </span>
    );
  };

  // Helper for priority badges
  const priorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-700",
      medium: "bg-orange-100 text-orange-700",
      low: "bg-green-100 text-green-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
          colors[priority] || "bg-gray-100 text-gray-600"
        }`}
      >
        {priority}
      </span>
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">All Tickets</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white text-left">
              <th className="p-3">Title</th>
              <th className="p-3">Status</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, idx) => (
              <tr
                key={t._id}
                className={`border-b ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{t.title}</td>
                <td className="p-3">{statusBadge(t.status)}</td>
                <td className="p-3">{priorityBadge(t.priority)}</td>
                <td className="p-3 text-gray-700">
                  {t.assignedTo?.name || (
                    <span className="italic text-gray-400">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
