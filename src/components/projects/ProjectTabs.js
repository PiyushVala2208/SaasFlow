"use client";
import { useEffect } from "react";
import { motion, LayoutGroup } from "framer-motion";

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

  useEffect(() => {
    if (archivedCount === 0 && activeTab === "archived") {
      setActiveTab("active");
    }
  }, [archivedCount, activeTab, setActiveTab]);

  return (
    <div className="w-full border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex items-center min-w-max px-2 md:px-0 gap-1 md:gap-2">
        <LayoutGroup id="project-tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isDisabled = tab.id === "archived" && tab.count === 0;

            return (
              <button
                key={tab.id}
                disabled={isDisabled}
                onClick={() => !isDisabled && setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2.5 px-4 py-4 text-sm font-medium transition-all duration-300 tap-highlight-none outline-none whitespace-nowrap
                  ${isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"}
                  ${isDisabled ? "opacity-30 cursor-not-allowed grayscale" : "opacity-100"}
                `}
              >
                <span className="relative z-10">{tab.label}</span>

                <span
                  className={`relative z-10 rounded-md px-1.5 py-0.5 text-[10px] font-black transition-all duration-300 ${
                    isActive
                      ? "bg-violet-500/20 text-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.1)]"
                      : "bg-white/5 text-neutral-600 group-hover:text-neutral-400"
                  }`}
                >
                  {tab.count}
                </span>

                {isActive && (
                  <motion.div
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500 z-20"
                    style={{
                      boxShadow: "0 -4px 12px rgba(139,92,246,0.5), 0 0 8px rgba(139,92,246,0.3)",
                    }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 32,
                      mass: 1 
                    }}
                  />
                )}
              </button>
            );
          })}
        </LayoutGroup>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .tap-highlight-none {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </div>
  );
}