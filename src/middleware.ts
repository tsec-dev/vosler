// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function will handle the profile check part
export function middleware(req: NextRequest) {
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Skip checking for API routes, Next.js internals, or static files
  if (path.startsWith("/api") || 
      path.includes("/_next") || 
      path.includes(".") ||
      path === "/sign-in" || 
      path === "/sign-up") {
    return NextResponse.next();
  }
  
  // Check for existing user cookie and profile completion
  const existingUserCookie = req.cookies.get("existing_user")?.value === "true";
  const profileCompleted = req.cookies.get("profile_completed")?.value === "true";
  
  // If profile isn't completed and user isn't on the profile-setup page, redirect
  if (!profileCompleted && !existingUserCookie && path !== "/profile-setup") {
    console.log("Redirecting to profile setup");
    const profileSetupUrl = new URL("/profile-setup", req.url);
    return NextResponse.redirect(profileSetupUrl);
  }
  
  // If profile is completed and user is on the profile-setup page, redirect to dashboard
  if (profileCompleted && path === "/profile-setup") {
    const dashboardUrl = new URL("/dashboard", req.url);
    return NextResponse.redirect(dashboardUrl);
  }
  
  return NextResponse.next();
}

// Configure the matcher to apply middleware to all routes EXCEPT those that:
// - Contain a dot (static files)
// - Include _next (Next.js internal routes)
// - Are sign-in or sign-up routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next|sign-in|sign-up).*)",
    "/dashboard(.*)",
  ],
};