"use client";
import { useState } from "react";
import {
  X,
  Calendar,
  Flag,
  AlignLeft,
  Type,
  Loader2,
  User,
} from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";

export default function AddTaskModal({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          projectId,
        }),
      });

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
        });
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Task creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <GlassCard className="w-full max-w-lg p-8 border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Create New Task
            </h2>
            <p className="text-neutral-500 text-sm">
              Add details to your project sprint
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} className="text-neutral-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <Type size={12} /> Task Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Design Auth Flow"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-accent/50 transition-all placeholder:text-neutral-600"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <AlignLeft size={12} /> Description
            </label>
            <textarea
              rows="3"
              placeholder="What needs to be done?"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-accent/50 transition-all resize-none placeholder:text-neutral-600"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <Flag size={12} /> Priority
              </label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer"
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
              >
                <option value="Low" className="bg-neutral-900">
                  Low
                </option>
                <option value="Medium" className="bg-neutral-900">
                  Medium
                </option>
                <option value="High" className="bg-neutral-900">
                  High
                </option>
                <option value="Urgent" className="bg-neutral-900">
                  Urgent
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <Calendar size={12} /> Due Date
              </label>
              <input
                type="date"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-accent/50 transition-all scheme-dark"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <User size={12} /> Assign To
              </label>
              <select
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-accent/50 transition-all appearance-none cursor-pointer"
                value={formData.assignedTo}
                onChange={(e) =>
                  setFormData({ ...formData, assignedTo: e.target.value })
                }
              >
                <option value="" className="bg-neutral-900">
                  Select Member
                </option>
                {/* members.map hook se aayenge yahan */}
              </select>
            </div>

          <Button
            disabled={loading}
            type="submit"
            className="w-full py-4 mt-4 font-bold tracking-widest uppercase text-xs shadow-xl shadow-accent/10"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" size={18} />
            ) : (
              "Initialize Task"
            )}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
