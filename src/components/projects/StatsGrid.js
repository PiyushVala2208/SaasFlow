"use client";
import { useState, useEffect } from "react";
import { BarChart3, Zap, ShieldAlert, Target } from "lucide-react";

const colorMap = {
  "bg-blue-500": "text-blue-500",
  "bg-emerald-500": "text-emerald-500",
  "bg-rose-500": "text-rose-500",
  "bg-amber-500": "text-amber-500",
};

const StatCard = ({ title, value, icon: Icon, color, subText, isAlert }) => {
  const hasCriticalIssues = isAlert && value > 0;

  const iconColorClass = hasCriticalIssues
    ? "text-rose-500"
    : colorMap[color] || "text-white";

  return (
    <div
      className={`relative overflow-hidden p-5 rounded-2xl border transition-all duration-500 group ${
        hasCriticalIssues
          ? "bg-rose-500/10 border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.15)]"
          : "bg-white/3 border-white/10 hover:border-white/20"
      }`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10 rounded-full blur-2xl transition-opacity duration-500 group-hover:opacity-20 ${
          hasCriticalIssues ? "bg-rose-500 animate-pulse" : color
        }`}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 mb-1">
            {title}
          </p>
          <h3
            className={`text-2xl font-bold tracking-tight transition-colors duration-500 ${
              hasCriticalIssues ? "text-rose-500" : "text-white"
            }`}
          >
            {value}
          </h3>
          <p
            className={`text-[9px] font-bold mt-2 uppercase tracking-widest transition-colors ${
              hasCriticalIssues ? "text-rose-400/80 italic" : "text-neutral-600"
            }`}
          >
            {hasCriticalIssues ? "🚨 Action Required" : subText}
          </p>
        </div>

        <div
          className={`p-2.5 rounded-xl border transition-all duration-500 ${
            hasCriticalIssues
              ? "bg-rose-500/20 border-rose-500/30 text-rose-500"
              : `bg-white/5 border-white/5 ${iconColorClass}`
          }`}
        >
          <Icon
            size={18}
            className={hasCriticalIssues ? "animate-bounce" : ""}
          />
        </div>
      </div>
    </div>
  );
};

export default function StatsGrid({ projectId, refreshKey }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/stats`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Stats Load Fail");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [projectId, refreshKey]);

  if (loading)
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 bg-white/5 rounded-2xl border border-white/5"
          />
        ))}
      </div>
    );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Workload"
        value={stats?.workload || 0}
        icon={BarChart3}
        color="bg-blue-500"
        subText="Active Scope"
      />
      <StatCard
        title="Efficiency"
        value={`${stats?.efficiency || 0}%`}
        icon={Target}
        color="bg-emerald-500"
        subText="Progress Rate"
      />
      <StatCard
        title="Critical"
        value={stats?.critical || 0}
        icon={ShieldAlert}
        color="bg-rose-500"
        subText="System Nominal"
        isAlert={true}
      />
      <StatCard
        title="Velocity"
        value={stats?.velocity || 0}
        icon={Zap}
        color="bg-amber-500"
        subText="Recent Moves"
      />
    </div>
  );
}
