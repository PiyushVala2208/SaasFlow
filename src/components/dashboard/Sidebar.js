"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  Briefcase,
  BarChart2,
  Zap,
  ChevronRight,
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
    <aside className="w-64 border-r border-white/5 bg-[#050505] hidden md:flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-accent p-1.5 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            SaaSFlow
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <div
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300",
                  isActive
                    ? "text-white"
                    : "text-neutral-500 hover:text-white hover:bg-white/[0.03]",
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/[0.05] border border-white/10 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon
                  size={20}
                  className={cn(
                    "relative z-10",
                    isActive ? "text-accent" : "group-hover:text-white",
                  )}
                />
                <span className="relative z-10 text-sm font-medium">
                  {item.name}
                </span>
                {isActive && (
                  <ChevronRight
                    size={14}
                    className="ml-auto relative z-10 text-accent"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <div className="glass-card p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent">
          <p className="text-[11px] font-bold text-accent uppercase tracking-widest mb-1">
            Pro Plan
          </p>
          <p className="text-xs text-neutral-400 mb-3">
            Get unlimited workspaces and team members.
          </p>
          <button className="w-full bg-white text-black text-[11px] font-bold py-2 rounded-lg hover:bg-neutral-200 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
