// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export default function middleware(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const path = req.nextUrl.pathname;

    console.log(`Middleware for ${path}, userId: ${userId || 'not authenticated'}`);

    // Define public paths that don't require authentication
    const isPublicPath = path === "/" || path === "/sign-in";
    
    // If user is on a public path and authenticated, redirect to dashboard
    if (isPublicPath && userId) {
      console.log("Redirecting authenticated user to dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // If user is on a protected path and not authenticated, redirect to sign-in
    if (!isPublicPath && !userId) {
      console.log(`No userId for path: ${path}, redirecting to sign-in`);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Otherwise, proceed normally
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};