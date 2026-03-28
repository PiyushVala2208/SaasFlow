import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { orgName } = await params;
    await connectDB();

    const users = await User.find({ orgName })
      .select("-password")
      .sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const { orgName } = await params;
    await connectDB();

    const deletedUsers = await User.deleteMany({ orgName });

    return NextResponse.json({
      success: true,
      message: `Organization ${orgName} and ${deletedUsers.deletedCount} users deleted.`,
    });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json(
      { error: "Failed to delete organization" },
      { status: 500 },
    );
  }
}
