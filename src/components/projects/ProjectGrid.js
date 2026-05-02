"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectCard from "./ProjectCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

function EmptyWorkspace({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#050505] px-6 py-20 sm:px-12 sm:py-32"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="h-[250px] w-[250px] rounded-full bg-blue-600/5 blur-[100px] -mt-20" />
      </div>

      <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
        <div className="relative mb-12 h-40 w-64 rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-2xl backdrop-blur-sm">
          <div className="space-y-2">
            <div className="h-2 w-24 rounded-full bg-white/10" />
            <div className="h-2 w-32 rounded-full bg-white/5" />
            <div className="h-2 w-20 rounded-full bg-white/5" />
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 top-6 h-12 w-12 rounded-full bg-gradient-to-br from-blue-500/20 to-violet-500/20 blur-[2px] border border-white/10"
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-14 bottom-8 h-6 w-6 rounded-full bg-sky-500/10 blur-[1px] border border-white/10"
          />
        </div>

        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-neutral-500 antialiased">
          Empty workspace
        </p>

        <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Your canvas is waiting
        </h2>

        <p className="mt-4 max-w-[280px] sm:max-w-sm text-sm leading-relaxed text-neutral-500">
          Create a project to orchestrate tasks, invites, and momentum — owned
          by you or shared with your team.
        </p>

        <Button
          onClick={onCreate}
          className="mt-12 w-full sm:w-auto rounded-full bg-white px-10 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-black transition-all hover:scale-105 hover:bg-neutral-200 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
        >
          <Plus size={18} strokeWidth={3} className="mr-2" /> Create project
        </Button>
      </div>
    </motion.div>
  );
}

export default function ProjectGrid({
  projects,
  onCreateProject,
  onEdit,
  onRefresh,
}) {
  return (
    <div className="relative min-h-[400px] w-full pb-24">
      <AnimatePresence mode="wait">
        {!projects || projects.length === 0 ? (
          <EmptyWorkspace key="empty" onCreate={onCreateProject} />
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="w-full origin-center"
              >
                <ProjectCard
                  project={project}
                  onEdit={onEdit}
                  onSuccess={onRefresh}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
