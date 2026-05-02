"use client";
import { useState, useEffect, useCallback } from "react";
import GlassCard from "@/components/ui/GlassCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Filter,
  TrendingUp,
  Users,
  Target,
  MousePointer2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import CustomTooltip from "@/components/dashboard/CustomTooltip";

const COLORS = ["#3b82f6", "#8b5cf6", "#ec4899"];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: [],
    pieData: [],
    barData: [],
  });

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/analytics", {
        method: "GET",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to sync intelligence engine");
      }

      const result = await response.json();

      setData({
        stats: result.stats || [],
        pieData: result.segments || [],
        barData: result.activity || [],
      });
    } catch (err) {
      console.error("Analytics Sync Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="w-16 h-16 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
          Syncing Analytics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 font-bold mb-4">Error: {error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">
            INTELLIGENCE ENGINE
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
              System Live: Data Propagated
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-neutral-400 hover:text-white transition-all"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
          <button className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)]">
            <Download size={14} /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((item, i) => {
          const Icon =
            { Target, TrendingUp, Users, MousePointer2 }[item.icon] || Target;
          return (
            <GlassCard
              key={i}
              className="p-6 border-white/5 group hover:border-blue-500/20 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-2xl bg-neutral-900 border border-white/5 group-hover:border-blue-500/30 transition-all">
                  <Icon size={20} className={item.color || "text-blue-500"} />
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-[10px] font-bold ${item.trend?.startsWith("+") ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {item.trend}
                </div>
              </div>
              <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em]">
                {item.label}
              </p>
              <h3 className="text-3xl font-black text-white mt-1 tracking-tighter">
                {item.val}
              </h3>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
        <GlassCard className="lg:col-span-2 p-8 border-white/5">
          <div className="mb-8">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40">
              Revenue Trajectory
            </h3>
          </div>
          <div className="h-[350px]">
            <RevenueChart />
          </div>
        </GlassCard>

        <GlassCard className="p-8 border-white/5 ">
          <h3 className="text-sm font-black uppercase tracking-[0.3em] text-white/40 mb-10">
            Client Segment
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.pieData}
                  innerRadius="75%"
                  outerRadius="95%"
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {data.pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {data.pieData.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5"
              >
                <span className="text-[10px] font-bold uppercase text-neutral-500 flex items-center gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  {item.name}
                </span>
                <span className="text-xs font-black text-white">
                  {item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
