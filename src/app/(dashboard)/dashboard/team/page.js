import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import TeamManager from "@/components/shared/TeamManagerWrapper";

export default async function TeamPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let teamMembers = [];
  let decoded = null;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();
    const rawMembers = await User.find({ orgName: decoded.orgName }).lean();

    teamMembers = JSON.parse(JSON.stringify(rawMembers));
  } catch (error) {
    console.error("Team Fetch Error:", error);
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <TeamManager initialMembers={teamMembers} orgName={decoded.orgName} />
    </div>
  );
}
