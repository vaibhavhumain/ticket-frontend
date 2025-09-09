"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge"; // if you added shadcn badge
import { Loader2, ArrowLeft } from "lucide-react";

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTicket() {
      try {
        const data = await apiRequest(`/tickets/${id}`, "GET");
        setTicket(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTicket();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600">Loading ticket...</span>
      </div>
    );

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  if (!ticket) return <p className="p-6">No ticket found.</p>;

  return (
    <main className="p-6 max-w-2xl mx-auto">
      {/* Header with back button */}
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
      </div>

      {/* Ticket card */}
      <div className="border rounded-xl bg-white shadow-md p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800">{ticket.title}</h1>
          <Badge
            variant={
              ticket.priority === "high"
                ? "destructive"
                : ticket.priority === "medium"
                ? "default"
                : "secondary"
            }
          >
            {ticket.priority}
          </Badge>
        </div>

        <p className="text-slate-600">{ticket.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span
              className={`${
                ticket.status === "open"
                  ? "text-green-600 font-medium"
                  : ticket.status === "closed"
                  ? "text-red-600 font-medium"
                  : "text-yellow-600 font-medium"
              }`}
            >
              {ticket.status}
            </span>
          </p>
          <p>
            <span className="font-semibold">Category:</span> {ticket.category}
          </p>
          <p>
            <span className="font-semibold">Raised by:</span>{" "}
            {ticket.createdBy?.name || ticket.createdBy?.email || "Unknown"}
          </p>
          <p>
            <span className="font-semibold">Assigned to:</span>{" "}
            {ticket.assignedTo?.name || ticket.assignedTo?.email || "Unassigned"}
          </p>
        </div>

        <div className="text-xs text-gray-500">
          Created:{" "}
          {ticket.createdAt
            ? new Date(ticket.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "N/A"}
        </div>
      </div>
    </main>
  );
}
