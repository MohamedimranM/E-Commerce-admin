"use client";

import { Users, Package, Star, ShieldCheck } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";

export default function DashboardPage() {
  const stats = [
    {
      label: "Total Users",
      value: "—",
      icon: Users,
      color: "primary" as const,
    },
    {
      label: "Total Admins",
      value: "—",
      icon: ShieldCheck,
      color: "secondary" as const,
    },
    {
      label: "Total Products",
      value: "—",
      icon: Package,
      color: "accent" as const,
    },
    {
      label: "Average Rating",
      value: "—",
      icon: Star,
      color: "warning" as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E272E]">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&#39;s an overview of your store.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Placeholder sections for tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Products Table Placeholder */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E272E]">
            Recent Products
          </h2>
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">
            Product table will appear here
          </div>
        </div>

        {/* Reviews Table Placeholder */}
        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-[#1E272E]">
            Recent Reviews
          </h2>
          <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-200 text-sm text-gray-400">
            Reviews table will appear here
          </div>
        </div>
      </div>
    </div>
  );
}
