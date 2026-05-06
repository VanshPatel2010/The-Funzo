import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Product, Category } from "@/lib/types";

async function ProductsContent() {
  const supabase = createAdminClient();

  try {
    const [
      { data: products, error: productsError },
      { data: categories, error: categoriesError },
    ] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true }),
    ]);

    if (productsError) throw productsError;
    if (categoriesError) throw categoriesError;

    return (
      <ProductsTable
        initialProducts={(products || []) as Product[]}
        categories={(categories || []) as Category[]}
      />
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return (
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-6">
        <p className="text-red-400">
          Failed to load products. Please try again.
        </p>
      </div>
    );
  }
}

export default function AdminProductsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Products</h1>
        <p className="text-[#999999]">
          Manage your store&apos;s products. Add, edit, or remove items from
          your catalog.
        </p>
      </div>

      {/* Content */}
      <Suspense
        fallback={
          <div className="bg-[#252525] rounded-xl border border-[#333333] p-12">
            <div className="space-y-4">
              <div className="h-8 bg-[#333333] rounded animate-pulse w-1/4"></div>
              <div className="h-4 bg-[#333333] rounded animate-pulse w-1/2"></div>
            </div>
          </div>
        }
      >
        <ProductsContent />
      </Suspense>
    </div>
  );
}
