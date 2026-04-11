import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

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
        const projectId = project._id.toString();

        const totalTasks = await Task.countDocuments({ projectId });
        const completedTasks = await Task.countDocuments({
          projectId,
          status: "Done",
        });

        const progress =
          totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        const membershipRole = resolveMembershipRole(project, userIdStr);

        return {
          ...project,
          membershipRole,
          totalTasks,
          completedTasks,
          progress,
        };
      }),
    );

    return NextResponse.json(projectsWithStats);
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

    const ownerOid = new mongoose.Types.ObjectId(
      String(user.id ?? user._id),
    );

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
