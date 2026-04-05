"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { navigation } from "@/lib/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
  toggleCollapse,
  closeMobile,
} from "@/store/features/sidebar-slice";
import { logout } from "@/store/features/auth-slice";
import { useRouter } from "next/navigation";

const SIDEBAR_WIDTH = 260;
const SIDEBAR_COLLAPSED_WIDTH = 72;

export function Sidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isCollapsed, isMobileOpen } = useAppSelector((s) => s.sidebar);
  const { user } = useAppSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0984E3]">
          <ShoppingBag className="h-5 w-5 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            className="overflow-hidden whitespace-nowrap text-lg font-bold text-white"
          >
            Shopping Hub Admin
          </motion.span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
          <div key={group.title} className="mb-6">
            {!isCollapsed && (
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                {group.title}
              </p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.segment !== "dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => dispatch(closeMobile())}
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#0984E3] text-white shadow-lg shadow-[#0984E3]/25"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 shrink-0",
                          isActive
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        )}
                      />
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile / Logout */}
      <div className="border-t border-white/10 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5",
            isCollapsed ? "justify-center" : ""
          )}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00CEC9] text-sm font-bold text-[#1E272E]">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                {user?.name}
              </p>
              <p className="truncate text-xs text-gray-400">{user?.role}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="fixed left-0 top-0 z-40 hidden h-screen bg-[#1E272E] lg:block"
      >
        {sidebarContent}

        {/* Collapse Toggle */}
        <button
          onClick={() => dispatch(toggleCollapse())}
          className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white shadow-md transition-colors hover:bg-gray-50 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-[#1E272E]" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-[#1E272E]" />
          )}
        </button>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black lg:hidden"
              onClick={() => dispatch(closeMobile())}
            />
            <motion.aside
              initial={{ x: -SIDEBAR_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -SIDEBAR_WIDTH }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 z-50 h-screen bg-[#1E272E] lg:hidden"
              style={{ width: SIDEBAR_WIDTH }}
            >
              <button
                onClick={() => dispatch(closeMobile())}
                className="absolute right-3 top-4 rounded-md p-1 text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
