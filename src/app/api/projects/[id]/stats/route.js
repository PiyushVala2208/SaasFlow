import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Activity from "@/models/Activity";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id: projectId } = await params;

    const now = new Date();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [taskStats, recentActivityCount] = await Promise.all([
      Task.aggregate([
        { $match: { projectId: new mongoose.Types.ObjectId(projectId) } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] },
            },
            criticalCount: {
              $sum: {
                $cond: [
                  {
                    $or: [
                      { $in: ["$priority", ["High", "Urgent"]] },
                      {
                        $and: [
                          { $lt: ["$deadline", now] },
                          { $ne: ["$status", "Done"] },
                        ],
                      },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ["$status", "In-Progress"] }, 1, 0] },
            },
          },
        },
      ]),
      Activity.countDocuments({
        projectId,
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
    ]);

    const stats = taskStats[0] || {
      total: 0,
      completed: 0,
      criticalCount: 0,
      inProgress: 0,
    };

    const efficiency =
      stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

    return NextResponse.json({
      workload: stats.total,
      efficiency,
      critical: stats.criticalCount,
      velocity: recentActivityCount,
      active: stats.inProgress,
    });
  } catch (error) {
    console.error("STATS_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch insights" },
      { status: 500 },
    );
  }
}
