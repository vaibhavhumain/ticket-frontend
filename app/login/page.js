"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import loadingAnim from "@/animations/loading.json";
import { useNotificationStore } from "@/lib/store/useNotificationStore";
const { rehydrate } = useNotificationStore.getState();

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    rehydrate();

    try {
      const res = await fetch(
        "https://ticket-backend-1-2je9.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess(true);

      setTimeout(() => {
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <Card className="w-[400px] p-6 shadow-2xl rounded-xl backdrop-blur-md bg-white/80">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-700">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Lottie
                animationData={loadingAnim}
                loop={true}
                className="w-32 h-32"
              />
              <p className="text-slate-600 font-medium">Logging you in...</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col space-y-4">
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-sm text-slate-600 hover:text-slate-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Checking..." : "Login"}
              </Button>

              <p className="text-sm text-center text-slate-500">
                Don’t have an account?{" "}
                <a
                  href="/register"
                  className="text-slate-700 font-medium underline"
                >
                  Register
                </a>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
