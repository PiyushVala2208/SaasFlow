"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LayoutGrid, Calendar, AlertCircle, Loader2 } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Button from "../ui/Button";

export default function CreateProjectModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Medium",
    deadline: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        onSuccess();
        onClose();
        setFormData({
          name: "",
          description: "",
          priority: "Medium",
          deadline: "",
        });
      }
    } catch (error) {
      console.error("Create Project Error:", error);
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
            className="absolute inset-0 bg-black/80"
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
                  <div className="p-2 bg-accent/10 rounded-lg text-accent">
                    <LayoutGrid size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    Create New Project
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                    Project Name
                  </label>
                  <input
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
                    placeholder="e.g. Q2 Marketing Campaign"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all resize-none"
                    placeholder="Briefly describe the project goals..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                      Priority
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option className="bg-[#0a0a0a]" value="Low">
                        Low
                      </option>
                      <option className="bg-[#0a0a0a]" value="Medium">
                        Medium
                      </option>
                      <option className="bg-[#0a0a0a]" value="High">
                        High
                      </option>
                      <option className="bg-[#0a0a0a]" value="Urgent">
                        Urgent
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2 block">
                      Deadline
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
                        size={16}
                      />
                      <input
                        type="date"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
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
                    className="w-full py-4 rounded-xl flex items-center justify-center gap-2 text-base font-bold"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
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
