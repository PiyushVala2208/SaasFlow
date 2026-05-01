"use client";
import {
  X,
  Mail,
  Shield,
  Calendar,
  Fingerprint,
  Trash2,
  UserCog,
} from "lucide-react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { motion, AnimatePresence } from "framer-motion";

export default function UserDetailDrawer({
  user,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[110]"
          />

          <motion.div
            initial={{ x: "100%", y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: "100%", y: 0 }}
            variants={{
              mobile: { y: "100%", x: 0 },
              desktop: { x: "100%", y: 0 }
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 bottom-0 md:top-0 h-[85vh] md:h-full w-full md:max-w-md bg-[#0a0a0a] border-t md:border-t-0 md:border-l border-white/10 z-[120] shadow-2xl rounded-t-[2.5rem] md:rounded-none p-6 md:p-8 overflow-y-auto no-scrollbar"
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 md:hidden" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-neutral-500 hover:text-white transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-4 md:mt-8 mb-8 md:mb-10">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.name || user.email}&size=128&background=random&color=fff`}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-3xl border-2 border-white/10 mb-4 shadow-2xl"
                  alt={user.name}
                />
                <div className="absolute -bottom-1 -right-1 bg-black p-1 rounded-lg border border-white/10">
                   <StatusBadge status={user.status || "pending"} />
                </div>
              </div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-2">
                {user.name || "Pending Invite"}
              </h3>
              <p className="text-neutral-500 text-sm flex items-center gap-2 mt-1.5">
                <Mail size={14} className="text-accent/50" /> {user.email}
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-6 space-y-6">
                <h4 className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.2em]">
                  Account Overview
                </h4>

                <div className="space-y-5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 flex items-center gap-3">
                      <Shield size={16} className="text-accent" /> Role Access
                    </span>
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border border-accent/20">
                      {user.role || "Employee"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-neutral-500 flex items-center gap-3">
                      <Calendar size={16} /> Joined Date
                    </span>
                    <span className="text-white font-medium">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="pt-5 border-t border-white/5">
                    <div className="flex flex-col gap-2">
                      <span className="text-neutral-500 flex items-center gap-3 text-sm">
                        <Fingerprint size={16} /> Database ID
                      </span>
                      <span className="text-neutral-700 text-[10px] font-mono break-all bg-black/40 p-3 rounded-xl border border-white/5">
                        {user._id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-8">
                <button
                  onClick={() => {
                    onClose();
                    onEdit(user);
                  }}
                  className="flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 group"
                >
                  <UserCog size={16} />
                  Manage Access
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onDelete(user._id);
                  }}
                  className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 py-4 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}