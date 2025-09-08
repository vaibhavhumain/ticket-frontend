"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnim from "@/animations/loading.json"; 

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [funnyTrigger, setFunnyTrigger] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://ticket-backend-cbgp.onrender.com/api/auth/login",
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

      // ✅ Show loading animation for 2 seconds then redirect
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message);
      setFunnyTrigger((prev) => prev + 1); // trigger funny animation
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      <motion.div
        key={funnyTrigger}
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-[400px] p-6 shadow-2xl rounded-xl backdrop-blur-md bg-white/80">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-700">
              Login
            </CardTitle>

            {/* Funny Animal Emoji when error */}
            {error && (
              <motion.div
                key={funnyTrigger}
                initial={{ y: -10 }}
                animate={{ y: [0, -10, 0, -10, 0] }}
                transition={{ duration: 0.6, repeat: 2 }}
                className="text-6xl mt-2"
              >
                🐵
              </motion.div>
            )}
          </CardHeader>

          <CardContent>
            {success ? (
              // ✅ Success loading animation
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Lottie animationData={loadingAnim} loop={true} className="w-32 h-32" />
                <p className="text-slate-600 font-medium">Logging you in...</p>
              </div>
            ) : (
              <form onSubmit={handleLogin} className="flex flex-col space-y-4">
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

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

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full"
                >
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Checking..." : "Login"}
                  </Button>
                </motion.div>

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
      </motion.div>
    </main>
  );
}
