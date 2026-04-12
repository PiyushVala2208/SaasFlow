"use client";
import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, ListTodo } from "lucide-react";

export default function SubTaskManager({ subTasks, setSubTasks }) {
  const [inputValue, setInputValue] = useState("");

  const addSubTask = () => {
    if (!inputValue.trim()) return;
    setSubTasks([
      ...subTasks,
      { id: Date.now(), title: inputValue, isCompleted: false },
    ]);
    setInputValue("");
  };

  const removeSubTask = (id) => {
    setSubTasks(subTasks.filter((st) => st.id !== id));
  };

  const toggleSubTask = (id) => {
    setSubTasks(
      subTasks.map((st) =>
        st.id === id ? { ...st, isCompleted: !st.isCompleted } : st,
      ),
    );
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 flex items-center gap-2">
        <ListTodo size={12} className="text-accent" /> Task Checklist
      </label>

      <div className="relative group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && (e.preventDefault(), addSubTask())
          }
          placeholder="Add a sub-task step..."
          className="w-full bg-white/3 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all placeholder:text-neutral-700"
        />
        <button
          type="button"
          onClick={addSubTask}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-black rounded-lg hover:bg-neutral-200 transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
        {subTasks.map((task) => (
          <div
            key={task.id}
            className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => toggleSubTask(task.id)}
                className="transition-transform active:scale-90"
              >
                {task.isCompleted ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <Circle
                    size={18}
                    className="text-neutral-600 group-hover:text-neutral-400"
                  />
                )}
              </button>
              <span
                className={`text-sm transition-all duration-300 ${
                  task.isCompleted
                    ? "text-neutral-600 line-through decoration-neutral-700"
                    : "text-neutral-300"
                }`}
              >
                {task.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => removeSubTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 text-neutral-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}

        {subTasks.length === 0 && (
          <p className="text-[10px] text-center text-neutral-700 italic py-2">
            No milestones added yet.
          </p>
        )}
      </div>
    </div>
  );
}
