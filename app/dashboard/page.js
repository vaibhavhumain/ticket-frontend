"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      const timer = setTimeout(() => {
        router.push("/main");
      },2000);

      return () => clearTimeout(timer);
    } else {
      router.push("/login");
    }
  }, [router]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-600">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">
          Welcome, {user.name} 👋
        </h1>
        <p className="text-slate-600">
          You are logged in as <b>{user.role}</b>
        </p>
        <p className="text-sm text-slate-500">Redirecting to main page in 5 seconds...</p>
      </div>
    </main>
  );
}
