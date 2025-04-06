// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export default function middleware(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const path = req.nextUrl.pathname;
    
    // Allow access to sign-in and sign-up pages without authentication
    if (path === "/sign-in" || path === "/sign-up") {
      return NextResponse.next();
    }
    
    // Redirect to sign-in if not authenticated and trying to access protected routes
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Fallback to redirecting to sign-in page if something goes wrong
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};