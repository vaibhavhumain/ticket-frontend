"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const navItems = [
    { href: "/admin/tickets", label: "🎫 Tickets" },
    { href: "/admin/users", label: "👤 Users" },
    { href: "/admin/reports", label: "📊 Reports" },
  ];

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between bg-white shadow px-4 h-16 relative z-50">
        <Navbar />
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden text-gray-700 p-2 rounded-md hover:bg-gray-200"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-16 lg:top-0 left-0 
          h-[calc(100%-4rem)] lg:h-full w-64 bg-gray-900 text-white flex flex-col 
          transform transition-transform duration-300 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <h2 className="text-2xl font-bold p-6 border-b border-gray-700 text-center">
            Admin Panel
          </h2>
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block p-3 rounded-md transition ${
                  pathname === href
                    ? "bg-gray-700 text-white font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="m-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-md shadow-md transition"
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto rounded-lg shadow-inner">
          {children}
        </main>
      </div>
    </div>
  );
}
