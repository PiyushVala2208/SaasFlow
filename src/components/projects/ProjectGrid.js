"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import ProjectCard from "./ProjectCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

function EmptyWorkspace({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#050505] px-6 py-20 sm:px-12 sm:py-24"
    >
      <div className="relative mx-auto flex max-w-lg flex-col items-center text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-neutral-500">
          Empty workspace
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Your canvas is waiting
        </h2>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
          Create a project to orchestrate tasks and accelerate your vision.
        </p>
        <Button
          onClick={onCreate}
          className="mt-10 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em]"
        >
          <Plus size={18} strokeWidth={2.5} /> Create project
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
    <div className="relative min-h-100">
      <AnimatePresence mode="wait">
        {!projects.length ? (
          <EmptyWorkspace key="empty" onCreate={onCreateProject} />
        ) : (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div
                key={project._id}
                layout 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
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
