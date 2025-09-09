"use client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Allow login and register pages without token
    const publicPaths = ["/login", "/register"];

    if (!token && !publicPaths.includes(pathname)) {
      router.push("/login");
    }

    setChecked(true);
  }, [pathname, router]);

  if (!checked) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return children;
}
