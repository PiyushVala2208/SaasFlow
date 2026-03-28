"use client";
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { Rocket, Zap, Bug, Sparkles } from "lucide-react";

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
];

export default function ChangelogPage() {
  return (
    <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
      <div className="mb-20 text-center">
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4">
          Product <span className="text-accent">Updates</span>
        </h1>
        <p className="text-neutral-500 italic">
          Tracking our journey to build the ultimate workspace.
        </p>
      </div>

      <div className="relative space-y-16 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-linear-to-b before:from-accent before:via-white/10 before:to-transparent">
        {changes.map((item, i) => (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            key={i}
            className="relative pl-12"
          >
            {/* Timeline Dot */}
            <div className="absolute left-0 w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              <item.icon size={18} className="text-accent" />
            </div>

            <GlassCard className="p-8 border-white/5 hover:border-white/10 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-accent uppercase tracking-widest">
                    {item.version}
                  </span>
                  <h3 className="text-2xl font-bold mt-1">{item.title}</h3>
                </div>
                <span className="text-xs text-neutral-500 font-medium">
                  {item.date}
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed mb-6">
                {item.content}
              </p>
              <div className="flex gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-neutral-500 font-bold uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
