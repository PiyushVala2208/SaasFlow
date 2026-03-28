"use client";
import GlassCard from "@/components/ui/GlassCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { Download, Filter, TrendingUp, Users, Target, MousePointer2 } from "lucide-react";
import CustomTooltip from "@/components/dashboard/CustomTooltip";

// Dummy Data for Bar Chart
const barData = [
  { name: 'Mon', users: 2400 },
  { name: 'Tue', users: 1398 },
  { name: 'Wed', users: 9800 },
  { name: 'Thu', users: 3908 },
  { name: 'Fri', users: 4800 },
  { name: 'Sat', users: 3800 },
  { name: 'Sun', users: 4300 },
];

// Dummy Data for Pie Chart (Market Share)
const pieData = [
  { name: 'Enterprise', value: 400 },
  { name: 'Startup', value: 300 },
  { name: 'Individual', value: 300 },
];
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 pb-10">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
          <p className="text-neutral-500 mt-1">Detailed performance metrics across your organization.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
            <Filter size={16} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-medium hover:opacity-90 transition-all">
            <Download size={16} /> Export Reports
          </button>
        </div>
      </div>

      {/* Analytics Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg. Session", val: "12m 45s", icon: MousePointer2, color: "text-blue-500" },
          { label: "Conversion", val: "4.8%", icon: Target, color: "text-emerald-500" },
          { label: "Bounce Rate", val: "22.4%", icon: TrendingUp, color: "text-red-500" },
          { label: "Active Subs", val: "842", icon: Users, color: "text-purple-500" },
        ].map((item, i) => (
          <GlassCard key={i} className="p-5 border-white/5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{item.label}</p>
              <item.icon size={16} className={item.color} />
            </div>
            <h3 className="text-2xl font-bold">{item.val}</h3>
          </GlassCard>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Revenue Chart (Taking 2 columns) */}
        <GlassCard className="lg:col-span-2 p-6 border-white/5">
          <h3 className="text-lg font-bold mb-6">Revenue Breakdown</h3>
          <RevenueChart />
        </GlassCard>

        {/* Traffic Source Pie Chart */}
        <GlassCard className="p-6 border-white/5 flex flex-col justify-between">
          <h3 className="text-lg font-bold mb-4">Client Segment</h3>
          <div className="h-62.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {pieData.map((item, i) => (
              <div key={i} className="flex justify-between text-xs">
                <span className="text-neutral-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}} /> {item.name}
                </span>
                <span className="font-bold text-white">{(item.value / 10).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Weekly Activity Bar Chart */}
        <GlassCard className="lg:col-span-3 p-6 border-white/5">
          <h3 className="text-lg font-bold mb-6">Weekly Active Users</h3>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#666', fontSize: 12}} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} content={<CustomTooltip />} />
                <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}