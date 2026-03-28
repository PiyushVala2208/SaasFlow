import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Invitation from "@/models/Invitation";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { fullName, workEmail, orgName, password, token } = await req.json();

    if (!fullName || !workEmail || !orgName || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    await connectDB();

    const normalizedEmail = workEmail.toLowerCase();
    const normalizedOrg = orgName.trim();

    let invite = null;
    if (token) {
      invite = await Invitation.findOne({ token, status: "pending" });
      if (!invite) {
        return NextResponse.json(
          { message: "Invalid or expired invitation" },
          { status: 400 },
        );
      }
    }

    if (!token) {
      const orgExists = await User.findOne({
        orgName: { $regex: new RegExp(`^${normalizedOrg}$`, "i") },
        status: "active",
      });
      if (orgExists) {
        return NextResponse.json(
          { message: "Organization name already taken." },
          { status: 400 },
        );
      }
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser && existingUser.status === "active") {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const finalOrgName = invite ? invite.orgName : normalizedOrg;
    const finalRole = invite ? invite.role : "Admin";

    let user;
    if (existingUser && existingUser.status === "pending") {
      existingUser.name = fullName;
      existingUser.password = hashedPassword;
      existingUser.orgName = finalOrgName;
      existingUser.role = finalRole;
      existingUser.status = "active";
      await existingUser.save();
      user = existingUser;
    } else {
      user = await User.create({
        name: fullName,
        email: normalizedEmail,
        orgName: finalOrgName,
        password: hashedPassword,
        role: finalRole,
        status: "active",
      });
    }

    if (invite) {
      await Invitation.findOneAndUpdate({ token }, { status: "accepted" });
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        org: user.orgName,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Critical Registration Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error." },
      { status: 500 },
    );
  }
}
