"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // filters
  const [role, setRole] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedAfter, setAssignedAfter] = useState("");
  const [resolvedBefore, setResolvedBefore] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const params = new URLSearchParams();
      if (role) params.append("role", role);
      if (priority) params.append("priority", priority);
      if (assignedAfter) params.append("assignedAfter", assignedAfter);
      if (resolvedBefore) params.append("resolvedBefore", resolvedBefore);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/users?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role, priority, assignedAfter, resolvedBefore]);

  if (loading) return <p className="p-4 text-gray-600">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">👥 Manage Users</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Department Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Department
          </label>
          <div className="flex gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            >
              <option value="">All Departments</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Production">Production</option>
              <option value="Purchase">Purchase</option>
              <option value="Accounts">Accounts</option>
              <option value="admin">Admin</option>
            </select>
            {role && (
              <button
                onClick={() => setRole("")}
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priority
          </label>
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            >
              <option value="">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            {priority && (
              <button
                onClick={() => setPriority("")}
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Assigned After Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assigned After
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={assignedAfter}
              onChange={(e) => setAssignedAfter(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            />
            {assignedAfter && (
              <button
                onClick={() => setAssignedAfter("")}
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Resolved Before Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Resolved Before
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={resolvedBefore}
              onChange={(e) => setResolvedBefore(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300 focus:outline-none"
            />
            {resolvedBefore && (
              <button
                onClick={() => setResolvedBefore("")}
                className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-900 text-white text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Priority</th>
              <th className="p-3 text-center">Tickets Raised</th>
              <th className="p-3 text-center">Tickets Resolved</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, idx) => (
              <tr
                key={u._id}
                className={`border-b ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-blue-50 transition`}
              >
                <td className="p-3 font-medium text-gray-800">{u.name}</td>
                <td className="p-3 text-gray-600">{u.email}</td>
                <td className="p-3 text-gray-700 capitalize">{u.role}</td>
                <td className="p-3 text-gray-700 capitalize">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      (u.priority || "").toLowerCase() === "high"
                        ? "bg-red-100 text-red-700"
                        : (u.priority || "").toLowerCase() === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : (u.priority || "").toLowerCase() === "low"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {u.priority || "N/A"}
                  </span>
                </td>
                <td className="p-3 text-center font-semibold text-blue-600">
                  {u.ticketsRaised || 0}
                </td>
                <td className="p-3 text-center font-semibold text-green-600">
                  {u.ticketsResolved || 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
