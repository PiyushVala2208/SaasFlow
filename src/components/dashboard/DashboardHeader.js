"use client";
import { useState, useEffect, useRef } from "react";
import { Bell, Search, Command, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDrawer from "./NotificationDrawer";
import UserDropdown from "./UserDropdown";

export default function DashboardHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header 
      className={`h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-[#050505]/80 backdrop-blur-2xl" : "bg-[#050505]/40 backdrop-blur-xl"
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {!isMobileSearchOpen && (
          <button 
            onClick={() => setIsMobileSearchOpen(true)}
            className="p-2 sm:hidden text-neutral-400 hover:text-white transition-colors bg-white/5 rounded-lg active:scale-90"
          >
            <Search size={20} />
          </button>
        )}

        <AnimatePresence>
          {(isMobileSearchOpen || true) && (
            <motion.div
              initial={isMobileSearchOpen ? { opacity: 0, y: -10 } : {}}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "relative group max-w-md w-full sm:block",
                isMobileSearchOpen ? "fixed inset-x-4 top-3 z-50 sm:relative sm:inset-auto sm:top-auto" : "hidden"
              )}
            >
              <div className="absolute inset-0 bg-accent/5 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center">
                <Search className="absolute left-4 text-neutral-500 group-focus-within:text-accent transition-colors" size={16} />
                
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for anything..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-20 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-accent/30 focus:bg-white/[0.05] transition-all duration-300"
                />

                <div className="absolute right-3 flex items-center gap-2">
                  {isMobileSearchOpen ? (
                    <button 
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="p-1 hover:bg-white/10 rounded-md sm:hidden"
                    >
                      <X size={16} className="text-neutral-400" />
                    </button>
                  ) : (
                    <div className="hidden md:flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded-md border border-white/10 shadow-inner select-none">
                      <Command size={12} className="text-neutral-400" />
                      <span className="text-[10px] font-black tracking-tighter text-neutral-400">K</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className={cn("flex items-center gap-2 md:gap-4", isMobileSearchOpen && "hidden sm:flex")}>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsNotifOpen(true)}
          className="p-2.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-xl transition-all relative group"
        >
          <Bell size={22} strokeWidth={1.5} />
          <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent border-2 border-[#050505]"></span>
          </span>
          <div className="absolute inset-0 bg-accent/10 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>

        <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
        
        <div className="relative pl-2">
          <UserDropdown />
        </div>
      </div>

      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </header>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}