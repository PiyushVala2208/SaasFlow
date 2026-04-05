"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, LayoutGrid, ArrowLeft, History, X } from "lucide-react";
import Button from "@/components/ui/Button";
import AddTaskModal from "@/components/shared/AddTaskModal";
import KanbanColumn from "@/components/shared/KanbanColumn";
import ActivityFeed from "@/components/projects/ActivityFeed";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false); // Custom Drawer State
  const [activityKey, setActivityKey] = useState(0);

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
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const triggerActivityRefresh = () => setActivityKey((prev) => prev + 1);

  const handleUpdateStatus = async (taskId, newStatus) => {
    const originalTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)),
    );
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) setTasks(originalTasks);
      else triggerActivityRefresh();
    } catch (err) {
      setTasks(originalTasks);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm("Delete this task?")) return;
    const originalTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) setTasks(originalTasks);
      else triggerActivityRefresh();
    } catch (err) {
      setTasks(originalTasks);
    }
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-accent" size={40} />
      </div>
    );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="space-y-8 pb-10">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-500 text-sm font-medium hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <h1 className="text-4xl font-bold tracking-tight">
              {project?.name}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsActivityOpen(true)}
              className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300 active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <History
                size={18}
                className="text-neutral-400 group-hover:text-accent transition-colors"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 group-hover:text-white relative z-10">
                Pulse
              </span>
            </button>

            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus size={18} /> Add Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <KanbanColumn
            title="To-Do"
            tasks={tasks.filter((t) => t.status === "To-Do")}
            color="bg-neutral-500"
            onUpdate={handleUpdateStatus}
            onDelete={handleDeleteTask}
          />
          <KanbanColumn
            title="In-Progress"
            tasks={tasks.filter((t) => t.status === "In-Progress")}
            color="bg-blue-500"
            onUpdate={handleUpdateStatus}
            onDelete={handleDeleteTask}
          />
          <KanbanColumn
            title="Completed"
            tasks={tasks.filter((t) => t.status === "Done")}
            color="bg-emerald-500"
            onUpdate={handleUpdateStatus}
            onDelete={handleDeleteTask}
          />
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/80  z-100 transition-opacity duration-500 ${
          isActivityOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsActivityOpen(false)}
      />

      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-[#080808]/90 backdrop-blur-3xl border-l border-white/10 z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${
          isActivityOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <History size={18} className="text-accent" />
              </div>
              <div>
                <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
                  Project Pulse
                </h2>
                <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">
                  Live History
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsActivityOpen(false)}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all text-neutral-400 hover:text-white border border-white/5"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ActivityFeed key={activityKey} projectId={id} />
          </div>
        </div>
      </aside>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={id}
        onSuccess={() => {
          fetchProjectData();
          triggerActivityRefresh();
        }}
      />
    </div>
  );
}
