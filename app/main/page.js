"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TicketForm from "@/components/TicketForm"; 
import { useNotificationStore } from "@/lib/store/useNotificationStore";
const { reset } = useNotificationStore.getState();

export default function MainPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showForm, setShowForm] = useState(false); // 👈 modal state
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("❌ Failed to parse user from localStorage:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    setLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      reset();
      router.push("/logout");
    }, 1500);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <AnimatePresence>
        {!loggingOut ? (
          <motion.div
            key="main-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="backdrop-blur-md bg-white/70 border border-slate-200 shadow-2xl rounded-2xl p-10 w-[420px] space-y-8 relative overflow-hidden"
          >
            {/* Header */}
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-extrabold text-slate-800">
                🎟 Ticket System
              </h1>
              <p className="text-slate-600">
                Manage, Track & Resolve Queries Easily
              </p>
              {user && (
                <p className="mt-2 text-slate-700 font-medium">
                  👋 Welcome, <span className="font-bold">{user.name || user.email}</span>
                </p>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-col space-y-4">
              <Button
                className="w-full"
                onClick={() => setShowForm(true)} // 👈 open modal
              >
                ➕ Raise a Ticket
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/tickets")}
              >
                📋 View My Tickets
              </Button>
            </div>

            {/* Logout */}
            <div className="pt-4">
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                🚪 Logout
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="logging-out"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-slate-700 text-lg"
          >
            🚪 Logging out...
          </motion.div>
        )}
      </AnimatePresence>

      {/* 👇 Popup Modal for Ticket Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="ticket-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4">Raise a New Ticket</h2>
              <TicketForm
                onCreated={() => {
                  setShowForm(false); // close modal after submit
                }}
              />
              <div className="mt-4 text-right">
                <Button
                  variant="outline"
                  onClick={() => setShowForm(false)} // close modal
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
