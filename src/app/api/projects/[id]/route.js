import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await Project.findOne({
      _id: id,
      orgName: user.orgName,
    });

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
    const { id } = await params;
    const user = await getAuthUser();
    const body = await req.json();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, orgName: user.orgName },
      { $set: body },
      { new: true },
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: "Project not found or unauthorized" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await Project.findOneAndDelete({
      _id: id,
      orgName: user.orgName,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Unauthorized delete request" },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
