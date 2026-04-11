import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

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
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const projectOid = new mongoose.Types.ObjectId(rawId);
    const userOid = new mongoose.Types.ObjectId(
      String(user.id ?? user._id),
    );

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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const projectOid = new mongoose.Types.ObjectId(rawId);
    const userOid = new mongoose.Types.ObjectId(
      String(user.id ?? user._id),
    );

    const updatedProject = await Project.findOneAndUpdate(
      projectAccessFilter(user.orgName, projectOid, userOid),
      { $set: body },
      { returnDocument: "after" },
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
    const { id: rawId } = await params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(rawId)) {
      return NextResponse.json({ error: "Invalid project id" }, { status: 400 });
    }

    const projectOid = new mongoose.Types.ObjectId(rawId);
    const userOid = new mongoose.Types.ObjectId(
      String(user.id ?? user._id),
    );

    const deleted = await Project.findOneAndDelete({
      _id: projectOid,
      orgName: user.orgName,
      owner: userOid,
    });

    if (!deleted) {
      return NextResponse.json(
        { error: "Only the project owner can delete this project" },
        { status: 403 },
      );
    }

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
