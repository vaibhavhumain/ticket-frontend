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

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Tickets</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Title</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Priority</th>
            <th className="p-2 border">Assigned To</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t._id} className="border">
              <td className="p-2 border">{t.title}</td>
              <td className="p-2 border">{t.status}</td>
              <td className="p-2 border">{t.priority}</td>
              <td className="p-2 border">{t.assignedTo?.name || "Unassigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
