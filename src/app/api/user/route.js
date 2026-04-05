import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token found" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = await User.find({}).select("_id name email").lean();

    return NextResponse.json({
      currentUser: {
        name: decoded.name,
        email: decoded.email,
        id: decoded.id,
      },
      allUsers: users,
    });
  } catch (err) {
    console.error("User fetch error details:", err.message);

    return NextResponse.json(
      { error: err.message || "Invalid or expired token" },
      { status: 401 },
    );
  }
}
