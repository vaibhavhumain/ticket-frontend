"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState(5);

  // 🎨 role-based background gradients
  const roleColors = {
    HR: "from-pink-500 via-rose-500 to-red-400",
    IT: "from-indigo-600 via-blue-600 to-cyan-500",
    Sales: "from-orange-500 via-amber-500 to-yellow-400",
    Marketing: "from-fuchsia-500 via-pink-500 to-rose-400",
    Production: "from-emerald-600 via-green-500 to-teal-400",
    Purchase: "from-cyan-500 via-teal-500 to-emerald-400",
    Accounts: "from-slate-600 via-gray-600 to-zinc-500",
    admin: "from-purple-700 via-indigo-700 to-blue-600",
    default: "from-slate-800 via-slate-700 to-slate-600",
  };

  // 🎨 role-based progress bar colors
  const roleProgressColors = {
    HR: "bg-rose-400",
    IT: "bg-blue-400",
    Sales: "bg-amber-400",
    Marketing: "bg-pink-400",
    Production: "bg-green-400",
    Purchase: "bg-teal-400",
    Accounts: "bg-gray-400",
    admin: "bg-purple-500",
    default: "bg-green-400",
  };

  // 📌 role-based icons
  const roleIcons = {
    HR: "👥",
    IT: "🛠",
    Sales: "📊",
    Marketing: "🎯",
    Production: "🏭",
    Purchase: "🛒",
    Accounts: "📑",
    admin: "👑",
    default: "👤",
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      const interval = setInterval(() => {
        setCountdown((prev) => (prev > 1 ? prev - 1 : prev));
      }, 1000);

      const timer = setTimeout(() => {
        router.push("/main");
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <p className="text-slate-200 text-lg animate-pulse">Loading...</p>
      </main>
    );
  }

  // Pick styles/icons based on role
  const gradient =
    roleColors[user.role] || roleColors.default;
  const progressColor =
    roleProgressColors[user.role] || roleProgressColors.default;
  const roleIcon = roleIcons[user.role] || roleIcons.default;

  return (
    <main
      className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br ${gradient} p-4`}
    >
      {/* Welcome card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/20 border border-white/30 p-10 rounded-2xl shadow-2xl text-center space-y-6 max-w-md w-full"
      >
        <h1 className="text-3xl font-extrabold text-white drop-shadow-md flex items-center justify-center gap-2">
          {roleIcon} Welcome, {user.name} 👋
        </h1>
        <p className="text-white/80 text-lg">
          You are logged in as <b>{user.role}</b>
        </p>

        {/* Progress bar */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(5 - countdown + 1) * 20}%` }}
            transition={{ ease: "linear", duration: 1 }}
            className={`h-2 ${progressColor}`}
          />
        </div>

        <p className="text-sm text-white/70">
          Redirecting to main page in {countdown} seconds...
        </p>
      </motion.div>
    </main>
  );
}
