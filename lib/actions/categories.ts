"use server";

import { createAdminClient } from "@/lib/supabase";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { categoryFormSchema, CategoryFormData } from "@/lib/types";

const categoryIdSchema = z.string().uuid();

/**
 * Create a new category
 */
export async function createCategory(data: CategoryFormData) {
  try {
    const validatedData = categoryFormSchema.parse(data);
    const client = createAdminClient();

    const { data: category, error } = await client
      .from("categories")
      .insert([validatedData])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Create category error:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.issues[0].message
          : "Failed to create category",
    };
  }
}

/**
 * Update a category
 */
export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
) {
  try {
    categoryIdSchema.parse(id);
    const validatedData = categoryFormSchema.partial().parse(data);
    const client = createAdminClient();

    const { data: category, error } = await client
      .from("categories")
      .update(validatedData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admin/categories");
    return { success: true, category };
  } catch (error) {
    console.error("Update category error:", error);
    return {
      success: false,
      error:
        error instanceof z.ZodError
          ? error.issues[0].message
          : "Failed to update category",
    };
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(id: string) {
  try {
    categoryIdSchema.parse(id);
    const client = createAdminClient();

    const { error } = await client.from("categories").delete().eq("id", id);

    if (error) throw error;

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Delete category error:", error);
    return {
      success: false,
      error: "Failed to delete category",
    };
  }
}

/**
 * Reorder categories (drag and drop)
 */
export async function reorderCategories(
  updates: Array<{ id: string; display_order: number }>
) {
  try {
    const client = createAdminClient();

    // Update all categories in batch
    const updatePromises = updates.map(({ id, display_order }) =>
      client.from("categories").update({ display_order }).eq("id", id)
    );

    const results = await Promise.all(updatePromises);

    // Check for errors
    for (const result of results) {
      if (result.error) throw result.error;
    }

    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    console.error("Reorder categories error:", error);
    return {
      success: false,
      error: "Failed to reorder categories",
    };
  }
}
