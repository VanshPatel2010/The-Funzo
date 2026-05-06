import { createAdminClient, supabase } from "@/lib/supabase";
import type { StoreSettings } from "@/lib/types";

export const defaultStoreSettings: StoreSettings = {
  id: "default-store-settings",
  contact_number: "+91 6354 955 653",
  whatsapp_number: "916354955653",
  instagram_url: "https://www.instagram.com/thefunzo1/",
  address_url: "https://share.google/R8gBmW9VrypRLlC3m",
  created_at: "",
  updated_at: "",
};

function normalizeSettings(
  settings?: Partial<StoreSettings> | null
): StoreSettings {
  return {
    ...defaultStoreSettings,
    ...settings,
    instagram_url:
      settings?.instagram_url === undefined
        ? defaultStoreSettings.instagram_url
        : settings.instagram_url,
    address_url:
      settings?.address_url === undefined
        ? defaultStoreSettings.address_url
        : settings.address_url,
  };
}

export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const { data, error } = await supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      return defaultStoreSettings;
    }

    return normalizeSettings(data as StoreSettings | null);
  } catch {
    return defaultStoreSettings;
  }
}

export async function getAdminStoreSettings(): Promise<StoreSettings> {
  try {
    const client = createAdminClient();
    const { data, error } = await client
      .from("store_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      return defaultStoreSettings;
    }

    return normalizeSettings(data as StoreSettings | null);
  } catch {
    return defaultStoreSettings;
  }
}

export function buildWhatsAppLink(
  whatsAppNumber: string,
  productName?: string
) {
  const cleanedNumber = whatsAppNumber.replace(/[^\d]/g, "");
  const message = productName
    ? `Hi! I'm interested in ${productName}. Could you share more details?`
    : "Hi! I would like to know more about your products.";

  return `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
}
