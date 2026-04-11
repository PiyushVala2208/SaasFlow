"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";
import CreateProjectModal from "@/components/shared/CreateProjectModal";
import ProjectGrid from "@/components/projects/ProjectGrid";
import { Plus, Loader2, AlertCircle } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <div className="min-h-[calc(100vh-6rem)] rounded-3xl border border-white/10 bg-[#050505] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
              Workspace
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Projects
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-500">
              Owned workspaces and projects where you have been invited — one
              orchestrated grid.
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

        {loading && (
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
            <p className="text-sm">
              {error}. Please try again later.
            </p>
          </div>
        )}

        {!loading && !error && (
          <ProjectGrid
            projects={projects}
            onCreateProject={() => setIsModalOpen(true)}
          />
        )}
      </div>

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
