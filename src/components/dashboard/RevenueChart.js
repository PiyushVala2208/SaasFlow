"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

export default function RevenueChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch("/api/stats/revenue");
        if (res.ok) {
          const dynamicData = await res.json();
          const formattedData = dynamicData.map((item) => ({
            name: item.name,
            revenue: item.total,
          }));
          setChartData(formattedData);
        }
      } catch (err) {
        console.error("Chart Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="h-75 md:h-87.5 w-full mt-4 flex items-center justify-center border border-white/5 rounded-2xl bg-white/2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] md:text-xs text-neutral-500 font-medium tracking-widest uppercase">
            Syncing Analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-70 sm:h-80 md:h-87.5 w-full mt-4 lg:mt-6 pb-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ 
            top: 10, 
            right: 5, 
            left: -25, 
            bottom: 0 
          }}
        >
          <defs>
            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#ffffff05"
          />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 10 }} 
            minTickGap={20} 
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#666", fontSize: 10 }}
            hide={chartData.length === 0} 
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ 
              stroke: "#3b82f6", 
              strokeWidth: 1, 
              strokeDasharray: "5 5" 
            }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={window?.innerWidth < 768 ? 2 : 3} 
            fillOpacity={1}
            fill="url(#colorRev)"
            animationDuration={1500}
            activeDot={{ 
              r: window?.innerWidth < 768 ? 4 : 6, 
              stroke: '#3b82f6', 
              strokeWidth: 2, 
              fill: '#000', 
              className: "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}