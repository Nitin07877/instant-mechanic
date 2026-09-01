"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Sidebar } from "@/components/sidebar";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/login") {
      router.push("/login");
    }
  }, [loading, user, pathname, router]);

  // Login page: no sidebar, full-screen, render as-is
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Still checking auth status
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  // Not logged in — redirecting, render nothing
  if (!user) return null;

  // Logged in: show the real dashboard shell
  return (
    <>
      <Sidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </>
  );
}