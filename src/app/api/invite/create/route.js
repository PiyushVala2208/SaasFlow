import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invitation from "@/models/Invitation";
import User from "@/models/User";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { email, role, orgName } = await req.json();

    if (!email || !role || !orgName) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    await connectDB();
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser && existingUser.status === "active") {
      return NextResponse.json(
        { message: "User already exists and is already active." },
        { status: 400 },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    await Invitation.findOneAndUpdate(
      { email: normalizedEmail, orgName },
      { role, token, status: "pending", createdAt: new Date() },
      { upsert: true, new: true },
    );

    let pendingUser;
    if (!existingUser) {
      pendingUser = await User.create({
        email: normalizedEmail,
        orgName,
        role,
        status: "pending",
        name: "Pending Invite",
        password: crypto.randomBytes(16).toString("hex"),
      });
    } else {
      existingUser.status = "pending";
      existingUser.role = role;
      existingUser.orgName = orgName;
      await existingUser.save();
      pendingUser = existingUser;
    }

    return NextResponse.json(
      {
        message: "Invitation generated successfully!",
        inviteLink: `${process.env.NEXT_PUBLIC_APP_URL}/register?token=${token}`,
        user: pendingUser,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Invite Creation Error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create invite" },
      { status: 500 },
    );
  }
}
