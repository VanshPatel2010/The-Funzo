import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase";
import { Product, ProductWithCategory, Category } from "@/lib/types";
import { ProductCard } from "@/components/sections/ProductCard";
import { parseImages } from "@/lib/helpers";
import { buildWhatsAppLink, getStoreSettings } from "@/lib/store-settings";
import Link from "next/link";
import BackButton from "./BackButton";
import ProductGallery from "./ProductGallery";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

async function ProductContent({ slug }: { slug: string }) {
  const supabase = createAdminClient();

  try {
    // Get the product with category
    const [settingsResult, productResult] = await Promise.all([
      getStoreSettings(),
      supabase
        .from("products")
        .select(
          `
        *,
        category:categories(*)
      `
        )
        .eq("slug", slug)
        .eq("is_available", true)
        .single(),
    ]);

    const settings = settingsResult;
    const { data: product, error: productError } = productResult;

    if (productError || !product) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Product Not Found
            </h1>
            <p className="text-[#999999] mb-6">
              The product you&apos;re looking for doesn&apos;t exist or is
              unavailable.
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

    const typedProduct = product as ProductWithCategory;
    const category = typedProduct.category as unknown as Category;

    // Ensure images is properly cast as an array
    typedProduct.images = parseImages(typedProduct.images);

    // Get related products (same category)
    const { data: relatedProducts, error: relatedError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", typedProduct.category_id)
      .neq("id", typedProduct.id)
      .eq("is_available", true)
      .limit(3)
      .order("created_at", { ascending: false });

    if (relatedError) {
      throw relatedError;
    }

    const related = (relatedProducts || []) as Product[];

    return (
      <>
        {/* Breadcrumb + Back */}
        <div className="bg-[#1A1A1A] border-b border-[#333333] py-4">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Link href="/" className="text-[#E84A2F] hover:text-[#D63A1F]">
                  Home
                </Link>
                <span className="text-[#999999]">/</span>
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-[#E84A2F] hover:text-[#D63A1F]"
                >
                  {category.name}
                </Link>
                <span className="text-[#999999]">/</span>
                <span className="text-[#CCCCCC]">{typedProduct.name}</span>
              </div>
              <BackButton />
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Images */}
            <div className="space-y-4">
              {typedProduct.images && typedProduct.images.length > 0 ? (
                <ProductGallery
                  images={typedProduct.images.slice(0, 4)}
                  name={typedProduct.name}
                />
              ) : (
                <div className="w-full h-96 rounded-lg border border-[#333333] bg-[#252525] flex items-center justify-center">
                  <span className="text-[#999999]">No image available</span>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-sm text-[#999999] mb-2">{category.name}</p>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {typedProduct.name}
                </h1>
                {typedProduct.age_range && (
                  <p className="text-sm text-[#CCCCCC]">
                    Age: {typedProduct.age_range}
                  </p>
                )}
              </div>

              <div className="flex items-baseline gap-4">
                {typedProduct.is_featured && (
                  <span className="px-3 py-1 bg-yellow-600/20 text-yellow-400 text-sm font-medium rounded-full">
                    Featured
                  </span>
                )}
              </div>

              {/* Description */}
              {typedProduct.description && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    About this product
                  </h3>
                  <p className="text-[#CCCCCC] leading-relaxed">
                    {typedProduct.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {typedProduct.tags && typedProduct.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {typedProduct.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-[#333333] text-[#CCCCCC] text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="pt-6 border-t border-[#333333] space-y-3">
                <a
                  href={buildWhatsAppLink(
                    settings.whatsapp_number,
                    typedProduct.name
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg font-semibold hover:bg-[#20bd5a] transition-colors shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Enquire on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[#333333]">
              <h2 className="text-2xl font-bold text-white mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
          <p className="text-[#999999] mb-6">
            Failed to load the product. Please try again.
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

export async function generateMetadata({ params }: ProductPageProps) {
  const supabase = createAdminClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | The Funzo`,
    description: product.description || `Buy ${product.name}`,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-[#999999]">Loading product...</div>
        </div>
      }
    >
      <ProductContent slug={params.slug} />
    </Suspense>
  );
}
