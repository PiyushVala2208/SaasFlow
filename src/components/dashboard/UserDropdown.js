"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, ChevronDown, Sparkles } from "lucide-react";
import Link from "next/link";
import { logout } from "@/app/actions";

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

    return () => {
      isMounted = false;
    };
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
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2)
      : "??";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10 group"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-purple-500 border border-white/20 flex items-center justify-center text-[10px] font-bold">
          {getInitials(userData.name)}
        </div>
        <ChevronDown
          size={14}
          className={`text-neutral-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 mt-2 w-56 glass-card border-white/10 shadow-2xl z-50 overflow-hidden bg-[#0a0a0a]/90 backdrop-blur-2xl"
          >
            {/* User Info Header */}
            <div className="p-4 border-b border-white/5 bg-white/[0.02]">
              <p className="text-sm font-bold text-white">{userData.name}</p>
              <p className="text-[10px] text-neutral-500 truncate">
                {userData.email}
              </p>
              <div className="mt-2 flex items-center gap-1.5 bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20 w-fit">
                <Sparkles size={10} />
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  Pro Member
                </span>
              </div>
            </div>

            {/* Links */}
            <div className="p-1.5">
              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
              >
                <User size={16} className="group-hover:text-accent" />
                Profile Settings
              </Link>
              <Link
                href="/dashboard/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-all group"
              >
                <Settings size={16} className="group-hover:text-accent" />
                Workspace
              </Link>
            </div>

            {/* Logout */}
            <div className="p-1.5 border-t border-white/5">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                >
                  <LogOut size={16} />
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
