"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Loader2, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import io from "socket.io-client";
import Navbar from "@/components/Navbar";

let socket;

export default function TicketList() {
  const [tickets, setTickets] = useState({ raisedByMe: [], assignedToMe: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch tickets initially
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

  // Connect to Socket.IO
  useEffect(() => {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("🟢 Connected to socket:", socket.id);
    });

    socket.on("ticketCreated", (newTicket) => {
      setTickets((prev) => {
        if (newTicket.createdBy?._id === getUserId()) {
          return { ...prev, raisedByMe: [newTicket, ...prev.raisedByMe] };
        }
        if (newTicket.assignedTo?._id === getUserId()) {
          return { ...prev, assignedToMe: [newTicket, ...prev.assignedToMe] };
        }
        return prev;
      });
    });

    socket.on("ticketUpdated", (updatedTicket) => {
      setTickets((prev) => {
        const updateList = (list) =>
          list.map((t) => (t._id === updatedTicket._id ? updatedTicket : t));
        return {
          raisedByMe: updateList(prev.raisedByMe),
          assignedToMe: updateList(prev.assignedToMe),
        };
      });
    });

    socket.on("ticketDeleted", ({ id }) => {
      setTickets((prev) => ({
        raisedByMe: prev.raisedByMe.filter((t) => t._id !== id),
        assignedToMe: prev.assignedToMe.filter((t) => t._id !== id),
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (loading)
    return (
      <div>
        <div className="flex justify-center items-center h-40 text-blue-600">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2 font-medium">Loading tickets...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div>
        <Navbar hideTickets />
        <p className="text-red-500 text-center mt-6">{error}</p>
      </div>
    );
  const { raisedByMe = [], assignedToMe = [] } = tickets;

  // ✅ Filter tickets
  const applyFilters = (list) =>
    list.filter((t) => {
      const priorityMatch =
        priorityFilter === "all" || t.priority === priorityFilter;
      const statusMatch = statusFilter === "all" || t.status === statusFilter;
      return priorityMatch && statusMatch;
    });
    

  return (
    <div className="bg-slate-50 min-h-screen">
      <Navbar hideTickets />

      {/* Filter Bar */}
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap gap-6 items-center">
          <div>
            <label className="text-sm font-medium text-slate-600 mr-2">
              Priority:
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-600 mr-2">
              Status:
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-10">
        <TicketSection
          title="📌 Tickets Raised By Me"
          list={applyFilters(raisedByMe)}
        />
        <TicketSection
          title="📝 Tickets Assigned To Me"
          list={applyFilters(assignedToMe)}
        />
      </div>
    </div>
  );
}

// Helper: get logged-in user id from localStorage
function getUserId() {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?._id || user?.id || null;
  }
  return null;
}

function TicketSection({ title, list }) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
        <div className="h-[1px] flex-1 bg-slate-200 ml-4" />
      </div>
      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-white rounded-lg shadow-sm">
          <Inbox className="h-10 w-10 mb-2 opacity-50" />
          <p className="text-sm">No tickets here.</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((t) => (
            <TicketCard key={t._id} ticket={t} />
          ))}
        </div>
      )}
    </section>
  );
}

function TicketCard({ ticket: t }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/tickets/${t._id}`)}
      className="p-5 border rounded-xl bg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-base text-slate-800 leading-tight line-clamp-1">
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
          className="capitalize"
        >
          {t.priority}
        </Badge>
      </div>

      {/* Description */}
      <p className="text-slate-600 text-sm line-clamp-3 mb-4">
        {t.description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <span>
          Status:{" "}
          <span
            className={`font-medium capitalize ${
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
        <p className="mt-2 text-xs text-slate-500">
          Raised by{" "}
          <span className="font-medium text-slate-700">
            {t.createdBy.name || t.createdBy.email}
          </span>
        </p>
      )}
    </div>
  );
}
