"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, LayoutDashboard, Users, Settings, Briefcase, X } from "lucide-react";
import { useRouter } from "next/navigation";

const searchItems = [
  { name: "Overview", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Team Management", icon: Users, path: "/dashboard/team" },
  { name: "Projects", icon: Briefcase, path: "/dashboard/projects" },
  { name: "Settings", icon: Settings, path: "/dashboard/settings" },
];

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const navigateTo = (path) => {
    router.push(path);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
          >
            <div className="glass-card overflow-hidden border-white/10 shadow-2xl bg-[#0a0a0a]/90">
              <div className="flex items-center px-4 border-b border-white/5">
                <Search className="text-neutral-500" size={20} />
                <input
                  autoFocus
                  placeholder="Search actions or pages..."
                  className="w-full bg-transparent border-none outline-none py-4 px-3 text-sm text-white placeholder:text-neutral-600"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded border border-white/10 text-[10px] text-neutral-500">
                  ESC
                </div>
              </div>

              <div className="p-2 max-h-[300px] overflow-y-auto">
                <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600">
                  Quick Actions
                </p>
                {searchItems
                  .filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all text-neutral-400 hover:text-white group"
                    >
                      <div className="bg-white/5 p-2 rounded-lg group-hover:bg-accent/20 group-hover:text-accent transition-colors">
                        <item.icon size={18} />
                      </div>
                      <span className="text-sm font-medium">{item.name}</span>
                      <Command size={14} className="ml-auto opacity-20" />
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}