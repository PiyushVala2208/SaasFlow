import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Task";
import Activity from "@/models/Activity";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";
import {
  PROJECT_LIFECYCLE_EVENTS,
  getLifecycleEventForStatusChange,
  getLifecyclePatch,
} from "@/lib/projectLifecycle";

function projectAccessFilter(userOrgName, projectOid, userOid) {
  return {
    _id: projectOid,
    orgName: userOrgName,
    $or: [{ owner: userOid }, { "members.user": userOid }],
  };
}

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id: rawId } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 },
      );
    }

    const projectOid = new mongoose.Types.ObjectId(rawId);
    const userOid = new mongoose.Types.ObjectId(String(user.id ?? user._id));

    const project = await Project.findOne(
      projectAccessFilter(user.orgName, projectOid, userOid),
    )
      .populate("owner", "name email image")
      .populate("members.user", "name email image");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id: rawId } = await params;
    const user = await getAuthUser();
    const body = await req.json();

    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 },
      );
    }

    const projectOid = new mongoose.Types.ObjectId(rawId);
    const userOid = new mongoose.Types.ObjectId(String(user.id ?? user._id));
    const filter = projectAccessFilter(user.orgName, projectOid, userOid);

    const allowedUpdates = ["name", "description", "deadline", "priority"];

    const filteredBody = Object.keys(body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key];
        return obj;
      }, {});

    const existingProject = await Project.findOne(filter);
    if (!existingProject) {
      return NextResponse.json(
        { error: "Unauthorized or Not Found" },
        { status: 404 },
      );
    }

    const validEvents = Object.values(PROJECT_LIFECYCLE_EVENTS);
    const lifecycleEvent =
      typeof body.lifecycleEvent === "string" ? body.lifecycleEvent : null;

    if (lifecycleEvent && !validEvents.includes(lifecycleEvent)) {
      return NextResponse.json(
        { error: `Invalid lifecycle event: ${lifecycleEvent}` },
        { status: 400 },
      );
    }

    let lifecyclePatch = {};

    if (lifecycleEvent) {
      lifecyclePatch = getLifecyclePatch(existingProject, lifecycleEvent, {
        progress: body.progress ?? existingProject.progress,
      });
    } else if (
      typeof body.status === "string" &&
      body.status !== existingProject.status
    ) {
      const impliedEvent = getLifecycleEventForStatusChange(
        existingProject.status,
        body.status,
      );

      if (impliedEvent) {
        lifecyclePatch = getLifecyclePatch(existingProject, impliedEvent, {
          progress: body.progress ?? existingProject.progress,
        });
      } else {
        filteredBody.status = body.status;
      }
    }

    const updatePayload = { ...filteredBody, ...lifecyclePatch };

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(existingProject);
    }

    const updatedProject = await Project.findOneAndUpdate(
      filter,
      { $set: updatePayload },
      { new: true, runValidators: true },
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Unauthorized or Not Found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error("PATCH_ERROR:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id: rawId } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      return NextResponse.json(
        { error: "Invalid project id" },
        { status: 400 },
      );
    }

    const projectOid = new mongoose.Types.ObjectId(rawId);
    const userOid = new mongoose.Types.ObjectId(String(user.id ?? user._id));

    const deletedProject = await Project.findOneAndDelete({
      _id: projectOid,
      orgName: user.orgName,
      owner: userOid,
    });

    if (!deletedProject) {
      return NextResponse.json(
        { error: "Only the project owner can delete this project" },
        { status: 403 },
      );
    }

    await Promise.all([
      Task.deleteMany({ projectId: projectOid }),
      Activity.deleteMany({ projectId: projectOid }),
    ]);

    return NextResponse.json({
      message: "Project and all related tasks deleted successfully",
    });
  } catch (error) {
    console.error("DELETE_ENGINE_CRASH:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
