"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Clock, Trash2, Play, CheckCircle, ListTodo } from "lucide-react";
import { normalizeHexColor, normalizeTaskTags } from "@/lib/taskTags";

function withAlpha(hex, alpha = 0.24) {
  const normalized = normalizeHexColor(hex, "#64748B");
  const r = Number.parseInt(normalized.slice(1, 3), 16);
  const g = Number.parseInt(normalized.slice(3, 5), 16);
  const b = Number.parseInt(normalized.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const isTodo = task.status === "To-Do";
  const isInProgress = task.status === "In-Progress";

  const totalSubTasks = task.subTasks?.length || 0;
  const completedSubTasks =
    task.subTasks?.filter((st) => st.isCompleted).length || 0;
  const progressPercentage =
    totalSubTasks > 0 ? (completedSubTasks / totalSubTasks) * 100 : 0;

  const assignees = Array.isArray(task.assignedTo)
    ? task.assignedTo
    : task.assignedTo
      ? [task.assignedTo]
      : [];

  const tags = useMemo(() => normalizeTaskTags(task.tags), [task.tags]);
  const visibleTags = tags.slice(0, 3);
  const hiddenTagsCount = Math.max(tags.length - 3, 0);

  const handleStatusTransition = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nextStatus = isTodo ? "In-Progress" : "Done";
    onUpdate(task._id, nextStatus);
  };

  return (
    <motion.div
      onHoverStart={() => setIsCardHovered(true)}
      onHoverEnd={() => setIsCardHovered(false)}
    >
      <GlassCard className="p-5 border-white/5 hover:border-accent/20 transition-all duration-500 group relative overflow-hidden bg-white/2 hover:bg-white/4 shadow-2xl cursor-pointer">
        <div className="absolute -inset-px bg-linear-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="relative z-10 flex justify-between items-start mb-4">
          <span
            className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-[0.15em] border 
          ${
            task.priority === "Urgent"
              ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              : "bg-white/5 text-neutral-400 border-white/10"
          }`}
          >
            {task.priority}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (confirm("Are you sure you want to delete this task?")) {
                onDelete(task._id);
              }
            }}
            className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-neutral-500 hover:text-red-500 rounded-xl transition-all duration-300 transform hover:scale-110"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="relative z-10 space-y-2">
          <h4 className="font-bold text-white text-base group-hover:text-accent transition-colors duration-300 leading-tight">
            {task.title}
          </h4>
          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed font-medium">
            {task.description || "No description provided for this task."}
          </p>
        </div>

        {tags.length > 0 && (
          <div className="relative z-10 mt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <motion.div
                key={tag.text}
                animate={{
                  boxShadow: isCardHovered
                    ? `0 0 16px ${withAlpha(tag.color, 0.24)}`
                    : `0 0 0px ${withAlpha(tag.color, 0)}`,
                  y: isCardHovered ? -1 : 0,
                }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: withAlpha(tag.color, 0.6),
                  backgroundColor: "transparent",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: tag.color,
                    boxShadow: `0 0 10px ${withAlpha(tag.color, 0.95)}`,
                  }}
                />
                <span className="text-[9px] font-black uppercase tracking-[0.18em] text-neutral-300">
                  {tag.text}
                </span>
              </motion.div>
            ))}

            {hiddenTagsCount > 0 && (
              <motion.div
                animate={{
                  boxShadow: isCardHovered
                    ? "0 0 14px rgba(255,255,255,0.08)"
                    : "0 0 0px rgba(255,255,255,0)",
                }}
                transition={{ duration: 0.2 }}
                className="inline-flex items-center px-2.5 py-1 rounded-full border border-white/15 text-[9px] font-black uppercase tracking-[0.18em] text-neutral-400"
              >
                +{hiddenTagsCount}
              </motion.div>
            )}
          </div>
        )}

        {totalSubTasks > 0 && (
          <div className="relative z-10 mt-5 space-y-2">
            <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-neutral-500">
              <span className="flex items-center gap-1.5">
                <ListTodo size={10} className="text-accent" />
                Progress
              </span>
              <span className="text-white/80">
                {completedSubTasks} / {totalSubTasks}
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-linear-to-r from-accent/50 to-accent transition-all duration-700 ease-out shadow-[0_0_8px_rgba(var(--accent-rgb),0.4)]"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-tight text-neutral-500">
            <Clock size={13} className="text-violet-400/70" />
            <span className="uppercase tracking-[0.05em]">
              {task.dueDate || task.deadline
                ? new Date(task.dueDate || task.deadline).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )
                : "No Date"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {assignees.length > 0 ? (
                assignees.slice(0, 3).map((user, index) => (
                  <div
                    key={user._id || index}
                    className="w-7 h-7 rounded-full border-2 border-neutral-900 overflow-hidden shadow-lg bg-neutral-800 flex items-center justify-center ring-1 ring-white/5"
                  >
                    <img
                      src={
                        user.image ||
                        `https://ui-avatars.com/api/?name=${user.name || "U"}&background=0D0D0D&color=fff&bold=true`
                      }
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="w-7 h-7 rounded-full border-2 border-white/10 bg-white/5 flex items-center justify-center">
                  <span className="text-[8px] text-neutral-600">?</span>
                </div>
              )}

              {assignees.length > 3 && (
                <div className="w-7 h-7 rounded-full border-2 border-neutral-900 bg-neutral-800 flex items-center justify-center shadow-lg ring-1 ring-white/5">
                  <span className="text-[9px] font-bold text-white">
                    +{assignees.length - 3}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-5">
          {(isTodo || isInProgress) && (
            <button
              onClick={handleStatusTransition}
              className={`w-full py-3.5 rounded-2xl text-[11px] font-black tracking-[0.2em] uppercase transition-all duration-500 flex items-center justify-center gap-3 shadow-lg group/btn
            ${
              isTodo
                ? "bg-white/5 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 hover:border-blue-500 shadow-blue-500/5"
                : "bg-white/5 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 shadow-emerald-500/5"
            }`}
            >
              {isTodo ? (
                <>
                  <Play
                    size={14}
                    className="fill-current group-hover/btn:scale-125 transition-transform"
                  />
                  Launch Sprint
                </>
              ) : (
                <>
                  <CheckCircle
                    size={14}
                    className="group-hover/btn:rotate-[360deg] transition-transform duration-700"
                  />
                  Finalize Task
                </>
              )}
            </button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
