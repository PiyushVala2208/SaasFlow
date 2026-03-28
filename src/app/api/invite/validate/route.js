import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Invitation from "@/models/Invitation";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ message: "Token missing" }, { status: 400 });
    }

    await connectDB();

    const invite = await Invitation.findOne({
      token: token,
      status: "pending",
    });

    if (!invite) {
      return NextResponse.json(
        { isValid: false, message: "Invalid or expired invitation" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      isValid: true,
      email: invite.email,
      orgName: invite.orgName,
      role: invite.role,
    });
  } catch (error) {
    console.error("Validation Error:", error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
