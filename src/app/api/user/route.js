import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const USER_SELECT_FIELDS =
  "_id name email role status orgName image jobTitle phone bio workspaceName workspaceUrl businessEmail createdAt";

function normalizeEmail(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeUrlSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

function buildUserPayload(currentUser, allUsers) {
  return {
    _id: currentUser._id,
    id: String(currentUser._id),
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role,
    status: currentUser.status,
    orgName: currentUser.orgName,
    image: currentUser.image || "",
    jobTitle: currentUser.jobTitle || "",
    phone: currentUser.phone || "",
    bio: currentUser.bio || "",
    workspaceName: currentUser.workspaceName || "",
    workspaceUrl: currentUser.workspaceUrl || "",
    businessEmail: currentUser.businessEmail || "",
    createdAt: currentUser.createdAt || null,
    currentUser: {
      _id: currentUser._id,
      id: String(currentUser._id),
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
      status: currentUser.status,
      orgName: currentUser.orgName,
      image: currentUser.image || "",
      jobTitle: currentUser.jobTitle || "",
      phone: currentUser.phone || "",
      bio: currentUser.bio || "",
      workspaceName: currentUser.workspaceName || "",
      workspaceUrl: currentUser.workspaceUrl || "",
      businessEmail: currentUser.businessEmail || "",
      createdAt: currentUser.createdAt || null,
    },
    allUsers: allUsers.map((user) => ({
      _id: user._id,
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      orgName: user.orgName,
      image: user.image || "",
    })),
  };
}

export async function GET() {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const currentUser = await User.findById(authUser.id || authUser._id)
      .select(USER_SELECT_FIELDS)
      .lean();

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const allUsers = await User.find({ orgName: currentUser.orgName })
      .select("_id name email role status orgName image")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(
      buildUserPayload(currentUser, allUsers),
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("USER_FETCH_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 },
    );
  }
}

export async function PATCH(req) {
  try {
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const section = body?.section;

    await connectDB();

    const user = await User.findById(authUser.id || authUser._id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (section === "general") {
      const workspaceName = String(body.workspaceName || "").trim();
      const workspaceUrl = normalizeUrlSlug(body.workspaceUrl);
      const businessEmail = normalizeEmail(body.businessEmail);

      if (!workspaceName) {
        return NextResponse.json(
          { error: "Workspace name is required" },
          { status: 400 },
        );
      }

      if (!workspaceUrl) {
        return NextResponse.json(
          { error: "Workspace URL is required" },
          { status: 400 },
        );
      }

      user.workspaceName = workspaceName;
      user.workspaceUrl = workspaceUrl;
      user.businessEmail = businessEmail;
      await user.save();
    } else if (section === "profile") {
      const name = String(body.name || "").trim();
      const email = normalizeEmail(body.email);
      const jobTitle = String(body.jobTitle || "").trim();
      const phone = String(body.phone || "").trim();
      const bio = String(body.bio || "").trim();

      if (!name) {
        return NextResponse.json(
          { error: "Full name is required" },
          { status: 400 },
        );
      }

      if (!email) {
        return NextResponse.json(
          { error: "Email is required" },
          { status: 400 },
        );
      }

      const conflictingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      })
        .select("_id")
        .lean();

      if (conflictingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        );
      }

      user.name = name;
      user.email = email;
      user.jobTitle = jobTitle;
      user.phone = phone;
      user.bio = bio;
      await user.save();
    } else if (section === "password") {
      const currentPassword = String(body.currentPassword || "");
      const newPassword = String(body.newPassword || "");

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { error: "Current and new password are required" },
          { status: 400 },
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters" },
          { status: 400 },
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 },
        );
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();
    } else {
      return NextResponse.json(
        { error: "Invalid update section" },
        { status: 400 },
      );
    }

    const currentUser = await User.findById(user._id)
      .select(USER_SELECT_FIELDS)
      .lean();
    const allUsers = await User.find({ orgName: currentUser.orgName })
      .select("_id name email role status orgName image")
      .sort({ name: 1 })
      .lean();

    return NextResponse.json(buildUserPayload(currentUser, allUsers), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("USER_UPDATE_ERROR:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
