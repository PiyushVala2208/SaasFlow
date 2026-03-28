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

export default function UserDetailDrawer({
  user,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) {
  if (!isOpen || !user) return null;

  return (
    <>
      <div
        className="fixed h-screen inset-0 bg-black/80  z-[110] transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-[120] shadow-2xl p-8 transform transition-transform animate-in slide-in-from-right duration-300 ease-out">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center text-center mt-8 mb-10">
          <img
            src={`https://ui-avatars.com/api/?name=${user.name || user.email}&size=128&background=random&color=fff`}
            className="w-24 h-24 rounded-2xl border-2 border-accent/20 mb-4 shadow-lg shadow-accent/10"
            alt={user.name}
          />
          <h3 className="text-2xl font-bold text-white italic uppercase tracking-tight">
            {user.name || "Pending Invite"}
          </h3>
          <p className="text-neutral-500 text-sm flex items-center gap-2 mt-1">
            <Mail size={14} /> {user.email}
          </p>
          <div className="mt-4">
            <StatusBadge status={user.status || "pending"} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
            <h4 className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.2em] mb-5">
              Account Overview
            </h4>

            <div className="space-y-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 flex items-center gap-2">
                  <Shield size={14} /> Role Access
                </span>
                <span className="text-white font-bold uppercase text-[11px] tracking-wider">
                  {user.role || "Employee"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 flex items-center gap-2">
                  <Calendar size={14} /> Joined Date
                </span>
                <span className="text-white">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm pt-4 border-t border-white/5">
                <span className="text-neutral-500 flex items-center gap-2">
                  <Fingerprint size={14} /> Database ID
                </span>
                <span className="text-neutral-700 text-[9px] font-mono break-all max-w-[150px] text-right">
                  {user._id}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
              onClick={() => {
                onClose();
                onEdit(user);
              }}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-accent hover:text-white border border-white/10 py-3.5 rounded-xl text-white text-xs font-bold transition-all group"
            >
              <UserCog
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              Manage Access
            </button>

            <button
              onClick={() => {
                onClose();
                onDelete(user._id);
              }}
              className="flex items-center justify-center gap-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 py-3.5 rounded-xl text-red-500 text-xs font-bold transition-all"
            >
              <Trash2 size={14} />
              Remove User
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
