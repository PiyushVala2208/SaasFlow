"use client";
import { X, Loader2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function EditUserModal({ isOpen, onClose, employee, setEmployee, onSave, isUpdating }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-8 border-white/10 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-white uppercase italic mb-6">Update Employee</h2>

        <div className="space-y-6">
          <div>
            <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-2 block">Role</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent"
              value={employee?.role}
              onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            >
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Employee">Employee</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-2 block">Status</label>
            <select
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent"
              value={employee?.status}
              onChange={(e) => setEmployee({ ...employee, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <button
            onClick={onSave}
            disabled={isUpdating}
            className="w-full bg-accent py-4 rounded-xl text-white font-black uppercase tracking-widest disabled:opacity-50"
          >
            {isUpdating ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Save Changes"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}