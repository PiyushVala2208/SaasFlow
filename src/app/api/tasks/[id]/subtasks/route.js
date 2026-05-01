import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingTask = await Task.findOne({ _id: id, orgName: user.orgName });

    if (!existingTask) {
      return NextResponse.json(
        { error: "Task not found or access denied" },
        { status: 404 },
      );
    }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { $set: body }, 
      { new: true, runValidators: true },
    ).populate("assignedTo", "name email image");

    try {
      await logActivity({
        projectId: updatedTask.projectId,
        userId: user.id || user._id,
        orgName: user.orgName,
        action: body.status ? "UPDATE_STATUS" : "UPDATE_TASK",
        details: {
          taskTitle: updatedTask.title,
          updatedFields: Object.keys(body),
        },
      });
    } catch (logErr) {
      console.error("Activity logging failed:", logErr);
    }

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("UPDATE_TASK_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update task details", details: error.message },
      { status: 500 },
    );
  }
}
