"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TicketForm from "@/components/TicketForm";
import { useNotificationStore } from "@/lib/store/useNotificationStore";
import NotificationCenter from "@/components/NotificationCenter";
import Navbar from "@/components/Navbar";
import { PlusCircle, FileText, LogOut } from "lucide-react";

const { reset } = useNotificationStore.getState();

export default function MainPage() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
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
    <div className="min-h-screen bg-slate-100">
      {/* Navbar always on top */}
      <Navbar />

      {/* Notification Center */}
      <div className="absolute top-20 right-6 z-40">
        <NotificationCenter />
      </div>

      {/* Centered content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <AnimatePresence>
          {!loggingOut ? (
            <motion.div
              key="main-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white border border-slate-200 shadow-lg rounded-xl p-10 w-[420px] space-y-8 text-center"
            >
              {/* Header */}
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-slate-800">
                  Ticket Dashboard
                </h1>
                <p className="text-slate-600">
                  Manage, Track & Resolve Queries Easily
                </p>
                {user && (
                  <p className="mt-2 text-slate-700 text-sm">
                    👋 Welcome,{" "}
                    <span className="font-semibold">
                      {user.name || user.email}
                    </span>
                  </p>
                )}
              </div>

              {/* Options */}
              <div className="flex flex-col space-y-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowForm(true)}
                >
                  <PlusCircle className="mr-2 h-5 w-5" /> Raise a Ticket
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
                  onClick={() => router.push("/tickets")}
                >
                  <FileText className="mr-2 h-5 w-5" /> View My Tickets
                </Button>
              </div>

              {/* Logout */}
              <div className="pt-2">
                <Button
                  variant="destructive"
                  className="w-full bg-red-500 hover:bg-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-5 w-5" /> Logout
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
      </main>

      {/* Ticket Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="ticket-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-xl font-bold mb-4 text-slate-800">
                Raise a New Ticket
              </h2>
              <TicketForm onCreated={() => setShowForm(false)} />
              <div className="mt-6 text-right">
                <Button
                  variant="outline"
                  className="hover:bg-slate-100"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
