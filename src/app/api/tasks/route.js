import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/auth";

export async function GET(req) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!projectId)
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );

    const tasks = await Task.find({
      orgName: user.orgName,
      projectId: projectId,
    })
      .populate("assignedTo", "name email image")
      .sort({ createdAt: -1 });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, priority, deadline, projectId, assignedTo } = body;

    const newTask = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      deadline,
      projectId,
      assignedTo,
      orgName: user.orgName,
      createdBy: user.id,
    });

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}
