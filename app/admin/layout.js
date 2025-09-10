    "use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
export default function AdminLayout({ children }) {
  const router = useRouter();

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

  return (
    <div>
        <Navbar/>
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-700">
          Admin Panel
        </h2>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/tickets" className="block hover:bg-gray-700 p-2 rounded">
            Tickets
          </Link>
          <Link href="/admin/users" className="block hover:bg-gray-700 p-2 rounded">
            Users
          </Link>
          <Link href="/admin/reports" className="block hover:bg-gray-700 p-2 rounded">
            Reports
          </Link>
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
    </div>
  );
}
