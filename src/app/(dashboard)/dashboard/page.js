import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import RevenueChart from "@/components/dashboard/RevenueChart";
import GlassCard from "@/components/ui/GlassCard";
import {
  TrendingUp,
  Users,
  DollarSign,
  Activity,
  Building2,
} from "lucide-react";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";
import OrgTable from "@/components/dashboard/OrgTable";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let userData = null;
  let stats = {
    totalUsers: 0,
    newUsersToday: 0,
    organizations: [],
  };

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    userData = await User.findById(decoded.id).lean();

    if (userData) {
      const isSuperAdmin = userData.role === "SuperAdmin";
      const filter = isSuperAdmin ? {} : { orgName: userData.orgName };

      const fetchTasks = [
        User.countDocuments(filter),
        User.countDocuments({
          ...filter,
          createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        }),
      ];

      if (isSuperAdmin) {
        fetchTasks.push(
          User.aggregate([
            {
              $group: {
                _id: "$orgName",
                memberCount: { $sum: 1 },
                adminEmail: { $first: "$email" },
                createdAt: { $min: "$createdAt" },
              },
            },
            { $sort: { createdAt: -1 } },
          ]),
        );
      }

      const results = await Promise.all(fetchTasks);
      stats.totalUsers = results[0] || 0;
      stats.newUsersToday = results[1] || 0;
      stats.organizations = results[2] || [];
    }
  } catch (error) {
    console.error("Dashboard Auth Error:", error.message);
  }

  if (!userData) {
    redirect("/login");
  }

  const isSuperAdmin = userData.role === "SuperAdmin";

  const statsData = [
    {
      label: isSuperAdmin ? "Global Revenue" : "Org Revenue",
      value: `$${(stats.totalUsers * 22).toLocaleString()}.00`,
      growth: "+12.5%",
      icon: DollarSign,
      color: "text-blue-500",
    },
    {
      label: "New Signups",
      value: `+${stats.newUsersToday}`,
      growth: "Last 24h",
      icon: TrendingUp,
      color: "text-emerald-500",
    },
    {
      label: isSuperAdmin ? "Total Organizations" : "System Status",
      value: isSuperAdmin
        ? stats.organizations.length.toLocaleString()
        : "99.9%",
      growth: isSuperAdmin ? "Live Orgs" : "Operational",
      icon: isSuperAdmin ? Building2 : Activity,
      color: "text-orange-500",
    },
    {
      label: isSuperAdmin ? "Total Platform Users" : "Total Users",
      value: stats.totalUsers.toLocaleString(),
      growth: "Lifetime count",
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {userData.name || "User"} 👋
            {isSuperAdmin && (
              <span className="ml-2 text-[10px] bg-white/10 border border-white/20 px-2 py-1 rounded-full uppercase tracking-widest text-neutral-400">
                SuperAdmin
              </span>
            )}
          </h1>
          <p className="text-neutral-500 mt-1">
            Real-time performance of your SaaSFlow workspace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <GlassCard
            key={i}
            className="p-6 border-white/5 group overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <div className="flex items-center gap-1 mt-2 text-xs text-neutral-400">
                  <TrendingUp
                    size={12}
                    className={
                      stat.growth.includes("+") ? "text-emerald-500" : ""
                    }
                  />
                  <span>{stat.growth}</span>
                </div>
              </div>
              <div
                className={`p-3 rounded-xl bg-white/5 border border-white/10 ${stat.color}`}
              >
                <stat.icon size={18} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="p-8 border-white/5">
        <div className="mb-6">
          <h3 className="text-xl font-bold">
            {isSuperAdmin ? "Global Platform Growth" : "Revenue Growth"}
          </h3>
          <p className="text-sm text-neutral-500">
            Live analytics from your database.
          </p>
        </div>
        <RevenueChart />
      </GlassCard>

      {isSuperAdmin && <OrgTable organizations={stats.organizations} />}
    </div>
  );
}
