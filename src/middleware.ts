// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function middleware(req: NextRequest) {
  // Await auth() (no arguments needed) to get authentication details.
  const { userId, sessionId } = await auth();
  const { pathname } = req.nextUrl;
  
  // Example: if the user is logged in and on the profile-setup page,
  // check if their profile is completed (based on a cookie) and redirect accordingly.
  if (userId && pathname === "/profile-setup") {
    const profileCompleted =
      req.cookies.get("profile_completed")?.value === "true";
    if (profileCompleted) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
  
  // For authenticated users on non-public routes, enforce profile completion.
  if (userId) {
    if (
      pathname.startsWith("/api") ||
      pathname.includes("/_next") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }
    const profileCompleted =
      req.cookies.get("profile_completed")?.value === "true";
    if (!profileCompleted && pathname !== "/profile-setup") {
      return NextResponse.redirect(new URL("/profile-setup", req.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
