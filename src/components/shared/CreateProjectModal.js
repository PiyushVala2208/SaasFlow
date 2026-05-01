"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutGrid, Calendar, Loader2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

// 🔥 Added projectData prop for Edit mode
export default function CreateProjectModal({
  isOpen,
  onClose,
  onSuccess,
  projectData = null,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Medium",
    deadline: "",
  });

  // 🔄 Sync form data when editing
  useEffect(() => {
    if (projectData && isOpen) {
      setFormData({
        name: projectData.name || "",
        description: projectData.description || "",
        priority: projectData.priority || "Medium",
        deadline: projectData.deadline
          ? projectData.deadline.split("T")[0]
          : "",
      });
    } else if (!projectData && isOpen) {
      // Reset for new project
      setFormData({
        name: "",
        description: "",
        priority: "Medium",
        deadline: "",
      });
    }
  }, [projectData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Dynamic Endpoint & Method
    const url = projectData
      ? `/api/projects/${projectData._id}`
      : "/api/projects";
    const method = projectData ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        onSuccess(result);
        onClose();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Project Submission Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg"
          >
            <GlassCard className="p-8 border-white/10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-500/10 rounded-lg text-violet-400 border border-violet-500/20">
                    <LayoutGrid size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {projectData ? "Edit Project" : "Create New Project"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-500 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                    Project Name
                  </label>
                  <input
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all placeholder:text-neutral-600"
                    placeholder="e.g. Q2 Marketing Campaign"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none placeholder:text-neutral-600"
                    placeholder="Briefly describe the project goals..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                      Priority
                    </label>
                    <select
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-all appearance-none cursor-pointer"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-500 mb-2 block">
                      Deadline
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                        size={16}
                      />
                      <input
                        type="date"
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-violet-500/50 transition-all [color-scheme:dark]"
                        value={formData.deadline}
                        onChange={(e) =>
                          setFormData({ ...formData, deadline: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider transition-all hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : projectData ? (
                      "Save Changes"
                    ) : (
                      "Launch Project"
                    )}
                  </Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
