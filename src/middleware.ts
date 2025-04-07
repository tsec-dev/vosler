// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default clerkMiddleware();

export const config = {
  // This matcher protects all routes EXCEPT those that contain a dot, _next, sign-in, sign-up, or complete-profile.
  matcher: [
    "/((?!.*\\..*|_next|sign-in|sign-up|complete-profile).*)",
    "/dashboard(.*)",
  ],
};
