"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import {
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Pencil,
  Trash2,
  Archive,
  Calendar,
  CheckCircle,
} from "lucide-react";
import {
  getStatusStyles,
  buildTeamStack,
  ROLE_BADGE,
  avatarUrl,
  PRIORITY_STYLES,
} from "./ProjectUtils";
import { PROJECT_LIFECYCLE_EVENTS } from "@/lib/projectLifecycle";

export default function ProjectCard({ project, onEdit, onSuccess }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const menuRef = useRef(null);
  const router = useRouter();

  const styles = getStatusStyles(project.status);
  const priority = PRIORITY_STYLES[project.priority] || PRIORITY_STYLES.Medium;
  const team = buildTeamStack(project);
  const role = project.membershipRole || "Editor";
  const badgeClass = ROLE_BADGE[role] || ROLE_BADGE.Editor;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleCardClick = () => {
    if (!menuOpen && !isDeleting) {
      router.push(`/dashboard/projects/${project._id}`);
    }
  };

  const handleComplete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyCompleted = project.status === "Completed";
    const lifecycleEvent = isCurrentlyCompleted
      ? PROJECT_LIFECYCLE_EVENTS.MANUAL_REOPEN
      : PROJECT_LIFECYCLE_EVENTS.MANUAL_COMPLETE;

    try {
      setMenuOpen(false);
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lifecycleEvent,
          progress: project.progress,
        }),
      });

      if (res.ok) {
        const updatedProject = await res.json().catch(() => null);
        const progressBase = Number(project.progress) || 0;
        const reopenProgress = progressBase >= 100 ? 99 : progressBase;
        const normalizedProject = isCurrentlyCompleted
          ? {
              ...project,
              ...updatedProject,
              status: "Active",
              progress: reopenProgress,
              autoCompleteBlocked: true,
            }
          : updatedProject || project;

        if (!isCurrentlyCompleted) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#8B5CF6", "#10B981", "#ffffff"],
          });
        } else {
          toast.success(
            "Project reopened at 99% and moved to Active. Add a new task to keep progress healthy.",
          );
        }
        if (onSuccess) {
          onSuccess(
            isCurrentlyCompleted
              ? {
                  switchTab: "active",
                  project: normalizedProject,
                  projectId: project._id,
                }
              : {
                  project: normalizedProject,
                  projectId: project._id,
                  suppressAutoCelebrate: true,
                },
          );
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData?.error || "Unable to update project lifecycle.");
      }
    } catch (err) {
      console.error("COMPLETE_ERROR:", err);
      toast.error("Network error while updating project.");
    }
  };

  const handleArchive = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isCurrentlyArchived = project.status?.toLowerCase() === "archived";
    const lifecycleEvent = isCurrentlyArchived
      ? PROJECT_LIFECYCLE_EVENTS.UNARCHIVE
      : PROJECT_LIFECYCLE_EVENTS.ARCHIVE;
    try {
      setMenuOpen(false);
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lifecycleEvent,
          progress: project.progress,
        }),
      });
      if (res.ok && onSuccess) {
        const updatedProject = await res.json().catch(() => null);
        const normalizedProject = isCurrentlyArchived
          ? {
              ...project,
              ...updatedProject,
              status: "Active",
              autoCompleteBlocked: true,
            }
          : updatedProject || project;

        onSuccess(
          isCurrentlyArchived
            ? {
                switchTab: "active",
                project: normalizedProject,
                projectId: project._id,
              }
            : { project: normalizedProject, projectId: project._id },
        );
      }
    } catch (err) {
      console.error("ARCHIVE_ERROR:", err);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });
      if (res.ok && onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setMenuOpen(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleCardClick}
      className="cursor-pointer outline-none"
    >
      <motion.article
        whileHover={!menuOpen ? { y: -6 } : {}}
        className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/3 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/15 ${styles.glow} ${isDeleting ? "opacity-50 grayscale pointer-events-none" : ""}`}
      >
        <div className="relative z-20 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 ${styles.color} bg-opacity-10`}
            >
              <span
                className={`h-2 w-2 rounded-full ${styles.color} shadow-[0_0_12px_currentColor]`}
              />
            </div>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeClass}`}
            >
              {role}
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className={`rounded-lg p-1.5 transition-colors ${menuOpen ? "bg-white/10 text-white" : "text-neutral-500 hover:bg-white/5 hover:text-white"}`}
            >
              <MoreHorizontal size={20} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full z-100 mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-[#0A0A0A] p-1.5 shadow-2xl backdrop-blur-xl"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(project);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Pencil size={14} /> Edit Details
                  </button>

                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <CheckCircle
                      size={14}
                      className={
                        project.status === "Completed" ? "text-emerald-400" : ""
                      }
                    />
                    {project.status === "Completed"
                      ? "Re-open Project"
                      : "Mark Completed"}
                  </button>

                  <button
                    type="button"
                    onClick={handleArchive}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-neutral-400 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Archive size={14} />
                    {project.status === "Archived" ? "Unarchive" : "Archive"}
                  </button>

                  <div className="my-1 h-px bg-white/5" />

                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-rose-500 transition-colors hover:bg-rose-500/10"
                  >
                    <Trash2 size={14} />
                    {isDeleting ? "Deleting..." : "Delete Project"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative z-10 mt-5 flex-1">
          <h3 className="text-lg font-semibold tracking-tight text-white transition-colors group-hover:text-violet-200">
            {project.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
            {project.description || "No description"}
          </p>
        </div>

        <div className="relative z-10 mt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              Velocity
            </span>
            <div
              className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priority.base}`}
            >
              <span className={`h-1 w-1 rounded-full ${priority.dot}`} />
              {project.priority || "Medium"}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            <span>Progress</span>{" "}
            <span className={styles.text}>{project.progress || 0}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/4">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress || 0}%` }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className={`h-full ${styles.color}`}
            />
          </div>
        </div>

        <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-5">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
            {project.status === "Completed" ? (
              <CheckCircle2 size={14} className="text-emerald-400" />
            ) : (
              <Clock size={14} className="text-sky-400" />
            )}
            {project.status}
          </div>
          {project.deadline && (
            <div className="flex items-center gap-1.5 text-[9px] font-medium text-neutral-400">
              <Calendar size={12} className="text-violet-400/70" />
              <span>
                Due:{" "}
                {new Date(project.deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
          <div className="flex items-center pl-1">
            {team.map((entry, i) => (
              <img
                key={entry.key}
                src={avatarUrl(entry.user)}
                alt=""
                className="h-8 w-8 rounded-full border-2 border-[#050505] object-cover ring-1 ring-white/10"
                style={{ marginLeft: i === 0 ? 0 : -10 }}
              />
            ))}
          </div>
        </div>
      </motion.article>
    </motion.div>
  );
}
