"use server";

import { createAdminClient } from "@/lib/supabase";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { productFormSchema, ProductFormData, Product } from "@/lib/types";
import {
  requireAdmin,
  validateSlug,
  isImageUrlTrusted,
  handleServerError,
  checkRateLimit,
  createAuditLog,
} from "@/lib/security";

const productIdSchema = z.string().uuid();

/**
 * Generate a slug from a product name with validation
 */
function generateSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const validation = validateSlug(slug);
  if (!validation.valid) {
    throw new Error(validation.error || "Invalid slug generated");
  }

  return slug;
}

/**
 * Validate product image URL
 */
function validateProductImage(imageUrl: string | undefined | null): void {
  if (!imageUrl) return;

  if (!isImageUrlTrusted(imageUrl)) {
    throw new Error("Image URL must be from a trusted domain (Supabase, etc.)");
  }

  if (imageUrl.length > 2048) {
    throw new Error("Image URL is too long");
  }
}

/**
 * Create a new product (PROTECTED - Admin only)
 */
export async function createProduct(data: ProductFormData) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:create_product`, 20, 3600000)) {
      throw new Error("Too many product creations. Please try again later.");
    }

    // ✅ Input validation
    const validatedData = productFormSchema.parse(data);
    // Validate each image in the array
    validatedData.images.forEach((imageUrl) => validateProductImage(imageUrl));

    const client = createAdminClient();

    // Generate slug from name
    const slug = generateSlug(validatedData.name);

    const { data: product, error } = await client
      .from("products")
      .insert([{ ...validatedData, slug }])
      .select()
      .single();

    if (error) throw error;

    // ✅ Audit logging
    await createAuditLog("CREATE", "product", product.id, {
      name: product.name,
      category_id: product.category_id,
    });

    revalidatePath("/", "layout");
    return { success: true, product };
  } catch (error) {
    const { message, isValidationError } = handleServerError(error);
    return {
      success: false,
      error: message,
      isValidationError,
    };
  }
}

/**
 * Update a product (PROTECTED - Admin only)
 */
export async function updateProduct(
  id: string,
  data: Partial<ProductFormData>
) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:update_product`, 30, 3600000)) {
      throw new Error("Too many product updates. Please try again later.");
    }

    // ✅ Input validation
    productIdSchema.parse(id);
    const validatedData = productFormSchema.partial().parse(data);
    // Validate each image in the array if provided
    if (validatedData.images) {
      validatedData.images.forEach((imageUrl) =>
        validateProductImage(imageUrl)
      );
    }

    const client = createAdminClient();

    // If name is provided, regenerate slug
    const updateData: Record<string, unknown> = { ...validatedData };
    if (validatedData.name) {
      updateData.slug = generateSlug(validatedData.name);
    }

    const { data: product, error } = await client
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // ✅ Audit logging
    await createAuditLog("UPDATE", "product", id, validatedData);

    revalidatePath("/", "layout");
    return { success: true, product };
  } catch (error) {
    const { message, isValidationError } = handleServerError(error);
    return {
      success: false,
      error: message,
      isValidationError,
    };
  }
}

/**
 * Delete a product (PROTECTED - Admin only)
 */
export async function deleteProduct(id: string) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:delete_product`, 20, 3600000)) {
      throw new Error("Too many product deletions. Please try again later.");
    }

    // ✅ Input validation
    productIdSchema.parse(id);

    const client = createAdminClient();

    const { error } = await client.from("products").delete().eq("id", id);

    if (error) throw error;

    // ✅ Audit logging
    await createAuditLog("DELETE", "product", id);

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    const { message } = handleServerError(error);
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Get all products (admin)
 */
export async function getProducts(filters?: {
  categoryId?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
  search?: string;
}) {
  try {
    const client = createAdminClient();
    let query = client.from("products").select("*");

    if (filters?.categoryId) {
      query = query.eq("category_id", filters.categoryId);
    }
    if (filters?.isAvailable !== undefined) {
      query = query.eq("is_available", filters.isAvailable);
    }
    if (filters?.isFeatured) {
      query = query.eq("is_featured", true);
    }
    if (filters?.search) {
      query = query.or(
        `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    const { data: products, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) throw error;

    return { success: true, products: (products || []) as Product[] };
  } catch (error) {
    console.error("Get products error:", error);
    return {
      success: false,
      products: [],
      error: "Failed to fetch products",
    };
  }
}

/**
 * Get a single product by ID
 */
export async function getProductById(id: string) {
  try {
    productIdSchema.parse(id);
    const client = createAdminClient();

    const { data: product, error } = await client
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;

    return { success: true, product };
  } catch (error) {
    console.error("Get product error:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}

/**
 * Get products by category (public)
 */
export async function getProductsByCategory(categoryId: string) {
  try {
    productIdSchema.parse(categoryId); // Reuse UUID validator
    const client = createAdminClient();

    const { data: products, error } = await client
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, products: (products || []) as Product[] };
  } catch (error) {
    console.error("Get products by category error:", error);
    return {
      success: false,
      products: [],
      error: "Failed to fetch products",
    };
  }
}

/**
 * Search products with filters
 */
export async function searchProducts(
  query: string,
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    categoryId?: string;
    tags?: string[];
  }
) {
  try {
    const client = createAdminClient();
    let dbQuery = client.from("products").select("*");

    // Text search
    if (query) {
      dbQuery = dbQuery.or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      );
    }

    // Filters
    if (filters?.categoryId) {
      dbQuery = dbQuery.eq("category_id", filters.categoryId);
    }
    if (filters?.minPrice !== undefined) {
      dbQuery = dbQuery.gte("price", filters.minPrice);
    }
    if (filters?.maxPrice !== undefined) {
      dbQuery = dbQuery.lte("price", filters.maxPrice);
    }
    if (filters?.tags && filters.tags.length > 0) {
      // For now, we'll filter on client side since Postgres array filtering is complex
      // In production, consider using full-text search
    }

    dbQuery = dbQuery.eq("is_available", true).order("created_at", {
      ascending: false,
    });

    const { data: products, error } = await dbQuery;

    if (error) throw error;

    // Client-side tag filtering if provided
    let filteredProducts = (products || []) as Product[];
    if (filters?.tags && filters.tags.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.tags!.some((tag) => product.tags.includes(tag))
      );
    }

    return { success: true, products: filteredProducts };
  } catch (error) {
    console.error("Search products error:", error);
    return {
      success: false,
      products: [],
      error: "Failed to search products",
    };
  }
}

/**
 * Get featured products (public)
 */
export async function getFeaturedProducts(limit = 6) {
  try {
    const client = createAdminClient();

    const { data: products, error } = await client
      .from("products")
      .select("*")
      .eq("is_featured", true)
      .eq("is_available", true)
      .limit(limit)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, products: (products || []) as Product[] };
  } catch (error) {
    console.error("Get featured products error:", error);
    return {
      success: false,
      products: [],
      error: "Failed to fetch featured products",
    };
  }
}

/**
 * Get product by slug (public)
 */
export async function getProductBySlug(slug: string) {
  try {
    const client = createAdminClient();

    const { data: product, error } = await client
      .from("products")
      .select(
        `
        *,
        category:categories(*)
      `
      )
      .eq("slug", slug)
      .eq("is_available", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: false, error: "Product not found" };
      }
      throw error;
    }

    return { success: true, product };
  } catch (error) {
    console.error("Get product by slug error:", error);
    return {
      success: false,
      error: "Failed to fetch product",
    };
  }
}
