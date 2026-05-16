import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase";
import { siteUrl } from "@/lib/seo";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];

  try {
    const supabase = createAdminClient();
    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase.from("categories").select("*"),
      supabase.from("products").select("*").eq("is_available", true),
    ]);

    const categoryRoutes = ((categories || []) as Category[]).map(
      (category) => ({
        url: `${siteUrl}/category/${category.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })
    );

    const productRoutes = ((products || []) as Product[]).map((product) => ({
      url: `${siteUrl}/product/${product.slug}`,
      lastModified: product.created_at ? new Date(product.created_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...baseRoutes, ...categoryRoutes, ...productRoutes];
  } catch {
    return baseRoutes;
  }
}
