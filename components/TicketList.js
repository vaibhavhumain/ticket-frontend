"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import io from "socket.io-client";

let socket;

export default function TicketList() {
  const [tickets, setTickets] = useState({ raisedByMe: [], assignedToMe: [] });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

    // When new ticket created
    socket.on("ticketCreated", (newTicket) => {
      setTickets((prev) => {
        // If raised by me
        if (newTicket.createdBy?._id === getUserId()) {
          return {
            ...prev,
            raisedByMe: [newTicket, ...prev.raisedByMe],
          };
        }
        // If assigned to me
        if (newTicket.assignedTo?._id === getUserId()) {
          return {
            ...prev,
            assignedToMe: [newTicket, ...prev.assignedToMe],
          };
        }
        return prev;
      });
    });

    // When ticket updated
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

    // When ticket deleted
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
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <span className="ml-2 text-blue-600">Loading tickets...</span>
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  const { raisedByMe = [], assignedToMe = [] } = tickets;

  if (raisedByMe.length === 0 && assignedToMe.length === 0)
    return (
      <div className="text-center text-gray-500 p-6 border rounded bg-white shadow">
        No tickets found.
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Raised by me */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3">
          📌 Tickets Raised By Me
        </h2>
        {raisedByMe.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets raised.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {raisedByMe.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        )}
      </section>

      {/* Assigned to me */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-3">
          📝 Tickets Assigned To Me
        </h2>
        {assignedToMe.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets assigned.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignedToMe.map((t) => (
              <TicketCard key={t._id} ticket={t} />
            ))}
          </div>
        )}
      </section>
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

function TicketCard({ ticket: t }) {
  return (
    <div className="p-5 border rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-lg text-slate-800 truncate">{t.title}</h3>
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
      <p className="text-slate-600 text-sm line-clamp-3 mb-3">{t.description}</p>

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
  );
}
