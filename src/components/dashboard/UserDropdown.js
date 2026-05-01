"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function UserDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.name || "Loading...",
    email: user?.email || "",
  });
  const dropdownRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const profile = data?.currentUser || data;
        if (isMounted && profile?.name) {
          setUserData({
            name: profile.name,
            email: profile.email || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    fetchUser();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name && name !== "Loading..."
      ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
      : "??";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 p-1.5 rounded-2xl transition-all border",
          isOpen 
            ? "bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
            : "hover:bg-white/5 border-transparent hover:border-white/10"
        )}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent via-accent/80 to-purple-600 border border-white/20 flex items-center justify-center text-[10px] font-black shadow-lg">
          {getInitials(userData.name)}
        </div>
        <ChevronDown
          size={14}
          className={cn("text-neutral-500 transition-transform duration-500 hidden sm:block", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className={cn(
              "absolute right-0 mt-3 w-64 z-[100] overflow-hidden rounded-[28px] border border-white/[0.08]",
              "bg-black/90 backdrop-blur-2xl", 
              "shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)]"
            )}
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative p-5 border-b border-white/[0.05] bg-white/[0.02]">
              <p className="text-sm font-bold text-white tracking-tight truncate">{userData.name}</p>
              <p className="text-[11px] text-neutral-500 truncate mt-0.5 font-medium">
                {userData.email}
              </p>
              
              <div className="mt-4 flex items-center gap-1.5 bg-accent/15 text-accent px-3 py-1.5 rounded-xl border border-accent/20 w-fit">
                <Sparkles size={11} className="fill-accent/20" />
                <span className="text-[9px] font-black uppercase tracking-[0.1em]">
                  Pro Member
                </span>
              </div>
            </div>

            <div className="relative p-2.5 space-y-1">
              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-[18px] transition-all group"
              >
                <div className="p-2 rounded-xl bg-white/5 border border-white/[0.05] group-hover:border-accent/30 group-hover:bg-accent/10 transition-all shadow-sm">
                  <User size={16} className="group-hover:text-accent transition-colors" />
                </div>
                <span className="font-semibold tracking-tight">Profile Settings</span>
              </Link>
              
              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm text-neutral-300 hover:text-white hover:bg-white/[0.06] rounded-[18px] transition-all group"
              >
                <div className="p-2 rounded-xl bg-white/5 border border-white/[0.05] group-hover:border-accent/30 group-hover:bg-accent/10 transition-all shadow-sm">
                  <Settings size={16} className="group-hover:text-accent transition-colors" />
                </div>
                <span className="font-semibold tracking-tight">Workspace</span>
              </Link>
            </div>

            <div className="relative p-2.5 border-t border-white/[0.05] bg-black/20">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-[18px] transition-all font-bold group"
                >
                  <div className="p-2 rounded-xl bg-red-500/5 group-hover:bg-red-500/10 transition-colors">
                    <LogOut size={16} />
                  </div>
                  Sign Out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}