import { type ClassValue, clsx } from "clsx";

/**
 * Merge Tailwind CSS classes with proper precedence.
 * Uses clsx for conditional classes.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format a date string into a human-readable format.
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Sleep for a given number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate a random ID string.
 */
export function generateId(length: number = 12): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}

/**
 * Safely parse image data from Supabase into a string array.
 * Handles native arrays, JSON strings, Postgres array literals, and single strings.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseImages(imagesData: any): string[] {
  if (!imagesData) return [];

  if (Array.isArray(imagesData)) {
    return imagesData;
  }

  if (typeof imagesData === "string") {
    // Handle Postgres array literal: "{url1,url2}"
    if (imagesData.startsWith("{") && imagesData.endsWith("}")) {
      const inner = imagesData.slice(1, -1);
      if (!inner) return [];
      return inner
        .split(",")
        .map((s) => s.replace(/^"/, "").replace(/"$/, "").trim());
    }

    // Handle JSON string: '["url1","url2"]'
    try {
      const parsed = JSON.parse(imagesData);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If it's not JSON and not a Postgres array, treat it as a single URL
    }

    // Treat as single string URL
    return [imagesData];
  }

  return [];
}
