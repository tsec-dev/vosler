// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Define paths that are always public
const publicPaths = ["/sign-in", "/sign-up"];

// Check if the current path is public
const isPublicPath = (path: string) => {
  return publicPaths.find(pp => path.startsWith(pp)) !== undefined;
};

export default function middleware(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const path = req.nextUrl.pathname;

    console.log(`Middleware for ${path}, userId: ${userId || 'not authenticated'}`);

    // If the user is on a public path and authenticated, redirect to dashboard
    if (isPublicPath(path) && userId) {
      console.log("Redirecting authenticated user to dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If the user is not on a public path and not authenticated, redirect to sign-in
    if (!isPublicPath(path) && !userId && path !== "/") {
      console.log(`No userId for path: ${path}, redirecting to sign-in`);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Otherwise, proceed normally
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Only redirect to sign-in if not already there to prevent loops
    const path = req.nextUrl.pathname;
    if (!isPublicPath(path)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
  }
}

// Apply the middleware only to specific paths to avoid affecting static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|api).*)"
  ],
};