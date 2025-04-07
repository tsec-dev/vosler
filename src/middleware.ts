// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use Clerk's middleware to protect routes
export default clerkMiddleware();

// Configure the matcher to apply middleware to all routes EXCEPT those that:
// - Contain a dot (static files)
// - Include _next (Next.js internal routes)
// - Are sign-in, sign-up, or complete-profile routes
export const config = {
  matcher: [
    "/((?!.*\\..*|_next|sign-in|sign-up|complete-profile).*)",
    "/dashboard(.*)",
  ],
};
