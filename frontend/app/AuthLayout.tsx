"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import SideBar from "@/components/Sidebar";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/"); // Redirect to / (login page)
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Prevent rendering until redirected
  }

  return (
    <div className="flex h-screen">
      <SideBar />
      <main className="flex-1 ml-[var(--sidebar-width)] overflow-y-auto bg-custom_background">
        {children}
      </main>
    </div>
  );
}