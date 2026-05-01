"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Zap, Bug, Sparkles, Rocket, Clock } from "lucide-react";

const changes = [
  {
    version: "v2.4.0",
    date: "February 2026",
    title: "The Intelligence Update",
    type: "Major",
    icon: Sparkles,
    content:
      "Launched AI-driven analytics and real-time team collaboration sync. Improved dashboard load times by 40%.",
    tags: ["AI", "Performance", "Analytics"],
  },
  {
    version: "v2.3.2",
    date: "January 2026",
    title: "Liquid UI Enhancements",
    type: "Improvement",
    icon: Zap,
    content:
      "Refined glassmorphism effects and added new command palette shortcuts for power users.",
    tags: ["UI/UX", "Shortcuts"],
  },
  {
    version: "v2.2.0",
    date: "December 2025",
    title: "Security Hardening",
    type: "Major",
    icon: Rocket,
    content:
      "Implemented end-to-end encryption for team chats and multi-factor authentication (MFA) via hardware keys.",
    tags: ["Security", "Encryption"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function ChangelogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[5%] left-[-10%] w-[300px] h-[300px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="pt-24 md:pt-32 pb-16 md:pb-20 px-4 md:px-6 max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="mb-16 md:mb-24 text-center">
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-4"
            >
              <Clock size={12} className="text-accent" />
              Release History
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4"
            >
              Product <span className="text-accent ">Updates</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-neutral-500 italic text-sm md:text-base"
            >
              Tracking our journey to build the ultimate workspace.
            </motion.p>
          </div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-4 md:before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-accent before:via-white/10 before:to-transparent">
            {changes.map((item, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                viewport={{ once: true, margin: "-100px" }}
                className="relative pl-10 md:pl-16 group"
              >
                <div className="absolute left-0 md:left-0.5 w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#050505] border border-white/10 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.2)] group-hover:border-accent/50 group-hover:shadow-accent/40 transition-all duration-500">
                  <item.icon size={16} className="text-accent md:w-[18px]" />
                </div>

                <GlassCard className="p-6 md:p-8 border-white/5 hover:border-accent/10 transition-all duration-500 group-hover:bg-white/[0.03]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 md:gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] md:text-xs font-black text-accent uppercase tracking-[0.2em]">
                          {item.version}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-accent/10 text-accent uppercase">
                          {item.type}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mt-1 text-white group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[10px] md:text-xs text-neutral-500 font-mono">
                      {item.date}
                    </span>
                  </div>

                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-6">
                    {item.content}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[9px] md:text-[10px] text-neutral-500 font-bold uppercase tracking-wider group-hover:border-white/20 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
