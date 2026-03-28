"use client";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Building,
  Mail,
  Users,
  Loader2,
  ShieldCheck,
  User,
  Trash2,
  ShieldAlert,
  UserMinus,
} from "lucide-react";

export default function OrgDetailsSidebar({
  isOpen,
  onClose,
  org,
  users,
  loading,
  onDeleteOrg, 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80  z-[100] h-screen"
          />

          {/* Liquid Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#080808] border-l border-white/10 z-[101] p-8 shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
                  <Building className="text-purple-500" size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white leading-tight">
                    {org?._id}
                  </h2>
                  <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                    <Mail size={12} /> {org?.adminEmail}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-neutral-500 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            {/* Quick Stats Area */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest mb-1">
                  Total Members
                </p>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-emerald-500" />
                  <span className="text-xl font-bold">{org?.memberCount}</span>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2 text-emerald-500">
                  <ShieldCheck size={16} />
                  <span className="text-sm font-bold uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Sidebar ke andar Quick Stats ke niche ye section daal do */}
            <div className="mb-10 p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-4">
              <h4 className="text-[10px] uppercase text-neutral-500 font-bold tracking-widest">
                Management Console
              </h4>

              <div className="flex flex-col gap-4">
                {/* Plan Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400 font-medium">
                    Subscription Plan
                  </span>
                  <select
                    className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-purple-400 focus:outline-none focus:border-purple-500 transition-all"
                    defaultValue={org?.plan || "Free"}
                  >
                    <option value="Free">Free Tier</option>
                    <option value="Pro">Pro Plan</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400 font-medium">
                    Organization Status
                  </span>
                  <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-tighter hover:bg-emerald-500 hover:text-white transition-all">
                    Active
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest border-b border-white/5 pb-2">
                User Directory
              </h4>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="animate-spin text-purple-500" size={30} />
                  <p className="text-xs text-neutral-600 font-medium">
                    Fetching secure data...
                  </p>
                </div>
              ) : users && users.length > 0 ? (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <User size={18} className="text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase ${
                            user.role === "Admin"
                              ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              : "bg-neutral-800 text-neutral-400 border border-white/5"
                          }`}
                        >
                          {user.role}
                        </span>
                        <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 text-neutral-600 hover:text-red-500 rounded-md transition-all">
                          <UserMinus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-600 text-xs">
                  No users found in this organization.
                </div>
              )}
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldAlert className="text-red-500/50" size={16} />
                <h4 className="text-xs font-bold text-red-500/50 uppercase tracking-widest">
                  Danger Zone
                </h4>
              </div>

              <div className="p-6 rounded-3xl bg-red-500/[0.02] border border-red-500/10">
                <p className="text-xs text-neutral-500 mb-4 leading-relaxed">
                  Deleting this organization will permanently remove all
                  associated users, workspaces, and data. This action is
                  irreversible.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onDeleteOrg(org?._id);
                  }}
                  className="w-full py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 rounded-2xl transition-all font-bold text-sm flex items-center justify-center gap-2 group"
                >
                  <Trash2 size={18} className="group-hover:animate-bounce" />
                  Terminate Organization
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
