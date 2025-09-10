"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TicketForm from "@/components/TicketForm";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  }

  const role = user?.role;

  return (
    <>
      <nav className="w-full bg-white shadow-md flex items-center justify-between px-8 py-3 sticky top-0 z-50">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center space-x-2">
          <span className="text-pink-600 text-2xl">🎟️</span>
          <span className="text-lg font-bold text-slate-800">
            Ticket System
          </span>
        </Link>

        {/* Center: Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/dashboard"
            className="text-slate-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/tickets"
            className="text-slate-700 hover:text-blue-600 font-medium"
          >
            Tickets
          </Link>
          {/* 👇 Reports only for admin */}
          {role === "admin" && (
            <Link
              href="/reports"
              className="text-slate-700 hover:text-blue-600 font-medium"
            >
              Reports
            </Link>
          )}
          {/* 👇 Raise ticket only for employee + developer */}
          {(role === "employee" || role === "developer") && (
            <button
              onClick={() => setShowForm(true)}
              
            >
                Raise Ticket
            </button>
          )}
        </div>

        {/* Right: User Dropdown */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative group">
              <button className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 font-medium hover:bg-slate-200">
                {user.name?.split(" ")[0] || user.email}
              </button>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded shadow-lg w-40">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-slate-700 font-medium hover:text-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* 👇 Raise Ticket Modal */}
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
              <TicketForm onCreated={() => setShowForm(false)} />
              <div className="mt-4 text-right">
                <Button variant="outline" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
