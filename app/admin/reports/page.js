"use client";
import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/reports`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setStats)
      .catch(console.error);
  }, []);

  if (!stats) return <p>Loading reports...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Reports & Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold">Total Tickets</h2>
          <p className="text-2xl">{stats.totalTickets}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold">Open</h2>
          <p className="text-2xl text-red-500">{stats.open}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="font-semibold">Resolved</h2>
          <p className="text-2xl text-green-600">{stats.resolved}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold">Tickets by Priority</h2>
        <ul className="list-disc ml-6 mt-2">
          <li>High: {stats.high}</li>
          <li>Medium: {stats.medium}</li>
          <li>Low: {stats.low}</li>
        </ul>
      </div>
    </div>
  );
}
