"use client";
import { useState, useEffect } from "react";
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
import SubTaskManager from "../projects/SubTaskManager";
import UserPickerModal from "../tasks/UserPickerModal";

export default function AddTaskModal({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]);
  const [subTasks, setSubTasks] = useState([]);
  const [isUserPickerOpen, setIsUserPickerOpen] = useState(false); 

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: "",
    assignedTo: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data.allUsers) {
          setMembers(data.allUsers);
        }
      } catch (err) {
        console.error("Failed to fetch members", err);
      }
    };

    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const toggleUser = (userId) => {
    setFormData((prev) => {
      const isSelected = prev.assignedTo.includes(userId);
      return {
        ...prev,
        assignedTo: isSelected
          ? prev.assignedTo.filter((id) => id !== userId)
          : [...prev.assignedTo, userId],
      };
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        projectId,
        subTasks,
      };

      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          priority: "Medium",
          dueDate: "",
          assignedTo: [],
        });
        setSubTasks([]);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <GlassCard className="w-full max-w-lg p-8 border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar bg-neutral-950/90">
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
          {/* Title */}
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

          {/* Description */}
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

          <SubTaskManager subTasks={subTasks} setSubTasks={setSubTasks} />

          {/* Priority & Date */}
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
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-accent/50 transition-all [color-scheme:dark]"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 flex items-center gap-2">
              <User size={12} /> Assignees
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {formData.assignedTo.map((userId) => {
                const user = members.find((m) => m._id === userId);
                return (
                  <div key={userId} className="group relative">
                    <div className="w-10 h-10 rounded-full border-2 border-accent/30 p-0.5 transition-all hover:scale-110 cursor-pointer shadow-lg shadow-accent/5">
                      <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white uppercase overflow-hidden border border-white/5">
                        {user?.name?.charAt(0) || "U"}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleUser(userId)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl"
                    >
                      <X size={10} />
                    </button>
                    {/* Tooltip on Hover */}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-neutral-900 text-[10px] px-2 py-1 rounded border border-white/10 text-white opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
                      {user?.name}
                    </span>
                  </div>
                );
              })}

              {/* The Sleek Add Button */}
              <button
                type="button"
                onClick={() => setIsUserPickerOpen(true)}
                className="w-10 h-10 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center text-neutral-500 hover:border-accent hover:text-accent transition-all hover:bg-accent/5 group relative"
              >
                <User size={18} />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-accent text-[8px] font-bold uppercase px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity tracking-widest">
                  Assign
                </span>
              </button>
            </div>
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

      {/* --- Separate User Picker Modal --- */}
      <UserPickerModal
        isOpen={isUserPickerOpen}
        onClose={() => setIsUserPickerOpen(false)}
        members={members}
        selectedUsers={formData.assignedTo}
        onToggle={toggleUser}
      />
    </div>
  );
}
