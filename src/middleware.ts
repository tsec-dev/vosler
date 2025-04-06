// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export default function middleware(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const path = req.nextUrl.pathname;
    
    // If already at sign-in or sign-up page AND authenticated, 
    // redirect to home/dashboard to prevent redirect loops
    if ((path === "/sign-in" || path === "/sign-up") && userId) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    
    // Allow unauthenticated access to sign-in and sign-up pages
    if (path === "/sign-in" || path === "/sign-up") {
      return NextResponse.next();
    }
    
    // Redirect to sign-in if not authenticated and trying to access protected routes
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    
    // For all other cases, authenticated users can access protected routes
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Only redirect to sign-in for non-authentication pages to avoid loops
    const path = req.nextUrl.pathname;
    if (path !== "/sign-in" && path !== "/sign-up") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};