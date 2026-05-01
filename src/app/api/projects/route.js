import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";
import {
  PROJECT_LIFECYCLE_EVENTS,
  PROJECT_STATUS,
  getLifecyclePatch,
} from "@/lib/projectLifecycle";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function resolveMembershipRole(project, userIdStr) {
  const ownerRef = project.owner;
  const ownerId =
    ownerRef && typeof ownerRef === "object" && ownerRef._id != null
      ? String(ownerRef._id)
      : ownerRef != null
        ? String(ownerRef)
        : null;

  if (ownerId === userIdStr) return "Owner";

  const member = (project.members || []).find((m) => {
    const uid = m.user;
    const idStr =
      uid && typeof uid === "object" && uid._id != null
        ? String(uid._id)
        : uid != null
          ? String(uid)
          : null;
    return idStr === userIdStr;
  });

  return member?.role ?? "Editor";
}

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.orgName) {
      return NextResponse.json(
        { error: "Organization not found for user" },
        { status: 400 },
      );
    }

    const userIdStr = String(user.id ?? user._id);
    const userOid = new mongoose.Types.ObjectId(userIdStr);

    let projects = await Project.aggregate([
      { $match: { orgName: user.orgName } },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "projectId",
          as: "projectTasks",
        },
      },
      {
        $match: {
          $or: [
            { owner: userOid },
            { "members.user": userOid },
            { "projectTasks.assignedTo": userOid },
          ],
        },
      },
      {
        $project: {
          projectTasks: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    projects = await Project.populate(projects, [
      { path: "owner", select: "name email image" },
      { path: "members.user", select: "name email image" },
    ]);

    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const projectOid = new mongoose.Types.ObjectId(project._id);

        const totalTasks = await Task.countDocuments({
          projectId: projectOid,
          orgName: user.orgName,
        });
        const completedTasks = await Task.countDocuments({
          projectId: projectOid,
          orgName: user.orgName,
          status: "Done",
        });

        const rawProgress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        const progress =
          project.status === PROJECT_STATUS.ACTIVE &&
          project.autoCompleteBlocked &&
          rawProgress === 100
            ? 99
            : rawProgress;

        const lifecyclePatch = getLifecyclePatch(
          project,
          PROJECT_LIFECYCLE_EVENTS.AUTO_PROGRESS_SYNC,
          { progress: rawProgress },
        );

        if (Object.keys(lifecyclePatch).length > 0) {
          await Project.updateOne(
            { _id: project._id, orgName: user.orgName },
            { $set: lifecyclePatch },
            { runValidators: true },
          );
        }

        const normalizedProject = { ...project, ...lifecyclePatch };

        const membershipRole = resolveMembershipRole(
          normalizedProject,
          userIdStr,
        );

        return {
          ...normalizedProject,
          membershipRole,
          totalTasks,
          completedTasks,
          progress,
        };
      }),
    );

    return NextResponse.json(projectsWithStats, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error(" GET PROJECTS ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, priority, deadline } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 },
      );
    }

    const ownerOid = new mongoose.Types.ObjectId(String(user.id ?? user._id));

    const newProject = await Project.create({
      name,
      description,
      priority: priority || "Medium",
      deadline,
      orgName: user.orgName,
      owner: ownerOid,
    });

    const responseData = {
      ...newProject._doc,
      totalTasks: 0,
      completedTasks: 0,
      progress: 0,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error(" PROJECT CREATE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 },
    );
  }
}
