"use client";
import GlassCard from "@/components/ui/GlassCard";
import { Clock, Trash2, Play, CheckCircle, User } from "lucide-react";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const isTodo = task.status === "To-Do";
  const isInProgress = task.status === "In-Progress";

  return (
    <GlassCard className="p-5 border-white/5 hover:border-accent/20 transition-all duration-500 group relative overflow-hidden bg-white/2 hover:bg-white/4 shadow-2xl">
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
            onDelete(task._id);
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

      <div className="relative z-10 mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-bold tracking-tight">
          <Clock size={13} className="text-accent/60" />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
              })
            : "No Date"}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-neutral-600 font-medium hidden group-hover:block transition-all italic">
            {task.assignedTo?.name || "Unassigned"}
          </span>
          <div className="w-7 h-7 rounded-full border-2 border-white/10 overflow-hidden shadow-lg ring-2 ring-black/20">
            <img
              src={`https://ui-avatars.com/api/?name=${task.assignedTo?.name || "U"}&background=0D0D0D&color=fff&bold=true`}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-5">
        {(isTodo || isInProgress) && (
          <button
            onClick={(e) => {
              e.preventDefault();
              const nextStatus = isTodo ? "In-Progress" : "Done";
              onUpdate(task._id, nextStatus);
            }}
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
  );
}
