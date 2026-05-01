import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import User from "@/models/User";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const authUser = await getAuthUser();

    if (!authUser || !authUser.orgName) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orgFilter = { orgName: authUser.orgName };
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const calculateTrend = (current, previous) => {
      if (!previous || previous === 0) return current > 0 ? "+100%" : "0%";
      const diff = ((current - previous) / previous) * 100;
      return `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`;
    };

    // 1. Parallel Fetching with Error Handling for each
    const [
      totalTasks,
      prevTasks,
      activeUsers,
      prevActiveUsers,
      totalProjects,
      prevProjects,
      completedTasks,
      prevCompleted,
    ] = await Promise.all([
      Task.countDocuments(orgFilter).catch(() => 0),
      Task.countDocuments({
        ...orgFilter,
        createdAt: { $lt: thirtyDaysAgo, $gte: sixtyDaysAgo },
      }).catch(() => 0),
      User.countDocuments({ ...orgFilter, status: "active" }).catch(() => 0),
      User.countDocuments({
        ...orgFilter,
        status: "active",
        createdAt: { $lt: thirtyDaysAgo, $gte: sixtyDaysAgo },
      }).catch(() => 0),
      Project.countDocuments(orgFilter).catch(() => 0),
      Project.countDocuments({
        ...orgFilter,
        createdAt: { $lt: thirtyDaysAgo, $gte: sixtyDaysAgo },
      }).catch(() => 0),
      Task.countDocuments({ ...orgFilter, status: "Done" }).catch(() => 0),
      Task.countDocuments({
        ...orgFilter,
        status: "Done",
        updatedAt: { $lt: thirtyDaysAgo, $gte: sixtyDaysAgo },
      }).catch(() => 0),
    ]);

    const currentConv =
      totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const prevConv = prevTasks > 0 ? (prevCompleted / prevTasks) * 100 : 0;

    // 2. Status Pie Chart Data (Safe Aggregation)
    let statusDistribution = [];
    try {
      statusDistribution = await Task.aggregate([
        { $match: orgFilter },
        { $group: { _id: "$status", value: { $sum: 1 } } },
        { $project: { name: "$_id", value: 1, _id: 0 } },
      ]);
    } catch (e) {
      console.error("Pie Chart Error:", e);
    }

    // 3. Weekly Activity (Safe Aggregation)
    let formattedActivity = [];
    try {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyActivity = await Task.aggregate([
        { $match: { ...orgFilter, createdAt: { $gte: sevenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%a", date: "$createdAt" } },
            users: { $sum: 1 },
          },
        },
      ]);

      const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      formattedActivity = daysOrder.map((day) => ({
        name: day,
        users: weeklyActivity.find((a) => a._id === day)?.users || 0,
      }));
    } catch (e) {
      console.error("Bar Chart Error:", e);
    }

    // Final Response structure matches Frontend exactly
    return NextResponse.json({
      stats: [
        {
          label: "Total Tasks",
          val: totalTasks.toLocaleString(),
          icon: "Target",
          color: "text-blue-500",
          trend: calculateTrend(totalTasks, prevTasks),
        },
        {
          label: "Active Users",
          val: activeUsers.toLocaleString(),
          icon: "Users",
          color: "text-purple-500",
          trend: calculateTrend(activeUsers, prevActiveUsers),
        },
        {
          label: "Projects",
          val: totalProjects.toLocaleString(),
          icon: "TrendingUp",
          color: "text-emerald-500",
          trend: calculateTrend(totalProjects, prevProjects),
        },
        {
          label: "Conversion",
          val: `${currentConv.toFixed(1)}%`,
          icon: "MousePointer2",
          color: "text-red-500",
          trend: `${(currentConv - prevConv).toFixed(1)}%`,
        },
      ],
      segments: statusDistribution.length
        ? statusDistribution
        : [{ name: "No Data", value: 0 }],
      activity: formattedActivity.length ? formattedActivity : [],
    });
  } catch (error) {
    // Ye log terminal mein dikhayega ki asal mein kya phata
    console.error("CRITICAL_ANALYTICS_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Propagation failed" },
      { status: 500 },
    );
  }
}
