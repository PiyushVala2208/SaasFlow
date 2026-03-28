"use client";
import { useState } from "react";
import { Bell, Search, Command } from "lucide-react";
import NotificationDrawer from "./NotificationDrawer";
import UserDropdown from "./UserDropdown"; // Naya component import kiya

export default function DashboardHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="h-16 border-b border-white/5 bg-[#050505]/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-40">
      
      {/* Search Bar - Global Search Trigger */}
      <div
        onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))}
        className="relative hidden sm:block cursor-pointer group"
      >
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-hover:text-neutral-300 transition-colors" size={16} />
        <div className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-xs text-neutral-500 w-64 flex justify-between items-center group-hover:border-white/20 transition-all">
          Search anything...
          <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">
            <Command size={10} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        
        {/* Notification Bell */}
        <button 
          onClick={() => setIsNotifOpen(true)}
          className="p-2 text-neutral-400 hover:text-white transition-colors relative"
        >
          <Bell size={20} />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-[#050505]"></span>
        </button>
        
        {/* User Profile Dropdown - Yahan naya component add kar diya */}
        <UserDropdown />
        
      </div>

      {/* Slide-out Drawer Component */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
    </header>
  );
}