"use server";

import { createAdminClient } from "@/lib/supabase";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { categoryFormSchema, CategoryFormData } from "@/lib/types";
import {
  requireAdmin,
  validateSlug,
  validateImageUrl,
  handleServerError,
  checkRateLimit,
  createAuditLog,
} from "@/lib/security";

const categoryIdSchema = z.string().uuid();

function revalidateCategoryPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidatePath("/search");

  if (slug) {
    revalidatePath(`/category/${slug}`);
    revalidatePath(`/categories/${slug}`);
  }
}

/**
 * Create a new category (PROTECTED - Admin only)
 */
export async function createCategory(data: CategoryFormData) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:create_category`, 20, 3600000)) {
      throw new Error("Too many category creations. Please try again later.");
    }

    // ✅ Input validation
    const validatedData = categoryFormSchema.parse(data);

    // Validate slug if provided
    if (validatedData.slug) {
      const slugValidation = validateSlug(validatedData.slug);
      if (!slugValidation.valid) {
        throw new Error(slugValidation.error || "Invalid category slug");
      }
    }

    const imageValidation = validateImageUrl(validatedData.image_url, {
      allowAnyDomain: true,
    });
    if (!imageValidation.valid) {
      throw new Error(imageValidation.error || "Invalid image URL");
    }

    const client = createAdminClient();

    const { data: category, error } = await client
      .from("categories")
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;

    // ✅ Audit logging
    await createAuditLog("CREATE", "category", category.id, {
      name: category.name,
      slug: category.slug,
    });

    revalidateCategoryPaths(category.slug);
    return { success: true, category };
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
 * Update a category (PROTECTED - Admin only)
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:update_category`, 30, 3600000)) {
      throw new Error("Too many category updates. Please try again later.");
    }

    // ✅ Input validation
    categoryIdSchema.parse(id);
    const validatedData = categoryFormSchema.partial().parse(data);

    // Validate slug if provided
    if (validatedData.slug) {
      const slugValidation = validateSlug(validatedData.slug);
      if (!slugValidation.valid) {
        throw new Error(slugValidation.error || "Invalid category slug");
      }
    }

    if (validatedData.image_url !== undefined) {
      const imageValidation = validateImageUrl(validatedData.image_url, {
        allowAnyDomain: true,
      });
      if (!imageValidation.valid) {
        throw new Error(imageValidation.error || "Invalid image URL");
      }
    }

    const client = createAdminClient();

    const { data: category, error } = await client
      .from("categories")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // ✅ Audit logging
    await createAuditLog("UPDATE", "category", id, validatedData);

    revalidateCategoryPaths(category.slug);
    return { success: true, category };
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
 * Delete a category (PROTECTED - Admin only)
 */
export async function deleteCategory(id: string) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:delete_category`, 20, 3600000)) {
      throw new Error("Too many category deletions. Please try again later.");
    }

    // ✅ Input validation
    categoryIdSchema.parse(id);

    const client = createAdminClient();

    const { data: category, error } = await client
      .from("categories")
      .delete()
      .eq("id", id)
      .select("slug")
      .single();

    if (error) throw error;

    // ✅ Audit logging
    await createAuditLog("DELETE", "category", id);

    revalidateCategoryPaths(category?.slug);
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
 * Reorder categories (drag and drop) (PROTECTED - Admin only)
 */
export async function reorderCategories(
  updates: Array<{ id: string; display_order: number }>
) {
  try {
    // ✅ Authentication check
    const adminEmail = await requireAdmin();

    // ✅ Rate limiting
    if (!checkRateLimit(`${adminEmail}:reorder_categories`, 30, 3600000)) {
      throw new Error("Too many reorder operations. Please try again later.");
    }

    // ✅ Input validation
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error("No updates provided");
    }

    const client = createAdminClient();

    // Update all categories in batch
    const updatePromises = updates.map(({ id, display_order }) => {
      categoryIdSchema.parse(id);
      if (typeof display_order !== "number" || display_order < 0) {
        throw new Error("Invalid display order");
      }
      return client.from("categories").update({ display_order }).eq("id", id);
    });

    const results = await Promise.all(updatePromises);

    // Check for errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    // ✅ Audit logging
    await createAuditLog("REORDER", "categories", "batch", {
      count: updates.length,
    });

    revalidateCategoryPaths();
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
