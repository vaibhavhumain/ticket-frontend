"use client";
import { useEffect, useState } from "react";
import { BarChart3, CheckCircle, AlertTriangle, Layers } from "lucide-react";

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

  if (!stats) return <p className="p-6 text-gray-600">Loading reports...</p>;

  const cards = [
    {
      title: "Total Tickets",
      value: stats.totalTickets,
      color: "bg-blue-100 text-blue-700",
      icon: <Layers className="w-6 h-6" />,
    },
    {
      title: "Open",
      value: stats.open,
      color: "bg-red-100 text-red-600",
      icon: <AlertTriangle className="w-6 h-6" />,
    },
    {
      title: "Resolved",
      value: stats.resolved,
      color: "bg-green-100 text-green-600",
      icon: <CheckCircle className="w-6 h-6" />,
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Reports & Analytics
      </h1>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition flex items-center justify-between"
          >
            <div>
              <h2 className="text-gray-600 font-medium">{c.title}</h2>
              <p className={`text-3xl font-bold mt-2 ${c.color}`}>{c.value}</p>
            </div>
            <div
              className={`p-3 rounded-full ${c.color.replace(
                "text",
                "bg"
              )} bg-opacity-30`}
            >
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Priority Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Tickets by Priority
        </h2>
        <div className="flex gap-4">
          <div className="flex-1 bg-red-50 p-4 rounded text-center">
            <p className="text-sm text-gray-600">High</p>
            <p className="text-xl font-bold text-red-600">{stats.high}</p>
          </div>
          <div className="flex-1 bg-yellow-50 p-4 rounded text-center">
            <p className="text-sm text-gray-600">Medium</p>
            <p className="text-xl font-bold text-yellow-600">{stats.medium}</p>
          </div>
          <div className="flex-1 bg-green-50 p-4 rounded text-center">
            <p className="text-sm text-gray-600">Low</p>
            <p className="text-xl font-bold text-green-600">{stats.low}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
