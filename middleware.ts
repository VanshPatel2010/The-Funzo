import { NextRequest, NextResponse } from "next/server";
import { withSecurityHeaders } from "@/lib/security-headers";
import { getToken } from "next-auth/jwt";

// ─── Middleware for protecting /admin routes and adding security headers ────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
    });

    if (!token) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Apply security headers to all responses
  const response = NextResponse.next();
  return withSecurityHeaders(response);
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ["/admin/:path*", "/:path*"],
};
