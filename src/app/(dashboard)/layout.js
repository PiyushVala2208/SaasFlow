import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PageWrapper from "@/components/PageWrapper";
import CommandPalette from "@/components/dashboard/CommandPalette";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  let userRole = "Employee";

  try {
    if (token) {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      console.log("SERVER SIDE PAYLOAD ROLE:", payload.role);

      userRole = payload.role || "Employee";
    }
  } catch (err) {
    console.error("Dashboard layout: Token verification failed", err);
  }

  return (
    <div className="flex min-h-screen bg-[#020202] text-white">
      <Sidebar userRole={userRole} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <PageWrapper>{children}</PageWrapper>
          </div>
        </main>
      </div>
      <CommandPalette />
    </div>
  );
}
