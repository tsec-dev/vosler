// src/middleware.ts
import { clerkMiddleware, auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// Prepare Clerk’s middleware handler.
const clerkHandler = clerkMiddleware();

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  // Run Clerk's middleware first, passing both arguments.
  const clerkResponse = await clerkHandler(req, event);
  if (clerkResponse) return clerkResponse;

  // Now run your custom logic.
  // Retrieve authentication details using Clerk's auth helper.
  // (Note: auth() returns a promise that must be awaited.)
  const { userId } = await auth();

  const { pathname } = req.nextUrl;

  // If the user is authenticated...
  if (userId) {
    // When on the complete-profile page: if the profile is already completed, redirect to dashboard.
    if (pathname === "/complete-profile") {
      const profileCompleted =
        req.cookies.get("profile_completed")?.value === "true";
      if (profileCompleted) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else {
      // On any other route: if the profile is not completed, redirect to complete-profile.
      const profileCompleted =
        req.cookies.get("profile_completed")?.value === "true";
      if (!profileCompleted) {
        return NextResponse.redirect(new URL("/complete-profile", req.url));
      }
    }
  }

  // If no redirect is necessary, continue.
  return NextResponse.next();
}

// Configure the matcher to run middleware on your desired routes.
export const config = {
  matcher: [
    // Exclude static files (those with a dot), Next.js internals (_next), and public auth pages.
    "/((?!.*\\..*|_next|sign-in|sign-up|complete-profile).*)",
    "/dashboard(.*)",
  ],
};
