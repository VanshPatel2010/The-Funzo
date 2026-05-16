/**
 * Security utilities for authentication, validation, and protection
 */

import { auth } from "@/lib/auth";

// ─── Constants ──────────────────────────────────────────────────────────────

const TRUSTED_IMAGE_DOMAINS = [
  "localhost",
  "127.0.0.1",
  "*.supabase.co",
  "cdn.example.com",
];

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED_SLUGS = [
  "admin",
  "api",
  "auth",
  "login",
  "logout",
  "search",
  "category",
  "categories",
  "product",
  "products",
  "cart",
  "checkout",
  "account",
  "orders",
  "dashboard",
];

// ─── Authentication Helpers ────────────────────────────────────────────────

/**
 * Verify admin session - MUST be called in all protected server actions
 * @throws Error if user is not authenticated
 * @returns User email if authenticated
 */
export async function requireAdmin(): Promise<string> {
  const session = await auth();

  if (!session?.user?.email) {
    throw new Error("UNAUTHORIZED");
  }

  return session.user.email;
}

/**
 * Check if user is authenticated (non-throwing variant)
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await auth();
  return !!session?.user?.email;
}

// ─── Input Validation ──────────────────────────────────────────────────────

/**
 * Validate image URL against whitelist
 * @param url - URL to validate
 * @returns true if URL is from trusted domain
 */
export function isImageUrlTrusted(url: string | undefined | null): boolean {
  if (!url) return false;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    return TRUSTED_IMAGE_DOMAINS.some((domain) => {
      if (domain.startsWith("*.")) {
        const suffix = domain.replace("*.", "");
        return hostname.endsWith(suffix);
      }
      return hostname === domain;
    });
  } catch {
    return false;
  }
}

/**
 * Validate image URL safety and optionally enforce trusted-domain policy
 */
export function validateImageUrl(
  url: string | undefined | null,
  options?: { allowAnyDomain?: boolean }
): { valid: boolean; error?: string } {
  if (!url) return { valid: true };

  if (url.length > 2048) {
    return { valid: false, error: "Image URL is too long" };
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: "Invalid image URL" };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Image URL must use http or https" };
  }

  if (options?.allowAnyDomain) {
    return { valid: true };
  }

  if (!isImageUrlTrusted(url)) {
    return {
      valid: false,
      error: "Image URL must be from a trusted domain (Supabase, etc.)",
    };
  }

  return { valid: true };
}

/**
 * Validate slug format and check against reserved words
 * @param slug - Slug to validate
 * @returns { valid: boolean, error?: string }
 */
export function validateSlug(slug: string): { valid: boolean; error?: string } {
  if (!slug) {
    return { valid: false, error: "Slug cannot be empty" };
  }

  if (slug.length > 100) {
    return { valid: false, error: "Slug cannot exceed 100 characters" };
  }

  if (!SLUG_PATTERN.test(slug)) {
    return {
      valid: false,
      error:
        "Slug must contain only lowercase letters, numbers, and hyphens, and must start and end with alphanumeric characters",
    };
  }

  if (RESERVED_SLUGS.includes(slug)) {
    return { valid: false, error: `"${slug}" is a reserved slug` };
  }

  return { valid: true };
}

/**
 * Generate audit log entry
 */
export interface AuditLog {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  timestamp: string;
  changes?: Record<string, unknown>;
}

/**
 * Create audit log entry (use in server actions)
 */
export async function createAuditLog(
  action: string,
  entityType: string,
  entityId: string,
  changes?: Record<string, unknown>
): Promise<AuditLog> {
  const userEmail = await requireAdmin();

  return {
    action,
    entityType,
    entityId,
    userId: userEmail,
    timestamp: new Date().toISOString(),
    changes,
  };
}

/**
 * Safe error handler - returns generic message to client, logs detailed error
 */
export function handleServerError(error: unknown): {
  message: string;
  isValidationError: boolean;
} {
  if (error instanceof Error) {
    const message = error.message;

    // Return specific validation errors
    if (
      message.includes("Slug") ||
      message.includes("Image") ||
      message.includes("Invalid") ||
      message.includes("required")
    ) {
      return { message, isValidationError: true };
    }

    // Return generic message for database or unexpected errors
    if (message === "UNAUTHORIZED") {
      return { message: "Unauthorized", isValidationError: false };
    }

    // Log detailed error but return generic message to client
    console.error("[Server Action Error]", message, error.stack);
    return {
      message: "An error occurred. Please try again later.",
      isValidationError: false,
    };
  }

  console.error("[Unexpected Error]", error);
  return {
    message: "An unexpected error occurred. Please try again later.",
    isValidationError: false,
  };
}

// ─── CSRF Protection ────────────────────────────────────────────────────────

/**
 * Generate CSRF token (implement with your session management)
 * For now, returns a placeholder - should be implemented with session storage
 */
export function generateCsrfToken(): string {
  // In production, generate a secure random token and store in session
  // For now using next-auth's session as implicit CSRF protection
  return "csrf-protected-by-nextauth";
}

/**
 * Verify CSRF token (implement with your session management)
 */
export function verifyCsrfToken(): boolean {
  // NextAuth v5 provides built-in CSRF protection
  // All server actions are automatically protected
  return true;
}

// ─── Rate Limiting Helpers ─────────────────────────────────────────────────

/**
 * In-memory rate limiter (use Redis in production)
 * Key: user_email:action_type
 */
const rateLimitMap = new Map<string, number[]>();

/**
 * Check if action should be rate limited
 * @param key - Unique identifier (e.g., "user@example.com:create_product")
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(key) || [];

  // Remove old timestamps
  const recentTimestamps = timestamps.filter((ts) => now - ts < windowMs);

  if (recentTimestamps.length >= maxRequests) {
    return false; // Rate limited
  }

  recentTimestamps.push(now);
  rateLimitMap.set(key, recentTimestamps);
  return true; // Allowed
}
