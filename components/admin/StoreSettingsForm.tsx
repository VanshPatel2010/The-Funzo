"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  storeSettingsFormSchema,
  type StoreSettings,
  type StoreSettingsFormData,
} from "@/lib/types";
import { updateStoreSettings } from "@/lib/actions/store-settings";

interface StoreSettingsFormProps {
  settings: StoreSettings;
}

export function StoreSettingsForm({ settings }: StoreSettingsFormProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StoreSettingsFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(storeSettingsFormSchema) as any,
    defaultValues: {
      contact_number: settings.contact_number,
      whatsapp_number: settings.whatsapp_number,
      instagram_url: settings.instagram_url || "",
      address_url: settings.address_url || "",
    },
  });

  const onSubmit = async (data: StoreSettingsFormData) => {
    setIsSubmitting(true);
    setStatus(null);
    setError(null);

    const result = await updateStoreSettings(data);

    if (result.success) {
      setStatus("Settings saved successfully.");
    } else {
      setError(result.error || "Failed to save settings.");
    }

    setIsSubmitting(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-[#252525] rounded-2xl border border-[#333333] p-8 shadow-lg space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-white">Store Contact Details</h2>
        <p className="text-[#999999] mt-2">
          Update the phone number, WhatsApp number, Instagram link, and address
          link shown on the customer-facing website.
        </p>
      </div>

      {status && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">
          {status}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Contact Number
          </label>
          <input
            type="text"
            {...register("contact_number")}
            className="w-full rounded-lg border border-[#333333] bg-[#1A1A1A] px-4 py-2.5 text-white focus:outline-none focus:border-[#E84A2F]"
            placeholder="+91 98765 43210"
          />
          {errors.contact_number && (
            <p className="mt-1 text-xs text-red-400">
              {errors.contact_number.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            WhatsApp Number
          </label>
          <input
            type="text"
            {...register("whatsapp_number")}
            className="w-full rounded-lg border border-[#333333] bg-[#1A1A1A] px-4 py-2.5 text-white focus:outline-none focus:border-[#E84A2F]"
            placeholder="919876543210"
          />
          {errors.whatsapp_number && (
            <p className="mt-1 text-xs text-red-400">
              {errors.whatsapp_number.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Instagram Page Link
          </label>
          <input
            type="url"
            {...register("instagram_url")}
            className="w-full rounded-lg border border-[#333333] bg-[#1A1A1A] px-4 py-2.5 text-white focus:outline-none focus:border-[#E84A2F]"
            placeholder="https://instagram.com/your-page"
          />
          {errors.instagram_url && (
            <p className="mt-1 text-xs text-red-400">
              {errors.instagram_url.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Address Link
          </label>
          <input
            type="url"
            {...register("address_url")}
            className="w-full rounded-lg border border-[#333333] bg-[#1A1A1A] px-4 py-2.5 text-white focus:outline-none focus:border-[#E84A2F]"
            placeholder="https://maps.google.com/..."
          />
          {errors.address_url && (
            <p className="mt-1 text-xs text-red-400">
              {errors.address_url.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-lg bg-[#E84A2F] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#D63A1F] disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
