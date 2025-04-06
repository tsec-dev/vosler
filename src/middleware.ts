// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  // Get the current path
  const path = req.nextUrl.pathname;
  
  // Log information about the request for debugging
  console.log(`Middleware processing path: ${path}`);
  
  // Only protect dashboard routes
  if (path.startsWith("/dashboard")) {
    // Basic auth check
    const hasClerkCookie = req.cookies.has("__session") || 
                          req.cookies.has("__client");
    
    if (!hasClerkCookie) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
  
  return NextResponse.next();
}

// Only apply to dashboard routes to minimize risk of problems
export const config = {
  matcher: ["/dashboard/:path*"],
};