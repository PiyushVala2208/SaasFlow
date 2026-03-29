"use client";
import { useState, useEffect, useCallback } from "react";
import GlassCard from "@/components/ui/GlassCard";
import Button from "@/components/ui/Button";
import CreateProjectModal from "@/components/shared/CreateProjectModal";
import Link from "next/link";
import {
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const getStatusStyles = (status) => {
  switch (status) {
    case "Completed":
      return { color: "bg-emerald-500", text: "text-emerald-500" };
    case "On Hold":
      return { color: "bg-amber-500", text: "text-amber-500" };
    case "Archived":
      return { color: "bg-neutral-500", text: "text-neutral-500" };
    default:
      return { color: "bg-blue-500", text: "text-blue-500" }; // In Progress / Active
  }
};

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
      setProjects(data);
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Active Projects</h1>
          <p className="text-neutral-500 mt-1">
            Track and manage your workspace deliverables.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} /> New Project
        </Button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-accent" size={40} />
          <p className="text-neutral-500 animate-pulse">
            Fetching workspace data...
          </p>
        </div>
      )}

      {error && (
        <div className="p-6 border border-red-500/20 bg-red-500/5 rounded-2xl flex items-center gap-4 text-red-400">
          <AlertCircle size={24} />
          <p>Error: {error}. Please try again later.</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const styles = getStatusStyles(project.status);

            return (
              <Link
                key={project._id}
                href={`/dashboard/projects/${project._id}`}
              >
                <GlassCard className="p-6 border-white/5 relative group cursor-pointer hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`w-10 h-10 rounded-xl ${styles.color} bg-opacity-20 border border-white/10 flex items-center justify-center`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${styles.color} animate-pulse`}
                      />
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault(); /* yahan menu logic ayega */
                      }}
                      className="text-neutral-500 hover:text-white transition-colors"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold mb-1 group-hover:text-accent transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-neutral-500 mb-6 truncate">
                    {project.description || "No description provided"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-neutral-400">Progress</span>
                      <span>{project.progress || 0}%</span>
                    </div>

                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${styles.color} transition-all duration-1000 ease-out`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                      {project.status === "Completed" ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <Clock size={14} />
                      )}
                      {project.status}
                    </div>

                    <div className="flex -space-x-2">
                      {(project.members?.length > 0
                        ? project.members
                        : [1, 2]
                      ).map((member, i) => (
                        <img
                          key={member._id || i}
                          className="w-6 h-6 rounded-full border-2 border-[#050505] object-cover"
                          src={`https://ui-avatars.com/api/?name=${member.name || "User"}&background=random&color=fff`}
                          alt="avatar"
                        />
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && projects.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-neutral-500">
            No projects found. Create your first one to get started!
          </p>
        </div>
      )}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchProjects}
      />
    </div>
  );
}
