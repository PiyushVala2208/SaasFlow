"use client";
import { useState } from "react";
import { Hash, CheckCircle2, Circle, Trash2, Send } from "lucide-react";

const getSubTaskId = (subTask) => {
  const raw = subTask?._id || subTask?.id;
  return raw ? String(raw) : "";
};

export default function ChecklistSection({ subTasks = [], onUpdate }) {
  const [newSubTask, setNewSubTask] = useState("");

  const addSubTask = () => {
    if (!newSubTask.trim()) return;
    const newEntry = {
      _id: `temp-${Date.now()}`,
      title: newSubTask.trim(),
      isCompleted: false,
    };
    onUpdate({ subTasks: [...subTasks, newEntry] });
    setNewSubTask("");
  };

  const toggleSubTask = (id) => {
    const targetId = String(id);
    const newList = subTasks.map((st) =>
      getSubTaskId(st) === targetId ? { ...st, isCompleted: !st.isCompleted } : st,
    );
    onUpdate({ subTasks: newList });
  };

  const deleteSubTask = (id) => {
    const targetId = String(id);
    onUpdate({
      subTasks: subTasks.filter((st) => getSubTaskId(st) !== targetId),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1.5">
          <Hash size={14} /> Checklist
        </span>
        <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded-full">
          {subTasks.filter((s) => s.isCompleted).length} / {subTasks.length}
        </span>
      </div>

      <div className="space-y-2">
        {subTasks.map((st, idx) => {
          const subTaskId = getSubTaskId(st);
          return (
          <div
            key={subTaskId || idx}
            className="group flex items-center gap-3 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-blue-500/20 transition-all"
          >
            <button onClick={() => toggleSubTask(subTaskId || idx)}>
              {st.isCompleted ? (
                <CheckCircle2 size={20} className="text-emerald-500" />
              ) : (
                <Circle size={20} className="text-neutral-800" />
              )}
            </button>
            <span
              className={`text-sm flex-1 ${st.isCompleted ? "text-neutral-600 line-through" : "text-neutral-200"}`}
            >
              {st.title}
            </span>
            <button
              onClick={() => deleteSubTask(subTaskId || idx)}
              className="opacity-0 group-hover:opacity-100 text-neutral-700 hover:text-red-500 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )})}

        <div className="flex items-center gap-2 p-1 pl-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.01] focus-within:border-blue-500/50 transition-all">
          <input
            className="flex-1 py-3 bg-transparent text-sm text-neutral-400 outline-none"
            placeholder="Add a step..."
            value={newSubTask}
            onChange={(e) => setNewSubTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addSubTask()}
          />
          <button
            onClick={addSubTask}
            disabled={!newSubTask.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-20 mr-1"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
