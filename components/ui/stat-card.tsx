"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: "primary" | "accent" | "warning" | "secondary";
  trend?: string;
}

const colorMap = {
  primary: {
    bg: "bg-[#0984E3]/10",
    text: "text-[#0984E3]",
    border: "border-[#0984E3]/20",
  },
  accent: {
    bg: "bg-[#00CEC9]/10",
    text: "text-[#00CEC9]",
    border: "border-[#00CEC9]/20",
  },
  warning: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
  },
  secondary: {
    bg: "bg-[#1E272E]/10",
    text: "text-[#1E272E]",
    border: "border-[#1E272E]/20",
  },
};

export function StatCard({ label, value, icon: Icon, color, trend }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-3xl font-bold text-[#1E272E]">{value}</p>
          {trend && (
            <p className={cn("mt-1 text-xs font-medium", colors.text)}>
              {trend}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl",
            colors.bg
          )}
        >
          <Icon className={cn("h-6 w-6", colors.text)} />
        </div>
      </div>
    </div>
  );
}
