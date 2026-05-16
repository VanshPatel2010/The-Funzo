import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withSecurityHeaders } from "@/lib/security-headers";

// ─── Middleware for adding security headers ────────────────────────────────

export function middleware(request: NextRequest) {
  // Skip middleware for static assets
  const pathname = request.nextUrl.pathname;
  if (pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|manifest|robots|sitemap|xml|txt)$/i)) {
    return NextResponse.next();
  }

  // Apply security headers to all other responses
  const response = NextResponse.next();
  return withSecurityHeaders(response);
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match everything by default, we'll filter in the middleware function above
    "/:path*",
  ],
};
