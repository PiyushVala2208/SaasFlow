import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import mongoose from "mongoose";

const MEMBER_ROLES = ["Viewer", "Editor", "Admin"];

export async function POST(req, { params }) {
  try {
    await connectDB();
    const currentUser = await getAuthUser();

    const { id: rawProjectId } = await params;
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";
    let role = typeof body.role === "string" ? body.role : "Editor";

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(rawProjectId)) {
      return NextResponse.json(
        { error: "Invalid Project ID" },
        { status: 400 },
      );
    }

    const projectId = new mongoose.Types.ObjectId(rawProjectId);
    const currentUserIdStr = String(currentUser.id ?? currentUser._id);

    const project = await Project.findById(projectId).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const ownerStr = project.owner?.toString();
    const isOwner = ownerStr === currentUserIdStr;
    const isAdmin = (project.members || []).some(
      (m) =>
        m.user?.toString() === currentUserIdStr && m.role === "Admin",
    );

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Only Admins can invite" },
        { status: 403 },
      );
    }

    if (!MEMBER_ROLES.includes(role)) {
      role = "Editor";
    }

    const targetUser = await User.findOne({
      email: email.toLowerCase(),
    }).lean();

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUserOid = new mongoose.Types.ObjectId(
      String(targetUser._id),
    );
    const targetIdStr = targetUserOid.toString();

    const isAlreadyMember = (project.members || []).some(
      (m) => m.user?.toString() === targetIdStr,
    );

    if (isAlreadyMember || ownerStr === targetIdStr) {
      return NextResponse.json(
        { error: "User already in project" },
        { status: 400 },
      );
    }

    const updated = await Project.findByIdAndUpdate(
      projectId,
      {
        $push: {
          members: {
            user: targetUserOid,
            role,
            joinedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Member invited successfully",
      user: targetUser.name,
    });
  } catch (error) {
    console.error("INVITE_ERROR:", error);
    return NextResponse.json(
      {
        error:
          error?.name === "CastError"
            ? "Invalid identifier format"
            : error.message || "Invitation failed",
      },
      { status: 500 },
    );
  }
}
