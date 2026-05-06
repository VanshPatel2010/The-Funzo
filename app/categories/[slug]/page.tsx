import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase";
import { Product } from "@/lib/types";
import { ProductCard } from "@/components/sections/ProductCard";
import { FallbackImage } from "@/components/ui";
import Link from "next/link";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

async function CategoryContent({ slug }: { slug: string }) {
  const supabase = createAdminClient();

  try {
    // First, get the category
    const { data: category, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (categoryError || !category) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Category Not Found
            </h1>
            <p className="text-[#999999] mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-[#E84A2F] text-white rounded-lg font-semibold hover:bg-[#D63A1F] transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      );
    }

    // Then, get products for this category
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (productsError) {
      throw productsError;
    }

    const categoryProducts = (products || []) as Product[];

    return (
      <>
        {/* Category Header */}
        <div className="bg-gradient-to-r from-[#1A1A1A] to-[#252525] border-b border-[#333333] py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-6">
              <Link
                href="/"
                className="text-[#E84A2F] hover:text-[#D63A1F] transition-colors"
              >
                Home
              </Link>
              <span className="text-[#999999]">/</span>
              <span className="text-[#999999]">{category.name}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {category.image_url && category.image_url.trim() && (
                <div className="h-64 rounded-lg overflow-hidden border border-[#333333] bg-[#252525]">
                  <FallbackImage
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                    fallbackSrc="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"
                  />
                </div>
              )}
              <div
                className={
                  category.image_url ? "md:col-span-2" : "md:col-span-3"
                }
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                  {category.name}
                </h1>
                {category.description && (
                  <p className="text-[#CCCCCC] text-lg mb-6">
                    {category.description}
                  </p>
                )}
                <p className="text-[#999999]">
                  {categoryProducts.length} product
                  {categoryProducts.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {categoryProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[#999999] text-lg">
                No products available in this category yet.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-8">Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
          <p className="text-[#999999] mb-6">
            Failed to load the category. Please try again.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-[#E84A2F] text-white rounded-lg font-semibold hover:bg-[#D63A1F] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const supabase = createAdminClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} | The Funzo`,
    description: category.description || `Browse ${category.name} products`,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-[#999999]">Loading category...</div>
        </div>
      }
    >
      <CategoryContent slug={params.slug} />
    </Suspense>
  );
}
