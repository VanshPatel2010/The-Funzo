"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase";
import {
  storeSettingsFormSchema,
  type StoreSettingsFormData,
} from "@/lib/types";
import {
  requireAdmin,
  handleServerError,
  checkRateLimit,
  createAuditLog,
} from "@/lib/security";

// ✅ Validate store settings URLs to prevent phishing
function validateStoreSettingsUrls(data: StoreSettingsFormData): void {
  const urlFields = ["instagram_url", "address_url"];

  for (const field of urlFields) {
    const url = data[field as keyof StoreSettingsFormData] as string | null;
    if (!url) continue;

    try {
      const urlObj = new URL(url);

      // Whitelist allowed protocols
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error(`${field} must use HTTP or HTTPS`);
      }

      // Prevent data: and javascript: URLs
      if (url.startsWith("data:") || url.startsWith("javascript:")) {
        throw new Error(`${field} contains invalid protocol`);
      }

      // For Instagram, verify domain
      if (field === "instagram_url" && !url.includes("instagram.com")) {
        // Allow relative Instagram usernames to be converted to full URLs later
        if (url.startsWith("@")) {
          // This is fine - will be converted to Instagram profile URL on frontend
          continue;
        }
        if (!url.includes("instagram.com")) {
          throw new Error(
            "Instagram URL must be a valid Instagram profile link"
          );
        }
      }

      // For address, accept Google Maps or similar
      if (field === "address_url" && !url.includes("maps.google.com")) {
        // Accept other map services as well
        if (
          !url.includes("google.com") &&
          !url.includes("apple.com") &&
          !url.includes("openstreetmap")
        ) {
          // Allow plain text addresses or relative URLs for now
          continue;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Invalid URL format for ${field}`);
    }
  }
}

export async function updateStoreSettings(data: StoreSettingsFormData) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:update_settings`, 10, 3600000)) {
      throw new Error("Too many settings updates. Please try again later.");
    }

    // ✅ Input validation
    const validatedData = storeSettingsFormSchema.parse({
      ...data,
      instagram_url: data.instagram_url?.trim() || null,
      address_url: data.address_url?.trim() || null,
    });

    // ✅ URL validation for social/location links
    validateStoreSettingsUrls(validatedData);

    const client = createAdminClient();

    const { data: existing } = await client
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    const payload = {
      ...validatedData,
      updated_at: new Date().toISOString(),
    };

    const query = existing?.id
      ? client.from("store_settings").update(payload).eq("id", existing.id)
      : client.from("store_settings").insert(payload);

    const { error } = await query;

    if (error) {
      throw error;
    }

    // ✅ Audit logging
    await createAuditLog("UPDATE", "store_settings", existing?.id || "new", {
      fields: Object.keys(validatedData),
    });

    revalidatePath("/", "layout");
    revalidatePath("/admin/(protected)/settings");

    return { success: true };
  } catch (error) {
    const { message, isValidationError } = handleServerError(error);
    return {
      success: false,
      error: message,
      isValidationError,
    };
  }
}
