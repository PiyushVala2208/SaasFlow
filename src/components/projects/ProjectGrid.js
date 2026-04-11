"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Plus,
  MoreHorizontal,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Button from "@/components/ui/Button";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 380, damping: 28 },
  },
};

const ROLE_BADGE = {
  Owner: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Admin: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  Editor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  Viewer: "bg-neutral-500/10 text-neutral-400 border-white/10",
};

function avatarUrl(user) {
  if (user?.image) return user.image;
  const name =
    typeof user === "object" && user?.name ? user.name : "Member";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a1a1a&color=f5f5f5&bold=true`;
}

function buildTeamStack(project) {
  const out = [];
  const seen = new Set();

  const pushUser = (u, key) => {
    if (!u) return;
    const id =
      typeof u === "object" && u._id != null ? String(u._id) : String(u);
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ key, user: typeof u === "object" ? u : { _id: u, name: "?" } });
  };

  if (project.owner) pushUser(project.owner, "owner");

  for (const m of project.members || []) {
    if (m.user) pushUser(m.user, m.user._id ?? m.user);
  }

  return out.slice(0, 8);
}

const getStatusStyles = (status, progress) => {
  if (progress === 100) {
    return {
      color: "bg-emerald-500",
      text: "text-emerald-400",
      glow: "shadow-[0_0_24px_rgba(16,185,129,0.15)]",
    };
  }
  switch (status) {
    case "Completed":
      return {
        color: "bg-emerald-500",
        text: "text-emerald-400",
        glow: "",
      };
    case "On Hold":
      return {
        color: "bg-amber-500",
        text: "text-amber-400",
        glow: "",
      };
    case "Archived":
      return {
        color: "bg-neutral-500",
        text: "text-neutral-400",
        glow: "",
      };
    default:
      return {
        color: "bg-blue-500",
        text: "text-blue-400",
        glow: "shadow-[0_0_20px_rgba(59,130,246,0.12)]",
      };
  }
};

function EmptyWorkspace({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] px-6 py-20 sm:px-12 sm:py-24"
    >
      <div
        className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-sky-500/10 blur-[90px]"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="relative mb-10 h-40 w-full max-w-xs sm:h-48">
          <svg
            viewBox="0 0 320 200"
            className="h-full w-full text-white/10"
            aria-hidden
          >
            <rect
              x="24"
              y="32"
              width="272"
              height="136"
              rx="16"
              fill="currentColor"
              className="text-white/[0.06]"
            />
            <rect
              x="40"
              y="52"
              width="88"
              height="10"
              rx="5"
              fill="currentColor"
              className="text-white/20"
            />
            <rect
              x="40"
              y="72"
              width="160"
              height="8"
              rx="4"
              fill="currentColor"
              className="text-white/10"
            />
            <rect
              x="40"
              y="92"
              width="120"
              height="8"
              rx="4"
              fill="currentColor"
              className="text-white/10"
            />
            <circle cx="248" cy="72" r="28" fill="url(#g1)" opacity="0.35" />
            <circle cx="200" cy="120" r="16" fill="url(#g1)" opacity="0.25" />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_0_40px_rgba(167,139,250,0.12)] backdrop-blur-md sm:h-20 sm:w-20">
              <Sparkles className="text-violet-300/90" size={32} strokeWidth={1.25} />
            </div>
          </div>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
          Empty workspace
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Your canvas is waiting
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
          Create a project to orchestrate tasks, invites, and momentum — owned
          by you or shared with your team.
        </p>
        <Button
          onClick={onCreate}
          className="mt-10 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          <Plus size={18} strokeWidth={2.5} />
          Create project
        </Button>
      </div>
    </motion.div>
  );
}

export default function ProjectGrid({ projects, onCreateProject }) {
  if (!projects.length) {
    return <EmptyWorkspace onCreate={onCreateProject} />;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3"
    >
      {projects.map((project) => {
        const styles = getStatusStyles(project.status, project.progress);
        const team = buildTeamStack(project);
        const role = project.membershipRole || "Editor";
        const badgeClass =
          ROLE_BADGE[role] || ROLE_BADGE.Editor;

        return (
          <motion.div key={project._id} variants={cardVariants}>
            <Link
              href={`/dashboard/projects/${project._id}`}
              className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-violet-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            >
              <motion.article
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 420, damping: 22 }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-[box-shadow] duration-300 hover:border-white/15 hover:shadow-[0_28px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.06),0_0_60px_rgba(139,92,246,0.08)] ${styles.glow}`}
              >
                <div
                  className={`pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--x,50%) var(--y,0%), rgba(139,92,246,0.06), transparent 40%)",
                  }}
                />

                <div className="relative z-10 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] ${styles.color} bg-opacity-10`}
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
                  <button
                    type="button"
                    onClick={(e) => e.preventDefault()}
                    className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Project menu"
                  >
                    <MoreHorizontal size={20} />
                  </button>
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
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    <span>Velocity</span>
                    <span className={styles.text}>{project.progress || 0}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/10 bg-white/[0.04]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress || 0}%` }}
                      transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`h-full ${styles.color}`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-neutral-600">
                    <span>{project.completedTasks || 0} done</span>
                    <span>
                      {(project.totalTasks || 0) - (project.completedTasks || 0)}{" "}
                      open
                    </span>
                  </div>
                </div>

                <div className="relative z-10 mt-6 flex items-center justify-between border-t border-white/10 pt-5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    {project.progress === 100 ? (
                      <CheckCircle2 size={14} className="text-emerald-400" />
                    ) : (
                      <Clock size={14} className="text-sky-400" />
                    )}
                    {project.progress === 100 ? "Finalized" : project.status}
                  </div>

                  <div className="flex items-center pl-1">
                    {team.map((entry, i) => (
                      <img
                        key={entry.key}
                        src={avatarUrl(entry.user)}
                        alt=""
                        className="h-8 w-8 rounded-full border-2 border-[#050505] object-cover ring-1 ring-white/10 transition-transform duration-300 group-hover:ring-white/20"
                        style={{ marginLeft: i === 0 ? 0 : -10 }}
                        title={entry.user?.name || "Member"}
                      />
                    ))}
                  </div>
                </div>
              </motion.article>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
