"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { useAppSelector } from "@/store/hooks";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAppSelector((s) => s.auth);
  const { isCollapsed } = useAppSelector((s) => s.sidebar);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isHydrated, router]);

  if (!isHydrated || !isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[#F5F6FA]">
      <Sidebar />

      {/* Main content area */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isCollapsed ? 72 : 260 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex min-h-screen flex-col max-lg:!ml-0"
      >
        <TopNavbar />

        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
