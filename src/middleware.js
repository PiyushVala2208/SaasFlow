import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (pathname === "/login" || pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      if (payload.status === "suspended") {
        const response = NextResponse.redirect(
          new URL("/login?error=suspended", req.url),
        );
        response.cookies.delete("token");
        return response;
      }

      const superAdminPaths = ["/dashboard/admin-panel", "/api/superadmin"];
      if (superAdminPaths.some((path) => pathname.startsWith(path))) {
        if (payload.role !== "SuperAdmin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      const adminOnlyPaths = ["/dashboard/team", "/dashboard/settings"];
      if (adminOnlyPaths.some((path) => pathname.startsWith(path))) {
        if (payload.role !== "Admin" && payload.role !== "SuperAdmin") {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        }
      }

      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("user-id", payload.id);
      requestHeaders.set("user-role", payload.role);
      requestHeaders.set("user-status", payload.status);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    } catch (error) {
      console.error("Middleware Auth Error:", error);
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup", "/api/superadmin/:path*"],
};
