import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import AuthGuard from "@/components/Authguard"; 
import NotificationCenter from "@/components/NotificationCenter"; // 👈 import
import Navbar  from "@/components/Navbar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ticket System",
  description: "Manage, Track & Resolve Tickets",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthGuard>
          {/* 👇 Global notification bell inside AuthGuard */}

          {/* Page content */}
          {children}
        </AuthGuard>

        {/* Global toast renderer */}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
