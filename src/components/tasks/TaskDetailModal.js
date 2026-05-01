"use client";
import { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  Clock,
  Calendar,
  AlertCircle,
  Trash2,
  AlignLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AssigneeSection from "./AssigneeSection";
import ChecklistSection from "./ChecklistSection";
import TagManagerSection from "./TagManagerSection";
import { normalizeTaskTags } from "@/lib/taskTags";

const getUserId = (entity) => {
  const userRef = entity?.user;
  const userRefId =
    userRef && typeof userRef === "object"
      ? userRef._id ||
        userRef.id ||
        (typeof userRef.toString === "function" ? userRef.toString() : "")
      : userRef;

  const fallbackEntityRef = entity && typeof entity !== "object" ? entity : "";
  const raw =
    (userRefId && userRefId !== "[object Object]" ? userRefId : "") ||
    entity?._id ||
    entity?.id ||
    fallbackEntityRef;

  return raw ? String(raw) : "";
};

const normalizeUserShape = (entity, fallbackId = "") => {
  const base = entity?.user ? entity.user : entity;
  const id = getUserId(entity) || (fallbackId ? String(fallbackId) : "");

  if (!id) return null;

  return {
    _id: id,
    name: base?.name || entity?.name || "User",
    email: base?.email || entity?.email || "",
    image: base?.image || entity?.image || "",
  };
};

export default function TaskDetailSidebar({
  isOpen,
  onClose,
  task,
  onUpdate,
  onDelete,
  members = [],
}) {
  const [localTask, setLocalTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const toLocalTaskShape = (sourceTask) => {
    if (!sourceTask) return null;

    const normalizedAssignedTo = Array.isArray(sourceTask.assignedTo)
      ? Array.from(
          new Map(
            sourceTask.assignedTo
              .map((entry) => normalizeUserShape(entry))
              .filter(Boolean)
              .map((entry) => [entry._id, entry]),
          ).values(),
        )
      : [];

    return {
      ...sourceTask,
      assignedTo: normalizedAssignedTo,
      subTasks: Array.isArray(sourceTask.subTasks) ? sourceTask.subTasks : [],
      tags: normalizeTaskTags(sourceTask.tags),
    };
  };

  useEffect(() => {
    if (!task) {
      setLocalTask(null);
      return;
    }

    setLocalTask(toLocalTaskShape(task));
  }, [task]);

  if (!localTask) return null;

  const handleUpdate = async (updatedFields) => {
    const previousState = { ...localTask };

    setLocalTask((prev) => {
      const nextState = { ...prev, ...updatedFields };

      if (updatedFields.assignedTo) {
        const uniqueAssignedIds = Array.from(
          new Set(updatedFields.assignedTo.map((id) => String(id))),
        );

        nextState.assignedTo = uniqueAssignedIds.map((id) => {
          const targetId = String(id);

          const foundMember = members.find((member) => {
            return getUserId(member) === targetId;
          });

          if (foundMember) {
            return normalizeUserShape(foundMember, targetId);
          }

          const existing = prev.assignedTo?.find((entry) => {
            return getUserId(entry) === targetId;
          });

          return (
            normalizeUserShape(existing, targetId) || {
              _id: targetId,
              name: "User",
              email: "",
              image: "",
            }
          );
        });
      }

      if (Object.prototype.hasOwnProperty.call(updatedFields, "tags")) {
        nextState.tags = normalizeTaskTags(updatedFields.tags);
      }

      return nextState;
    });

    try {
      const payload = { ...updatedFields };

      if (payload.status) {
        const statusMap = {
          todo: "To-Do",
          "in-progress": "In-Progress",
          review: "Review",
          done: "Done",
        };
        const key = payload.status.toLowerCase();
        payload.status = statusMap[key] || payload.status;
      }

      if (payload.assignedTo) {
        payload.assignedTo = updatedFields.assignedTo
          .map((id) => getUserId(id))
          .filter(Boolean);
      }

      if (Object.prototype.hasOwnProperty.call(payload, "tags")) {
        payload.tags = normalizeTaskTags(payload.tags);
      }

      const taskId = localTask._id || previousState._id;
      const updatedFromServer = await onUpdate(taskId, payload);

      if (updatedFromServer) {
        setLocalTask(toLocalTaskShape(updatedFromServer));
      }
    } catch (err) {
      console.error("Sync failed, reverting:", err);
      setLocalTask(previousState);
    }
  };

  const handleSaveAndClose = async () => {
    const taskId = localTask?._id || task?._id;
    if (!taskId) {
      onClose();
      return;
    }

    const finalPayload = {
      title: localTask.title,
      description: localTask.description || "",
      status: localTask.status,
      priority: localTask.priority,
      dueDate: localTask.dueDate || localTask.deadline || null,
      assignedTo: (localTask.assignedTo || [])
        .map((entry) => getUserId(entry))
        .filter(Boolean),
      subTasks: (localTask.subTasks || []).map((subTask) => ({
        ...(subTask?._id ? { _id: String(subTask._id) } : {}),
        title: String(subTask?.title || ""),
        isCompleted: Boolean(subTask?.isCompleted),
        ...(getUserId(subTask?.assignedTo)
          ? { assignedTo: getUserId(subTask.assignedTo) }
          : {}),
      })),
      tags: normalizeTaskTags(localTask.tags),
    };

    try {
      setIsSaving(true);
      const updatedFromServer = await onUpdate(taskId, finalPayload);
      if (updatedFromServer) {
        setLocalTask(toLocalTaskShape(updatedFromServer));
      }
      onClose();
    } catch (err) {
      console.error("Final save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="fixed inset-0 z-150 bg-black/90">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 "
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed  right-0 top-0 h-full w-full max-w-[550px] bg-[#080808] border-l border-white/10 z-160 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-1 rounded uppercase tracking-widest">
                  {localTask.status}
                </span>
                <ChevronRight size={12} className="text-neutral-700" />
                <span className="text-[10px] font-bold text-neutral-500 uppercase italic">
                  ID: {localTask._id?.slice(-6)}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full text-neutral-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <textarea
                className="w-full bg-transparent text-3xl font-black text-white outline-none resize-none placeholder:text-neutral-800 focus:text-blue-400 transition-all"
                value={localTask.title}
                onChange={(e) =>
                  setLocalTask({ ...localTask, title: e.target.value })
                }
                onBlur={(e) => handleUpdate({ title: e.target.value })}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Clock size={10} /> Status
                  </label>
                  <select
                    className="w-full bg-white/3 border border-white/10 rounded-xl p-3 text-xs text-white outline-none font-bold focus:border-blue-500/50 cursor-pointer"
                    value={localTask.status}
                    onChange={(e) => handleUpdate({ status: e.target.value })}
                  >
                    {["To-Do", "In-Progress", "Review", "Done"].map((opt) => (
                      <option key={opt} value={opt} className="bg-[#0f0f0f]">
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={10} /> Priority
                  </label>
                  <select
                    className={`w-full bg-white/[0.03] border border-white/10 rounded-xl p-3 text-xs outline-none font-bold cursor-pointer ${
                      localTask.priority === "Urgent"
                        ? "text-red-500"
                        : "text-white"
                    }`}
                    value={localTask.priority}
                    onChange={(e) => handleUpdate({ priority: e.target.value })}
                  >
                    {["Low", "Medium", "High", "Urgent"].map((p) => (
                      <option key={p} value={p} className="bg-[#0f0f0f]">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar size={10} /> Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none font-bold [color-scheme:dark]"
                    value={
                      localTask.dueDate || localTask.deadline
                        ? new Date(localTask.dueDate || localTask.deadline)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) => handleUpdate({ dueDate: e.target.value })}
                  />
                </div>
              </div>

              <AssigneeSection
                assignees={localTask.assignedTo || []}
                members={members}
                onUpdate={handleUpdate}
              />

              <TagManagerSection
                tags={localTask.tags || []}
                onUpdate={handleUpdate}
              />

              <div className="space-y-3">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
                  <AlignLeft size={14} /> Description
                </span>
                <textarea
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-5 text-sm text-neutral-300 outline-none focus:border-blue-500/30 min-h-[120px] resize-none"
                  placeholder="What's this task about?"
                  value={localTask.description || ""}
                  onChange={(e) =>
                    setLocalTask({ ...localTask, description: e.target.value })
                  }
                  onBlur={(e) => handleUpdate({ description: e.target.value })}
                />
              </div>

              <ChecklistSection
                subTasks={localTask.subTasks || []}
                onUpdate={handleUpdate}
              />
            </div>

            <div className="p-8 border-t border-white/5 bg-black/50 backdrop-blur-md flex gap-4">
              <button
                onClick={() => {
                  if (confirm("Delete this task permanently?")) {
                    onDelete(localTask._id);
                    onClose();
                  }
                }}
                className="p-4 rounded-2xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
              >
                <Trash2 size={18} /> Delete Task
              </button>
              <button
                onClick={handleSaveAndClose}
                disabled={isSaving}
                className="flex-1 p-4 rounded-2xl bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
              >
                Save & Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
