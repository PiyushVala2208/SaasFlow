import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    const user = await getAuthUser();

    if (!user) {
      console.log(" Auth failed: No user found in token");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.orgName) {
      console.log(" Data Isolation Error: User has no orgName", user);
      return NextResponse.json(
        { error: "Organization not found for user" },
        { status: 400 },
      );
    }

    const projects = await Project.find({ orgName: user.orgName })
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json(projects);
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

    const newProject = await Project.create({
      name,
      description,
      priority: priority || "Medium",
      deadline,
      orgName: user.orgName,
      owner: user.id || user._id,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error(" PROJECT CREATE ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 },
    );
  }
}
