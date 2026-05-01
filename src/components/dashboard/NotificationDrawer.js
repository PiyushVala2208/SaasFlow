"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, UserPlus, Zap, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: 1,
    title: "New Team Member",
    desc: "Sarah Smith joined Acme Corp",
    time: "2m ago",
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 2,
    title: "Project Completed",
    desc: "Brand Redesign is now live",
    time: "1h ago",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: 3,
    title: "Subscription Renewed",
    desc: "Your Pro plan was renewed",
    time: "5h ago",
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    id: 4,
    title: "System Update",
    desc: "SaaSFlow v2.0 is now active",
    time: "1d ago",
    icon: Clock,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    id: 5,
    title: "New Lead",
    desc: "A new lead has been captured",
    time: "2d ago",
    icon: UserPlus,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: 6,
    title: "Database Backup",
    desc: "Weekly backup completed",
    time: "3d ago",
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
];

export default function NotificationDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }
  }, [isOpen]);

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[99998]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 350 }}
            className={cn(
              "fixed right-0 top-0 z-[99999]",
              "h-screen w-full sm:max-w-[400px]", // Mobile par full width, PC par 400px
              "bg-[#050505] border-l border-white/10 shadow-2xl",
              "flex flex-col overflow-hidden", // Main flex container
            )}
          >
            <div className="shrink-0 p-6 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-accent/20 rounded-2xl border border-accent/20 shadow-[0_0_15px_rgba(var(--accent-rgb),0.1)]">
                  <Bell size={20} className="text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white leading-tight">
                    Activity
                  </h2>
                  <p className="text-[10px] text-accent font-bold uppercase tracking-[0.2em] opacity-80">
                    Latest Updates
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="group p-2.5 bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 active:scale-90"
              >
                <X
                  size={20}
                  className="text-neutral-400 group-hover:text-white transition-all"
                />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-3 custom-scrollbar bg-gradient-to-b from-[#050505] to-black">
              {notifications.map((n, i) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="group relative"
                >
                  <div className="relative glass-card p-4 border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer rounded-[22px] flex gap-4 active:scale-[0.98]">
                    <div
                      className={cn(
                        "shrink-0 mt-1 p-2.5 rounded-xl border border-white/5 h-fit",
                        n.bg,
                      )}
                    >
                      <n.icon size={18} className={n.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1 gap-2">
                        <h4 className="text-sm font-bold text-neutral-200 group-hover:text-white transition-colors truncate">
                          {n.title}
                        </h4>
                        <span className="text-[9px] font-black text-neutral-600 bg-white/5 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="h-4" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
