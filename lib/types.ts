import { z } from "zod";

// ─── Database Types ──────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category_id: string;
  images: string[];
  tags: string[];
  is_featured: boolean;
  is_available: boolean;
  age_range: string | null;
  created_at: string;
}

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface Admin {
  id: string;
  email: string;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  contact_number: string;
  whatsapp_number: string;
  instagram_url: string | null;
  address_url: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  display_order: z.number().int().min(0).optional(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().optional().nullable(),
  price: z.number().min(0, "Price must be non-negative"),
  category_id: z.string().uuid("Invalid category"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(4, "You can add up to 4 images")
    .default([]),
  tags: z.array(z.string()).default([]),
  age_range: z.string().optional().nullable(),
  is_featured: z.boolean().default(false),
  is_available: z.boolean().default(true),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export const storeSettingsFormSchema = z.object({
  contact_number: z.string().min(1, "Contact number is required").max(30),
  whatsapp_number: z.string().min(1, "WhatsApp number is required").max(30),
  instagram_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: "Instagram link must be a valid URL",
    }),
  address_url: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine((value) => !value || /^https?:\/\//i.test(value), {
      message: "Address link must be a valid URL",
    }),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsFormSchema>;
