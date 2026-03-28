"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, UserPlus, Zap, CheckCircle, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

const notifications = [
  { id: 1, title: "New Team Member", desc: "Sarah Smith joined Acme Corp", time: "2m ago", icon: UserPlus, color: "text-blue-500" },
  { id: 2, title: "Project Completed", desc: "Brand Redesign is now live", time: "1h ago", icon: CheckCircle, color: "text-emerald-500" },
  { id: 3, title: "Subscription Renewed", desc: "Your Pro plan was renewed", time: "5h ago", icon: Zap, color: "text-amber-500" },
  { id: 4, title: "System Update", desc: "SaaSFlow v2.0 is now active", time: "1d ago", icon: Clock, color: "text-purple-500" },
];

export default function NotificationDrawer({ isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-sm bg-[#050505] border-l border-white/10 z-[101] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-accent" />
                <h2 className="text-lg font-bold">Notifications</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-neutral-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {notifications.map((n) => (
                <div key={n.id} className="glass-card p-4 border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                  <div className="flex gap-4">
                    <div className={`mt-1 p-2 rounded-lg bg-white/5 border border-white/10 ${n.color}`}>
                      <n.icon size={18} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-sm font-semibold group-hover:text-accent transition-colors">{n.title}</h4>
                        <span className="text-[10px] text-neutral-600 font-medium">{n.time}</span>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">{n.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/5">
              <button className="w-full py-3 text-xs font-bold text-neutral-500 hover:text-white transition-colors uppercase tracking-widest">
                Mark all as read
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}