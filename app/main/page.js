"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function MainPage() {
  const router = useRouter();

  const handleLogout = () => {

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/logout");
    },); 
  };


  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <div className="backdrop-blur-md bg-white/70 border border-slate-200 shadow-2xl rounded-2xl p-10 w-[420px] space-y-8 relative overflow-hidden">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-800">🎟 Ticket System</h1>
          <p className="text-slate-600">Manage, Track & Resolve Queries Easily</p>
        </div>

        {/* Options */}
        <div className="flex flex-col space-y-4">
          <Button className="w-full" onClick={() => router.push("/tickets/create")}>
            ➕ Raise a Ticket
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/tickets")}
          >
            📋 View My Tickets
          </Button>
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => router.push("/tickets/all")}
          >
            🗂 All Tickets (Admin/Dev)
          </Button>
        </div>

        {/* Logout */}
        <div className="pt-4">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            🚪 Logout
          </Button>
        </div>
      </div>
    </main>
  );
}
