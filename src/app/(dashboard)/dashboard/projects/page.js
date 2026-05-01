"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Button from "@/components/ui/Button";
import CreateProjectModal from "@/components/shared/CreateProjectModal";
import ProjectGrid from "@/components/projects/ProjectGrid";
import ProjectTabs from "@/components/projects/ProjectTabs";
import { Plus, Loader2, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("active");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);
  const hasHydratedProjectsRef = useRef(false);
  const previousProjectsRef = useRef([]);

  const fetchProjects = useCallback(async (silent = false, options = {}) => {
    try {
      if (!silent) setLoading(true);
      else setIsSyncing(true);

      const res = await fetch("/api/projects", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();

      const nextProjects = Array.isArray(data) ? data : [];

      if (hasHydratedProjectsRef.current && !options?.suppressAutoCelebrate) {
        const previousById = new Map(
          previousProjectsRef.current.map((item) => [String(item._id), item]),
        );

        const autoCompletedProjects = nextProjects.filter((item) => {
          const previous = previousById.get(String(item._id));
          return (
            previous &&
            previous.status !== "Completed" &&
            item.status === "Completed"
          );
        });

        if (autoCompletedProjects.length > 0) {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.62 },
            colors: ["#10B981", "#8B5CF6", "#ffffff"],
          });

          const singleName = autoCompletedProjects[0]?.name || "Project";
          const completionText =
            autoCompletedProjects.length === 1
              ? `${singleName} reached 100% and moved to Completed.`
              : `${autoCompletedProjects.length} projects reached 100% and moved to Completed.`;

          toast.success(completionText);
        }
      }

      setProjects(nextProjects);
      previousProjectsRef.current = nextProjects;
      if (!hasHydratedProjectsRef.current) {
        hasHydratedProjectsRef.current = true;
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEdit = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const refreshProjects = useCallback(
    async (options = {}) => {
      if (options?.project) {
        setProjects((prev) => {
          const next = prev.map((item) =>
            String(item._id) === String(options.project._id)
              ? options.project
              : item,
          );

          const exists = next.some(
            (item) => String(item._id) === String(options.project._id),
          );

          return exists ? next : [options.project, ...next];
        });
      }

      if (options?.switchTab) {
        setActiveTab(options.switchTab);
      }

      await fetchProjects(true, {
        suppressAutoCelebrate: options?.suppressAutoCelebrate,
      });
    },
    [fetchProjects],
  );

  const { filteredProjects, counts } = useMemo(() => {
    const active = projects.filter(
      (p) => p.status === "Active" || p.status === "On Hold",
    );
    const completed = projects.filter((p) => p.status === "Completed");
    const archived = projects.filter((p) => p.status === "Archived");

    let display;
    if (activeTab === "active") display = active;
    else if (activeTab === "completed") display = completed;
    else display = archived;

    return {
      filteredProjects: display,
      counts: {
        active: active.length,
        completed: completed.length,
        archived: archived.length,
      },
    };
  }, [projects, activeTab]);

  return (
    <div className="min-h-[calc(100vh-6rem)] rounded-3xl border border-white/10 bg-[#050505] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="relative">
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl flex items-center gap-4">
              Projects
              {isSyncing && (
                <Loader2
                  className="animate-spin text-violet-500/50"
                  size={20}
                />
              )}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
              Owned workspaces and projects where you have been orchestrated.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shrink-0 gap-2 self-start sm:self-auto"
          >
            <Plus size={18} strokeWidth={2.5} />
            New project
          </Button>
        </header>

        <ProjectTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeCount={counts.active}
          completedCount={counts.completed}
          archivedCount={counts.archived}
        />

        {loading && !isSyncing && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <Loader2
              className="animate-spin text-violet-400"
              size={40}
              strokeWidth={1.25}
            />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-neutral-500">
              Syncing workspace
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-red-300">
            <AlertCircle className="mt-0.5 shrink-0" size={22} />
            <p className="text-sm">{error}. Please try again later.</p>
          </div>
        )}

        {!loading && !error && (
          <ProjectGrid
            projects={filteredProjects}
            onCreateProject={() => setIsModalOpen(true)}
            onEdit={handleEdit}
            onRefresh={refreshProjects}
          />
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={() => refreshProjects()}
        projectData={selectedProject}
      />
    </div>
  );
}
