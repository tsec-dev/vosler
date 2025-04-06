// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export default function middleware(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const path = req.nextUrl.pathname;

    console.log(`Middleware for ${path}, userId: ${userId || 'not authenticated'}`);

    // If already at sign-in and authenticated, redirect to dashboard
    if (path === "/sign-in" && userId) {
      console.log("Redirecting authenticated user to dashboard");
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Allow unauthenticated access only to sign-in
    if (path === "/sign-in") {
      return NextResponse.next();
    }

    // For all other routes, redirect to sign-in if not authenticated
    if (!userId) {
      console.log(`No userId for path: ${path}, redirecting to sign-in`);
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Authenticated users can access all protected routes
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    const path = req.nextUrl.pathname;
    if (path !== "/sign-in") {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
