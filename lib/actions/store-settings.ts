"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase";
import {
  storeSettingsFormSchema,
  type StoreSettingsFormData,
} from "@/lib/types";

export async function updateStoreSettings(data: StoreSettingsFormData) {
  try {
    const validatedData = storeSettingsFormSchema.parse({
      ...data,
      instagram_url: data.instagram_url?.trim() || null,
      address_url: data.address_url?.trim() || null,
    });
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

    revalidatePath("/", "layout");
    revalidatePath("/admin/(protected)/settings");

    return { success: true };
  } catch (error) {
    console.error("Update store settings error:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.issues[0].message
          : "Failed to update store settings",
    };
  }
}
