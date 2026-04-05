import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { getAuthUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();

    const { id: projectId } = await params;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const activities = await Activity.find({
      projectId,
      orgName: user.orgName,
    })
      .populate("userId", "name image")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(activities);
  } catch (error) {
    console.error("FETCH_ACTIVITIES_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity feed" },
      { status: 500 },
    );
  }
}
