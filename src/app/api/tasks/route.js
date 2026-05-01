import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";
import { normalizeTaskTags } from "@/lib/taskTags";
import { syncProjectProgressFromTasks } from "@/lib/projectProgressSync";

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
      .populate("subTasks.assignedTo", "name image")
      .sort({ createdAt: -1 })
      .lean();

    const normalizedTasks = tasks.map((task) => ({
      ...task,
      tags: normalizeTaskTags(task.tags),
    }));

    return NextResponse.json(normalizedTasks);
  } catch (error) {
    console.error("FETCH_TASKS_ERROR:", error);
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

    const {
      title,
      description,
      priority,
      dueDate,
      projectId,
      assignedTo,
      subTasks,
      tags,
    } = body;

    if (!title || !projectId) {
      return NextResponse.json(
        { error: "Missing required fields: Title or ProjectId" },
        { status: 400 },
      );
    }

    if (assignedTo && assignedTo.length > 0) {
      const memberObjects = assignedTo.map((id) => ({ user: id }));

      await Project.findByIdAndUpdate(projectId, {
        $addToSet: { members: { $each: memberObjects } },
      });
    }

    const normalizedTags = normalizeTaskTags(tags);

    const newTask = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      status: "To-Do",
      dueDate: dueDate || null,
      projectId,
      assignedTo: assignedTo || [],
      subTasks: subTasks || [],
      tags: normalizedTags,
      orgName: user.orgName,
      createdBy: user.id || user._id,
    });

    logActivity({
      projectId,
      userId: user.id || user._id,
      orgName: user.orgName,
      action: "CREATE_TASK",
      details: {
        taskTitle: title,
        subTasksCount: subTasks?.length || 0,
        assigneesCount: assignedTo?.length || 0,
        tagsCount: normalizedTags.length,
      },
    });

    await syncProjectProgressFromTasks({
      projectId,
      orgName: user.orgName,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("CREATE_TASK_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Creation failed" },
      { status: 500 },
    );
  }
}
