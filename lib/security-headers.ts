/**
 * Security headers middleware configuration
 * Add to your middleware.ts to apply headers to all responses
 */

import { NextResponse } from "next/server";

/**
 * Security headers to prevent common attacks
 */
export const securityHeaders = {
  // Prevent clickjacking
  "X-Frame-Options": "SAMEORIGIN",

  // Prevent MIME type sniffing
  "X-Content-Type-Options": "nosniff",

  // Enable XSS protection in older browsers
  "X-XSS-Protection": "1; mode=block",

  // Referrer Policy - limit information sent to other sites
  "Referrer-Policy": "strict-origin-when-cross-origin",

  // Content Security Policy - prevent inline scripts and restrict resource loading
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: *.supabase.co *.vercel.app; " +
    "font-src 'self' data:; " +
    "connect-src 'self' *.supabase.co *.vercel.app; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self'",

  // Strict Transport Security - enforce HTTPS
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",

  // Permissions Policy - restrict browser features
  "Permissions-Policy":
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

/**
 * Apply security headers to all responses
 * Call this function in your middleware
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add SameSite cookie attribute for CSRF protection
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    const updatedCookie = setCookie
      .split(",")
      .map((cookie) => {
        if (!cookie.includes("SameSite=")) {
          return `${cookie.trim()}; SameSite=Strict`;
        }
        return cookie;
      })
      .join(",");
    response.headers.set("set-cookie", updatedCookie);
  }

  return response;
}
