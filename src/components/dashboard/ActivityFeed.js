"use client";
import { motion } from "framer-motion";
import { GitCommit, Plus, Trash2, Edit3, UserCircle } from "lucide-react";

const activities = [
  { id: 1, user: "John Doe", action: "created new project", target: "Brand Redesign", time: "12m ago", icon: Plus, color: "text-blue-500" },
  { id: 2, user: "Sarah Smith", action: "deleted task", target: "Old Assets", time: "45m ago", icon: Trash2, color: "text-red-500" },
  { id: 3, user: "System", action: "updated server to", target: "v2.0.4", time: "2h ago", icon: GitCommit, color: "text-purple-500" },
  { id: 4, user: "Mike Ross", action: "edited role of", target: "Rachel Zane", time: "5h ago", icon: Edit3, color: "text-amber-500" },
];

export default function ActivityFeed() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <UserCircle size={20} className="text-accent" />
        Recent Activity
      </h3>
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:via-white/5 before:to-transparent">
        {activities.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.id} 
            className="relative flex items-center gap-6"
          >
            <div className={`absolute left-0 w-10 h-10 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 ${item.color} shadow-xl`}>
              <item.icon size={16} />
            </div>
            <div className="ml-12">
              <p className="text-sm text-neutral-300">
                <span className="font-bold text-white">{item.user}</span> {item.action} <span className="text-accent">{item.target}</span>
              </p>
              <p className="text-[10px] text-neutral-600 font-medium uppercase mt-1 tracking-widest">{item.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}