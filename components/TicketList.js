"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const data = await apiRequest("/tickets");
        setTickets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600">Loading tickets...</span>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  if (tickets.length === 0)
    return (
      <div className="text-center text-gray-500 p-6 border rounded bg-white shadow">
        No tickets found.
      </div>
    );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((t) => (
        <div
          key={t._id}
          className="p-5 border rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-lg text-slate-800 truncate">
              {t.title}
            </h3>
            <Badge
              variant={
                t.priority === "high"
                  ? "destructive"
                  : t.priority === "medium"
                  ? "default"
                  : "secondary"
              }
            >
              {t.priority}
            </Badge>
          </div>

          {/* Description */}
          <p className="text-slate-600 text-sm line-clamp-3 mb-3">
            {t.description}
          </p>

          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              Status:{" "}
              <span
                className={`font-medium ${
                  t.status === "open"
                    ? "text-green-600"
                    : t.status === "closed"
                    ? "text-red-600"
                    : "text-yellow-600"
                }`}
              >
                {t.status}
              </span>
            </span>
            <span>
              {t.createdAt
                ? new Date(t.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : ""}
            </span>
          </div>
          {t.createdBy && (
            <p className="mt-2 text-xs text-gray-600">
              Raised by:{" "}
              <span className="font-medium text-slate-800">
                {t.createdBy.name || t.createdBy.email}
              </span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
