"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoutPage() {
  const router = useRouter();
  const animal = "/animals/dog.gif"; 

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-r from-slate-100 to-slate-200 relative overflow-hidden">
      <motion.img
        src={animal}
        alt="Walking dog"
        initial={{ x: "-100%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 3, ease: "linear" }}
        className="absolute bottom-10 w-32"
      />

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-slate-800">Logging you out...</h1>
        <p className="text-slate-600">The dog is walking you out 🐾</p>
      </div>
    </main>
  );
}
