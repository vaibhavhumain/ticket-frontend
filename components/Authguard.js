"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // not logged in
    } else {
      setLoading(false); // logged in
    }
  }, [router]);

  if (loading) return <p>Loading...</p>;
  return children;
}
