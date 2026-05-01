"use client";
import { useState } from "react";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamFilters({ search, setSearch, roleFilter, setRoleFilter }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const roles = ["All", "Admin", "Manager", "Employee", "Pending"];

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-4 justify-between">
      
      <div className="relative w-full md:max-w-xs group">
        <Search 
          className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 group-focus-within:text-white transition-colors" 
          size={16} 
        />
        <input
          type="text"
          placeholder="Search team..."
          className="w-full bg-[#0A0A0A] border border-white/[0.08] rounded-2xl py-3 pl-11 pr-4 text-sm text-neutral-200 focus:outline-none focus:border-white/20 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="hidden md:flex bg-[#0A0A0A] border border-white/[0.08] p-1 rounded-2xl gap-1">
        {roles.map((r) => {
          const isActive = roleFilter === r;
          return (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`relative px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                isActive ? "text-white" : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-[#1A1A1A] border border-white/10 shadow-lg"
                  style={{ borderRadius: "12px" }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{r}</span>
            </button>
          );
        })}
      </div>

      <div className="md:hidden w-full relative">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl border transition-all duration-300 ${
            isFilterOpen 
            ? "bg-white text-black border-white" 
            : "bg-[#0A0A0A] text-neutral-400 border-white/[0.08]"
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Filter: {roleFilter}</span>
          </div>
          <motion.div animate={{ rotate: isFilterOpen ? 180 : 0 }}>
             <X size={16} className={!isFilterOpen ? "opacity-0" : "opacity-100"} />
          </motion.div>
        </button>

        <AnimatePresence>
          {isFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsFilterOpen(false)}
                className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 left-0 mt-3 z-50 bg-[#121212] border border-white/[0.1] rounded-[2.5rem] p-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden"
              >
                <div className="space-y-1">
                  {roles.map((r) => {
                    const isActive = roleFilter === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setRoleFilter(r);
                          setTimeout(() => setIsFilterOpen(false), 240);
                        }}
                        className={`w-full flex items-center justify-between px-5 py-4 rounded-[1.5rem] text-sm font-bold transition-all ${
                          isActive 
                          ? "bg-white/[0.08] text-white" 
                          : "text-neutral-500 active:bg-white/[0.03]"
                        }`}
                      >
                        <span className="uppercase tracking-widest text-[11px]">{r}</span>
                        {isActive && (
                          <motion.div layoutId="mobileCheck">
                            <Check size={18} className="text-white" />
                          </motion.div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}