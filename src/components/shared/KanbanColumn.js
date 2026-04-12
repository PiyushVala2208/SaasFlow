"use client";
import TaskCard from "./TaskCard";

export default function KanbanColumn({
  title,
  tasks,
  color,
  onUpdate, 
  onDelete,
  onTaskClick,
}) {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = "transparent";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = "transparent";
    const taskId = e.dataTransfer.getData("taskId");

    if (taskId && onUpdate) {
      onUpdate(taskId, title); 
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)] ${color}`}
          />
          <h2 className="font-black text-xs uppercase tracking-[0.2em] text-neutral-400">
            {title}
          </h2>
          <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-neutral-500 tabular-nums">
            {tasks.length}
          </span>
        </div>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex flex-col gap-4 min-h-[600px] rounded-[2.5rem] border-2 border-dashed border-white/[0.03] p-3 bg-white/[0.01] transition-all duration-300 ease-in-out hover:border-white/10"
      >
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              draggable // Isse task move ho payega
              onDragStart={(e) => e.dataTransfer.setData("taskId", task._id)}
              onClick={() => onTaskClick && onTaskClick(task)}
              className="cursor-grab active:cursor-grabbing active:scale-[0.98] transition-transform"
            >
              <TaskCard task={task} onUpdate={onUpdate} onDelete={onDelete} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center opacity-20 group">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-current mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-xl">+</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest">
              No Tasks
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
