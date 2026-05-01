"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Plus, ArrowLeft, History, X, UserPlus } from "lucide-react";
import Button from "@/components/ui/Button";
import AddTaskModal from "@/components/shared/AddTaskModal";
import KanbanColumn from "@/components/shared/KanbanColumn";
import ActivityFeed from "@/components/projects/ActivityFeed";
import StatsGrid from "@/components/projects/StatsGrid";
import InviteModal from "@/components/projects/InviteModal";
import TaskDetailModal from "@/components/tasks/TaskDetailModal";
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

const normalizeUser = (entity) => {
  const base = entity?.user ? entity.user : entity;
  const userId = getUserId(entity);
  if (!userId) return null;

  return {
    _id: userId,
    name: base?.name || entity?.name || "User",
    email: base?.email || entity?.email || "",
    image: base?.image || entity?.image || "",
  };
};

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [activityKey, setActivityKey] = useState(0);
  const [statsKey, setStatsKey] = useState(0);

  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const assignableMembers = useMemo(() => {
    const merged = [
      ...(Array.isArray(project?.members) ? project.members : []),
      ...(project?.owner ? [project.owner] : []),
      ...(Array.isArray(allUsers) ? allUsers : []),
    ];

    const unique = new Map();
    for (const entry of merged) {
      const normalized = normalizeUser(entry);
      if (normalized && !unique.has(normalized._id)) {
        unique.set(normalized._id, normalized);
      }
    }

    return Array.from(unique.values());
  }, [project, allUsers]);

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectRes, tasksRes, usersRes] = await Promise.all([
        fetch(`/api/projects/${id}`),
        fetch(`/api/tasks?projectId=${id}`),
        fetch("/api/user"),
      ]);

      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProject(projectData);
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setAllUsers(
          Array.isArray(usersData?.allUsers) ? usersData.allUsers : [],
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const triggerActivityRefresh = () => {
    setActivityKey((prev) => prev + 1);
    setStatsKey((prev) => prev + 1);
  };

  const handleUpdateTaskDetails = async (taskId, updatedFields) => {
    const taskIdStr = String(taskId);
    const originalTasks = [...tasks];
    const originalSelected = selectedTask;

    const currentTask = tasks.find((t) => String(t._id) === taskIdStr);
    if (!currentTask) return;

    const normalizedUpdatedFields = { ...updatedFields };
    if (Object.prototype.hasOwnProperty.call(normalizedUpdatedFields, "tags")) {
      normalizedUpdatedFields.tags = normalizeTaskTags(
        normalizedUpdatedFields.tags,
      );
    }

    const mergedTaskData = { ...currentTask, ...normalizedUpdatedFields };

    setTasks((prev) =>
      prev.map((t) => (String(t._id) === taskIdStr ? mergedTaskData : t)),
    );

    if (String(selectedTask?._id) === taskIdStr) {
      setSelectedTask(mergedTaskData);
    }

    try {
      const payload = { ...updatedFields };

      if (payload.assignedTo && Array.isArray(payload.assignedTo)) {
        payload.assignedTo = payload.assignedTo
          .map((member) => getUserId(member))
          .filter(Boolean);
      }

      if (Object.prototype.hasOwnProperty.call(payload, "tags")) {
        payload.tags = normalizeTaskTags(payload.tags);
      }

      const res = await fetch(`/api/tasks/${taskIdStr}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updatedTaskFromDB = await res.json();

        setTasks((prev) =>
          prev.map((t) =>
            String(t._id) === taskIdStr ? updatedTaskFromDB : t,
          ),
        );

        setSelectedTask((prev) => {
          if (!prev) return null;
          return String(prev._id) === taskIdStr ? updatedTaskFromDB : prev;
        });

        triggerActivityRefresh();
        return updatedTaskFromDB;
      } else {
        throw new Error("Sync failed");
      }
    } catch (err) {
      setTasks(originalTasks);
      setSelectedTask(originalSelected);
      console.error("Update failed:", err);
    }
  };

  const handleUpdateStatus = async (taskId, statusInput) => {
    const statusMap = {
      "TO-DO": "To-Do",
      "IN-PROGRESS": "In-Progress",
      DONE: "Done",
      "To-Do": "To-Do",
      "In-Progress": "In-Progress",
      Done: "Done",
    };

    const rawStatus =
      typeof statusInput === "object" ? statusInput.status : statusInput;

    const finalStatus = statusMap[rawStatus] || rawStatus;

    console.log("Updating to:", finalStatus);
    await handleUpdateTaskDetails(taskId, { status: finalStatus });
  };

  const handleDeleteTask = async (taskId) => {
    const taskIdStr = String(taskId);
    const originalTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => String(t._id) !== taskIdStr));

    try {
      const res = await fetch(`/api/tasks/${taskIdStr}`, { method: "DELETE" });
      if (!res.ok) {
        setTasks(originalTasks);
      } else {
        if (String(selectedTask?._id) === taskIdStr) setIsDetailOpen(false);
        triggerActivityRefresh();
      }
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
              onClick={() => setIsInviteOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/5 transition-all"
            >
              <UserPlus size={16} className="text-neutral-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                Invite
              </span>
            </button>

            <button
              onClick={() => setIsActivityOpen(true)}
              className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all duration-300"
            >
              <History
                size={18}
                className="text-neutral-400 group-hover:text-accent"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
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

        <StatsGrid projectId={id} refreshKey={statsKey} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {["To-Do", "In-Progress", "Done"].map((status) => (
            <KanbanColumn
              key={status}
              title={status}
              tasks={tasks.filter((t) => t.status === status)}
              color={
                status === "To-Do"
                  ? "bg-neutral-500"
                  : status === "In-Progress"
                    ? "bg-blue-500"
                    : "bg-emerald-500"
              }
              onUpdate={handleUpdateStatus}
              onDelete={handleDeleteTask}
              onTaskClick={(task) => {
                setSelectedTask(task);
                setIsDetailOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <InviteModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        projectId={id}
        onInviteSuccess={fetchProjectData}
      />

      <div
        className={`fixed inset-0 bg-black/80 z-100 transition-opacity duration-500 ${isActivityOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setIsActivityOpen(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[380px] bg-[#080808]/90 backdrop-blur-3xl border-l border-white/10 z-[110] transform transition-transform duration-500 ${isActivityOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-white">
              Project Pulse
            </h2>
            <button
              onClick={() => setIsActivityOpen(false)}
              className="p-2.5 text-neutral-400 hover:text-white"
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

      <TaskDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        task={selectedTask}
        onUpdate={handleUpdateTaskDetails}
        onDelete={handleDeleteTask}
        members={assignableMembers}
      />
    </div>
  );
}
