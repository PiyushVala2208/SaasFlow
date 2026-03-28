import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const requestUser = await User.findById(decoded.id);
    if (!requestUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSuperAdmin = requestUser.role === "SuperAdmin";

    const filter = isSuperAdmin ? {} : { orgName: requestUser.orgName };

    const revenueData = await User.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const formattedData = revenueData.map((item) => ({
      name: monthNames[item._id - 1],
      total: item.count * 22,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Chart API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 },
    );
  }
}
