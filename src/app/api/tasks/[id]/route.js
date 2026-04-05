import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await params;
    const { status: newStatus } = await req.json();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const validStatuses = ["To-Do", "In-Progress", "Review", "Done"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const oldTask = await Task.findById(id);
    if (!oldTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const oldStatus = oldTask.status;

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true },
    );

    logActivity({
      projectId: updatedTask.projectId,
      userId: user.id || user._id,
      orgName: user.orgName,
      action: "UPDATE_STATUS",
      details: {
        taskTitle: updatedTask.title,
        oldStatus: oldStatus,
        newStatus: newStatus,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH_TASK_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await params;

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const taskToDelete = await Task.findById(id);
    if (!taskToDelete) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    await Task.findByIdAndDelete(id);

    logActivity({
      projectId: taskToDelete.projectId,
      userId: user.id || user._id,
      orgName: user.orgName,
      action: "DELETE_TASK",
      details: {
        taskTitle: taskToDelete.title,
      },
    });

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("DELETE_TASK_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
