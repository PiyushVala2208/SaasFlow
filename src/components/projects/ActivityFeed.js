"use client";
import { useState, useEffect } from "react";
import {
  Activity,
  PlusCircle,
  ArrowRightCircle,
  Trash2,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const getActionIcon = (action) => {
  switch (action) {
    case "CREATE_TASK":
      return <PlusCircle size={14} className="text-emerald-500" />;
    case "UPDATE_STATUS":
      return <ArrowRightCircle size={14} className="text-blue-500" />;
    case "DELETE_TASK":
      return <Trash2 size={14} className="text-rose-500" />;
    default:
      return <Activity size={14} className="text-neutral-400" />;
  }
};

export default function ActivityFeed({ projectId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/activities`);
        const data = await res.json();
        setActivities(data);
      } catch (err) {
        console.error("Activity Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchActivities();
  }, [projectId]);

  if (loading)
    return (
      <div className="animate-pulse text-[10px] uppercase tracking-widest text-neutral-600 p-6 font-black">
        Syncing Pulse...
      </div>
    );

  return (
    <div className="w-full flex flex-col border-t lg:border-t-0 lg:border-l border-white/5 bg-black/20 backdrop-blur-xl transition-all duration-300">
      <div className="p-4 sm:p-5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity size={16} className="text-accent shrink-0" />
          <h2 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-neutral-300">
            Project Pulse
          </h2>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse lg:hidden" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-8">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 opacity-40">
            <Activity size={24} className="mb-2 text-neutral-700" />
            <p className="text-[10px] text-neutral-600 italic tracking-tight">
              No recent heartbeats detected.
            </p>
          </div>
        ) : (
          activities.map((item) => (
            <div
              key={item._id}
              className="relative pl-6 border-l border-white/10 group transition-all"
            >
              <div className="absolute -left-[7.5px] top-0.5 bg-[#0a0a0a] p-0.5 rounded-full border border-white/10 group-hover:border-accent/50 transition-all duration-300 group-hover:scale-110">
                {getActionIcon(item.action)}
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] sm:text-[12px] leading-relaxed text-neutral-300 break-words">
                  <span className="text-white font-bold hover:text-accent cursor-default transition-colors">
                    {item.userId?.name || "Member"}
                  </span>{" "}
                  <span className="text-neutral-400">
                    {item.action === "CREATE_TASK"
                      ? "created"
                      : item.action === "UPDATE_STATUS"
                        ? "moved"
                        : "removed"}
                  </span>{" "}
                  <span className="text-accent font-semibold">
                    {item.details?.taskTitle}
                  </span>
                </p>

                {item.details?.oldStatus && (
                  <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-neutral-500 uppercase tracking-tight py-0.5">
                    <span className="px-1.5 py-0.5 bg-white/5 rounded border border-white/5">
                      {item.details.oldStatus}
                    </span>
                    <ArrowRightCircle size={10} className="text-neutral-700" />
                    <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/20">
                      {item.details.newStatus}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1.5 text-[9px] text-neutral-600 font-medium italic">
                  <Clock size={10} className="shrink-0" />
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
