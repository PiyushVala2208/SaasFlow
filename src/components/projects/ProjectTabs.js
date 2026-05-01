"use client";
import { motion } from "framer-motion";

export default function ProjectTabs({
  activeTab,
  setActiveTab,
  activeCount,
  completedCount,
  archivedCount,
}) {
  const tabs = [
    { id: "active", label: "Active", count: activeCount },
    { id: "completed", label: "Completed", count: completedCount },
    { id: "archived", label: "Archived", count: archivedCount },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-white/5 pb-px">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-all duration-200 
              ${isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"}`}
          >
            <span className="relative z-10">{tab.label}</span>

            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold transition-colors ${
                isActive
                  ? "bg-violet-500/10 text-violet-400"
                  : "bg-white/5 text-neutral-600 group-hover:text-neutral-400"
              }`}
            >
              {tab.count}
            </span>

            {isActive && (
              <motion.div
                layoutId="activeTabUnderline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.5)]"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
