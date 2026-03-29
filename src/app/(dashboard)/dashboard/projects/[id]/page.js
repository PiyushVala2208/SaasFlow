"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import {
  Loader2,
  Plus,
  LayoutGrid,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import Button from "@/components/ui/Button";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);

      const projectRes = await fetch(`/api/projects/${id}`);
      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProject(projectData);
      }

      const tasksRes = await fetch(`/api/tasks?projectId=${id}`);
      const tasksData = await tasksRes.json();

      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        console.error("API didn't return an array:", tasksData);
        setTasks([]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Back Button Section */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2  hover:text-white transition-colors text-sm font-medium group text-blue-500"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform text-blue-600"
        />
        Back to Projects
      </button>

      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-neutral-500 mb-2">
            <LayoutGrid size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Project Overview
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{project?.name}</h1>
          <p className="text-neutral-500 mt-2 max-w-2xl">
            {project?.description}
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus size={18} /> Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn
          title="To-Do"
          tasks={tasks.filter((t) => t.status === "To-Do")}
          color="bg-neutral-500"
        />
        <KanbanColumn
          title="In-Progress"
          tasks={tasks.filter((t) => t.status === "In-Progress")}
          color="bg-blue-500"
        />
        <KanbanColumn
          title="Completed"
          tasks={tasks.filter((t) => t.status === "Done")}
          color="bg-emerald-500"
        />
      </div>
    </div>
  );
}

function KanbanColumn({ title, tasks, color }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <h2 className="font-bold text-sm uppercase tracking-wider text-neutral-400">
            {title}
          </h2>
          <span className="bg-white/5 px-2 py-0.5 rounded-md text-[10px] text-neutral-500">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className="space-y-4 min-h-125 rounded-3xl border-2 border-dashed border-white/5 p-2">
        {tasks.map((task) => (
          <GlassCard
            key={task._id}
            className="p-4 border-white/5 hover:border-white/10 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-3">
              <span
                className={`text-[10px] px-2 py-1 rounded-lg bg-white/5 font-bold uppercase tracking-tighter ${task.priority === "Urgent" ? "text-red-400" : "text-neutral-400"}`}
              >
                {task.priority}
              </span>
            </div>
            <h4 className="font-bold text-white group-hover:text-accent transition-colors">
              {task.title}
            </h4>
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
              {task.description}
            </p>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-1 text-[10px] text-neutral-600">
                <Clock size={12} />
                {task.deadline
                  ? new Date(task.deadline).toLocaleDateString()
                  : "No date"}
              </div>
              <img
                src={`https://ui-avatars.com/api/?name=${task.assignedTo?.name || "U"}&background=random`}
                className="w-5 h-5 rounded-full border border-white/10"
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
