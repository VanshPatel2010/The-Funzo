/**
 * Security headers middleware configuration
 * Add to your middleware.ts to apply headers to all responses
 */

import { NextResponse } from "next/server";

const isProduction = process.env.NODE_ENV === "production";

const scriptSrc = [
  "'self'",
  "'unsafe-inline'",
  !isProduction ? "'unsafe-eval'" : "",
  "*.vercel.app",
]
  .filter(Boolean)
  .join(" ");

const connectSrc = [
  "'self'",
  "*.supabase.co",
  "*.vercel.app",
  "unsplash.com",
  "*.unsplash.com",
  !isProduction ? "ws://localhost:*" : "",
  !isProduction ? "http://localhost:*" : "",
]
  .filter(Boolean)
  .join(" ");

const productionOnlyDirectives = isProduction
  ? "upgrade-insecure-requests; "
  : "";

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
  // In dev mode, additional origins (localhost, ws://) are needed for HMR
  "Content-Security-Policy":
    "default-src 'self'; " +
    `script-src ${scriptSrc}; ` +
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com; " +
    "img-src 'self' data: https: *.supabase.co *.vercel.app unsplash.com *.unsplash.com images.unsplash.com; " +
    "font-src 'self' data: fonts.gstatic.com; " +
    `connect-src ${connectSrc}; ` +
    "frame-src 'self' https://www.google.com https://maps.google.com; " +
    "object-src 'none'; " +
    "frame-ancestors 'self'; " +
    "base-uri 'self'; " +
    "form-action 'self'; " +
    productionOnlyDirectives,

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
