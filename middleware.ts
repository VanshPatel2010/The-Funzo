import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// ─── Middleware for protecting /admin routes ────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = await auth();

    if (!session) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ["/admin/:path*"],
};
