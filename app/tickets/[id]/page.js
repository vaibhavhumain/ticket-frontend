"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import io from "socket.io-client";

let socket;

export default function TicketDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newStatus, setNewStatus] = useState("");

  const cardClass =
    "rounded-xl bg-white shadow-lg border border-gray-100 p-6 space-y-4";

  // Fetch ticket initially
  useEffect(() => {
    async function fetchTicket() {
      try {
        const data = await apiRequest(`/tickets/${id}`, "GET");
        setTicket(data);
        setNewStatus(data.status);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTicket();
  }, [id]);

  // Setup socket.io for real-time updates
  useEffect(() => {
    if (!id) return;

    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("ticketUpdated", (updatedTicket) => {
      if (updatedTicket._id === id) {
        setTicket(updatedTicket);
        setNewStatus(updatedTicket.status);
      }
    });

    socket.on("ticketDeleted", ({ id: deletedId }) => {
      if (deletedId === id) {
        alert("This ticket was deleted.");
        router.push("/dashboard");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id, router]);

  async function handleAddComment() {
    if (!newComment && !newStatus) return;
    try {
      const updated = await apiRequest(`/tickets/${id}/comments`, "POST", {
        text: newComment,
        status: newStatus,
      });
      setTicket(updated);
      setNewComment("");
    } catch (err) {
      alert(err.message);
    }
  }

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
    <main className="p-6 max-w-3xl mx-auto space-y-8 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </button>
      </div>

      {/* Ticket Info */}
      <div className={cardClass}>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold text-slate-800">
            {ticket.title}
          </h1>
          <Badge
            variant={
              ticket.priority === "high"
                ? "destructive"
                : ticket.priority === "medium"
                ? "default"
                : "secondary"
            }
            className="capitalize px-3 py-1 text-sm"
          >
            {ticket.priority}
          </Badge>
        </div>

        <p className="text-slate-600">{ticket.description}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="capitalize">{ticket.status}</span>
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
            {ticket.assignedTo?.name ||
              ticket.assignedTo?.email ||
              "Unassigned"}
          </p>
        </div>
      </div>

      {/* Update Ticket */}
      <div className={cardClass}>
        <h2 className="font-semibold text-lg text-slate-700">Update Ticket</h2>

        <div className="grid gap-4">
          {/* Status Dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Change Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Comment Box */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Optional Comment
            </label>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add details about this update..."
              className="resize-none min-h-[80px]"
            />
          </div>
        </div>

        <Button onClick={handleAddComment} className="w-full">
          Save Update
        </Button>
      </div>

      {/* Comments */}
      <div className={cardClass}>
        <h2 className="font-semibold text-lg text-slate-700">Comments</h2>
        {ticket.comments?.length > 0 ? (
          <ul className="space-y-3">
            {ticket.comments.map((c, i) => (
              <li
                key={i}
                className="border rounded-md bg-gray-50 p-3 text-sm space-y-1"
              >
                <p className="text-gray-800">{c.text}</p>
                <span className="block text-xs text-gray-500">
                  by {c.addedBy?.name || c.addedBy?.email || "User"} on{" "}
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No comments yet.</p>
        )}
      </div>
    </main>
  );
}
