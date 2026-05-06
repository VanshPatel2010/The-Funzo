import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import { Category } from "@/lib/types";

async function CategoriesContent() {
  const supabase = createAdminClient();

  try {
    const { data: categories, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw error;
    }

    return (
      <CategoriesTable initialCategories={(categories || []) as Category[]} />
    );
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
        <p className="text-red-400">
          Failed to load categories. Please try again.
        </p>
      </div>
    );
  }
}

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
        <p className="text-[#999999]">
          Manage product categories. Drag rows to reorder, or use the edit and
          delete buttons.
        </p>
      </div>

      {/* Content */}
      <Suspense
        fallback={
          <div className="bg-[#252525] rounded-xl border border-[#333333] p-12">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-[#1A1A1A] rounded-lg animate-pulse"
                />
              ))}
            </div>
          </div>
        }
      >
        <CategoriesContent />
      </Suspense>
    </div>
  );
}
