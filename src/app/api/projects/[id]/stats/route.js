import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Activity from "@/models/Activity";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id: projectId } = await params;

    if (!user || !user.orgName) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectExists = await Project.findOne({
      _id: projectId,
      orgName: user.orgName,
    });

    if (!projectExists) {
      return NextResponse.json(
        { error: "Project not found in your organization" },
        { status: 404 },
      );
    }

    const now = new Date();

    const [taskStats, recentActivityCount] = await Promise.all([
      Task.aggregate([
        {
          $match: {
            projectId: new mongoose.Types.ObjectId(projectId),
            orgName: user.orgName,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] },
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ["$status", "In-Progress"] }, 1, 0] },
            },
            // ... baaki code same rahega

            criticalCount: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ["$status", "Done"] },

                      { $in: ["$priority", ["High", "Urgent"]] },
                    ],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      Activity.countDocuments({
        projectId: new mongoose.Types.ObjectId(projectId), 
        orgName: user.orgName, 
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

    return NextResponse.json(
      {
        workload: stats.total,
        efficiency,
        critical: stats.criticalCount,
        velocity: recentActivityCount,
        active: stats.inProgress,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("INSIGHTS_ENGINE_CRASH:", error);
    return NextResponse.json(
      { error: "Failed to propagate project insights" },
      { status: 500 },
    );
  }
}
