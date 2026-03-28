import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await connectDB();
    const requestUser = await User.findById(decoded.id);

    if (requestUser.role !== "SuperAdmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const orgs = await User.aggregate([
      {
        $group: {
          _id: "$orgName",
          memberCount: { $sum: 1 },
          adminEmail: { $first: "$email" }, 
          createdAt: { $min: "$createdAt" },
        },
      },
      { $sort: { createdAt: -1 } }, 
    ]);

    return NextResponse.json(orgs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orgs" }, { status: 500 });
  }
}