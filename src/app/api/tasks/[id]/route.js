import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/auth";
import { logActivity } from "@/lib/activityLogger";
import mongoose from "mongoose";
import { normalizeTaskTags } from "@/lib/taskTags";
import { syncProjectProgressFromTasks } from "@/lib/projectProgressSync";

const POPULATE_CONFIG = {
  path: "assignedTo",
  select: "name email image",
};

function normalizeObjectId(value) {
  const raw =
    typeof value === "object"
      ? value?._id || value?.id || value?.user?._id || value?.user?.id
      : value;

  if (!raw) return undefined;

  const asString = String(raw);
  return mongoose.Types.ObjectId.isValid(asString) ? asString : undefined;
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const user = await getAuthUser();
    const { id } = await params;
    const updateData = await req.json();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const oldTask = await Task.findOne({ _id: id, orgName: user.orgName });
    if (!oldTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (updateData.assignedTo && Array.isArray(updateData.assignedTo)) {
      updateData.assignedTo = updateData.assignedTo
        .map((member) => normalizeObjectId(member))
        .filter(Boolean);
    }

    if (updateData.status) {
      const VALID_STATUSES = ["To-Do", "In-Progress", "Review", "Done"];
      const incomingStatus = String(updateData.status || "").trim();

      const matched = VALID_STATUSES.find(
        (s) => s.toLowerCase() === incomingStatus.toLowerCase(),
      );

      if (!matched) {
        return NextResponse.json(
          { error: `Invalid status: ${incomingStatus}` },
          { status: 400 },
        );
      }
      updateData.status = matched;
    }

    if (updateData.subTasks && Array.isArray(updateData.subTasks)) {
      updateData.subTasks = updateData.subTasks
        .map((st) => {
          if (!st || typeof st !== "object") return null;

          const title = String(st.title || "").trim();
          if (!title) return null;

          const existingSubTaskId = normalizeObjectId(st._id || st.id);
          const assignedToId = normalizeObjectId(st.assignedTo);

          return {
            ...(existingSubTaskId ? { _id: existingSubTaskId } : {}),
            title,
            isCompleted: Boolean(st.isCompleted),
            ...(assignedToId ? { assignedTo: assignedToId } : {}),
          };
        })
        .filter(Boolean);
    }

    if (Object.prototype.hasOwnProperty.call(updateData, "tags")) {
      updateData.tags = normalizeTaskTags(updateData.tags);
    }

    if (updateData.deadline) {
      updateData.dueDate = updateData.deadline || updateData.dueDate;
      delete updateData.deadline;
    }

    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, orgName: user.orgName },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      },
    )
      .populate(POPULATE_CONFIG)
      .populate("subTasks.assignedTo", "name email image");

    if (!updatedTask) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    try {
      const isStatusUpdate =
        updateData.status && updateData.status !== oldTask.status;
      await logActivity({
        projectId: updatedTask.projectId,
        userId: user.id || user._id,
        orgName: user.orgName,
        action: isStatusUpdate ? "UPDATE_STATUS" : "UPDATE_TASK",
        details: {
          taskTitle: updatedTask.title,
          ...(Object.prototype.hasOwnProperty.call(updateData, "tags") && {
            tagsCount: updateData.tags.length,
          }),
          ...(isStatusUpdate && {
            oldStatus: oldTask.status,
            newStatus: updatedTask.status,
          }),
        },
      });
    } catch (logError) {
      console.warn("Activity Logger failed:", logError.message);
    }

    await syncProjectProgressFromTasks({
      projectId: updatedTask.projectId,
      orgName: user.orgName,
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("PATCH_TASK_ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
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

    const task = await Task.findOneAndDelete({
      _id: id,
      orgName: user.orgName,
    });
    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    try {
      await logActivity({
        projectId: task.projectId,
        userId: user.id || user._id,
        orgName: user.orgName,
        action: "DELETE_TASK",
        details: { taskTitle: task.title },
      });
    } catch (err) {
      console.warn("Logger error:", err.message);
    }

    await syncProjectProgressFromTasks({
      projectId: task.projectId,
      orgName: user.orgName,
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
