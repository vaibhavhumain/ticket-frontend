"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("IT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://ticket-backend-1-2je9.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-slate-100 to-slate-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[400px] p-6 shadow-2xl rounded-2xl backdrop-blur-md bg-white/80 border border-slate-200">
          <CardHeader className="text-center space-y-2">
            <div className="text-4xl">📝</div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Create an Account
            </CardTitle>
            <p className="text-sm text-slate-500">
              Fill in your details to register
            </p>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleRegister}
              className="flex flex-col space-y-5"
            >
              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 p-2 rounded-lg">
                  {error}
                </p>
              )}

              {/* Name */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role */}
              <div className="flex flex-col space-y-2">
                <Label htmlFor="role">Department</Label>
                <select
                  id="role"
                  className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Production">Production</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Accounts">Accounts</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full py-2.5 text-base"
                disabled={loading}
              >
                {loading ? "Creating..." : "Register"}
              </Button>

              {/* Login Link */}
              <p className="text-sm text-center text-slate-500">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Login
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
