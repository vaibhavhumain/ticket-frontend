"use client";

import { useSearchParams } from "next/navigation";
import TicketForm from "@/components/TicketForm";
import TicketList from "@/components/TicketList";

export default function TicketsPage() {
  const params = useSearchParams();
  const showForm = params.get("new") === "true";

  return (
    <div className="p-8 space-y-6">
      {showForm && <TicketForm onCreated={() => window.location.href = "/main"} />}
      <TicketList />
    </div>
  );
}
