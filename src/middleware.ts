// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const publicRoutes = ["/", "/sign-in", "/sign-up"];

export default function middleware(req: NextRequest) {
  const { userId } = getAuth(req);
  const path = req.nextUrl.pathname;
  
  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.includes(path);

  // Allow access to public routes regardless of auth status
  if (isPublicRoute) {
    // If user is authenticated and trying to access sign-in, redirect to dashboard
    if (userId && (path === "/sign-in" || path === "/sign-up")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to sign-in if not authenticated
  if (!userId) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // User is authenticated and accessing a protected route
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and static resources
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)",
  ],
};