"use client";
import { useState, useEffect } from "react";
import {
  Activity,
  PlusCircle,
  ArrowRightCircle,
  Trash2,
  User,
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
      <div className="animate-pulse text-[10px] uppercase tracking-widest text-neutral-600 p-4 font-black">
        Syncing Pulse...
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col border-l border-white/5 bg-black/20 backdrop-blur-xl">
      <div className="p-4 border-b border-white/5 flex items-center gap-2">
        <Activity size={16} className="text-accent" />
        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-300">
          Project Pulse
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        {activities.length === 0 ? (
          <p className="text-[10px] text-neutral-600 italic text-center py-10">
            No recent heartbeats detected.
          </p>
        ) : (
          activities.map((item) => (
            <div
              key={item._id}
              className="relative pl-6 border-l border-white/10 group"
            >
              {/* Dot Icon */}
              <div className="absolute -left-[7px] top-0 bg-[#0a0a0a] p-0.5 rounded-full border border-white/10 group-hover:border-accent/50 transition-colors">
                {getActionIcon(item.action)}
              </div>

              <div className="space-y-1">
                <p className="text-[11px] leading-relaxed text-neutral-300 font-medium">
                  <span className="text-white font-bold">
                    {item.userId?.name || "Member"}
                  </span>{" "}
                  {item.action === "CREATE_TASK"
                    ? "created"
                    : item.action === "UPDATE_STATUS"
                      ? "moved"
                      : "removed"}{" "}
                  <span className="text-accent font-semibold">
                    {item.details?.taskTitle}
                  </span>
                </p>

                {item.details?.oldStatus && (
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-500 uppercase tracking-tighter">
                    <span>{item.details.oldStatus}</span>
                    <ArrowRightCircle size={10} />
                    <span className="text-blue-400">
                      {item.details.newStatus}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-1 text-[9px] text-neutral-600 font-medium italic">
                  <Clock size={10} />
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
