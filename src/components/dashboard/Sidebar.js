"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Briefcase,
  BarChart2,
  Zap,
} from "lucide-react";

const menuItems = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
    roles: ["SuperAdmin", "Admin", "Manager", "Employee"],
  },
  {
    name: "Team",
    icon: Users,
    path: "/dashboard/team",
    roles: ["SuperAdmin", "Admin"],
  },
  {
    name: "Projects",
    icon: Briefcase,
    path: "/dashboard/projects",
    roles: ["SuperAdmin", "Admin", "Manager", "Employee"],
  },
  {
    name: "Analytics",
    icon: BarChart2,
    path: "/dashboard/analytics",
    roles: ["SuperAdmin", "Admin", "Manager"],
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/dashboard/settings",
    roles: ["SuperAdmin", "Admin"],
  },
];

export default function Sidebar({ userRole }) {
  const pathname = usePathname();
  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <>
      <aside className="hidden md:flex w-72 border-r border-white/5 bg-[#050505] flex-col sticky top-0 h-screen z-40">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-accent p-2 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                <Zap size={20} className="text-white fill-white" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">
              SaaSFlow
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-4 relative">
          <LayoutGroup id="desktop-nav">
            {filteredMenu.map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="block mb-2 relative outline-none"
                >
                  <div
                    className={cn(
                      "group flex items-center gap-4 px-4 py-3 rounded-xl transition-colors duration-300 relative",
                      isActive
                        ? "text-white"
                        : "text-neutral-500 hover:text-neutral-300",
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-desktop"
                        className="absolute inset-0 bg-white/[0.06] border border-white/10 rounded-xl z-0"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}

                    <item.icon
                      size={20}
                      className={cn(
                        "relative z-10 transition-transform duration-500 group-hover:scale-110",
                        isActive ? "text-accent" : "group-hover:text-white",
                      )}
                    />

                    <span className="relative z-10 text-sm font-semibold tracking-wide">
                      {item.name}
                    </span>

                    {isActive && (
                      <motion.div
                        layoutId="active-dot-desktop"
                        className="absolute right-4 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_12px_#3b82f6] z-10"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 35,
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </LayoutGroup>
        </nav>

        <div className="p-6">
          <div className="relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.08] to-transparent border border-white/5 overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 blur-3xl group-hover:bg-accent/40 transition-colors duration-700" />
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.2em] mb-2">
              Pro Plan
            </p>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Upgrade for ultra-smooth insights and tools.
            </p>
            <button className="w-full bg-white text-black text-[11px] font-black py-3 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-lg">
              GET PREMIUM
            </button>
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed bottom-6 left-0 right-0 z-50 px-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-md mx-auto h-16 bg-black/50 backdrop-blur-xl border border-white/10 rounded-4xl flex items-center justify-around px-2 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        >
          <LayoutGroup id="mobile-nav">
            {filteredMenu.map((item) => {
              const isActive =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="relative flex flex-col items-center justify-center w-12 h-12 outline-none"
                >
                  <motion.div
                    className="absolute inset-0 bg-accent/15 rounded-2xl blur-lg"
                    initial={false}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.div
                    animate={
                      isActive ? { y: -2, scale: 1.15 } : { y: 0, scale: 1 }
                    }
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={cn(
                      "relative z-10 transition-colors duration-300",
                      isActive ? "text-accent" : "text-neutral-500",
                    )}
                  >
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>

                  {isActive && (
                    <motion.div
                      layoutId="liquid-indicator-mobile"
                      className="absolute -bottom-1.5 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#3b82f6]"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </LayoutGroup>
        </motion.div>
      </div>
    </>
  );
}
