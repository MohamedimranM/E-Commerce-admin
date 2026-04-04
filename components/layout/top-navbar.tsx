"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell, Search } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { toggleMobile } from "@/store/features/sidebar-slice";
import { navigation } from "@/lib/navigation";

export function TopNavbar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  // Build breadcrumb from current path
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, i) => {
    const matchedItem = navigation
      .flatMap((g) => g.items)
      .find((item) => item.segment === seg);
    return {
      label: matchedItem?.label || seg.charAt(0).toUpperCase() + seg.slice(1),
      isLast: i === segments.length - 1,
    };
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">
      {/* Left — Hamburger + Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => dispatch(toggleMobile())}
          className="rounded-lg p-2 text-[#1E272E] transition-colors hover:bg-[#F5F6FA] lg:hidden cursor-pointer"
        >
          <Menu className="h-5 w-5" />
        </button>

        <nav className="hidden items-center gap-1 text-sm sm:flex">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-gray-300">/</span>}
              <span
                className={
                  crumb.isLast
                    ? "font-medium text-[#1E272E]"
                    : "text-gray-400"
                }
              >
                {crumb.label}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right — Search, Notification, User */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-56 rounded-lg border border-gray-200 bg-[#F5F6FA] pl-9 pr-3 text-sm text-[#1E272E] placeholder:text-gray-400 focus:border-[#0984E3] focus:outline-none focus:ring-1 focus:ring-[#0984E3] transition-colors"
          />
        </div>

        {/* Notification Bell */}
        <button className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-[#F5F6FA] hover:text-[#1E272E] cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#00CEC9]" />
        </button>

        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0984E3] text-sm font-bold text-white">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
