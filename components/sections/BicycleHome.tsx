import { createAdminClient } from "@/lib/supabase";
import { BicycleHomeClient } from "./BicycleHomeClient";
import { parseImages } from "@/lib/helpers";
import { unstable_noStore as noStore } from "next/cache";
import { getStoreSettings } from "@/lib/store-settings";

async function fetchData() {
  noStore();

  const supabase = createAdminClient();

  try {
    const [{ data: categories }, { data: products }] = await Promise.all([
      supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true }),
      supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false }),
    ]);

    // Create a map of category IDs to names for quick lookup
    const categoryMap = new Map(
      (categories || []).map((cat) => [cat.id, cat.name])
    );

    // Transform categories to match the component's expected format
    const formattedCategories = (categories || []).map((cat) => ({
      id: cat.id,
      slug: cat.slug,
      title: cat.name,
      description: cat.description || "Discover our collection",
      accent: cat.name,
      image:
        cat.image_url ||
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800",
    }));

    // Transform products to match the component's expected format
    const formattedProducts = (products || []).map((prod) => ({
      id: prod.id,
      slug: prod.slug,
      name: prod.name,
      category: categoryMap.get(prod.category_id) || "Uncategorized",
      note: prod.description || "Premium quality product",
      image:
        parseImages(prod.images)[0] ||
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&h=800",
    }));

    const settings = await getStoreSettings();

    return {
      categories: formattedCategories,
      products: formattedProducts,
      settings,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    const settings = await getStoreSettings();

    return {
      categories: [],
      products: [],
      settings,
    };
  }
}

export default async function BicycleHome() {
  const { categories, products, settings } = await fetchData();

  return (
    <BicycleHomeClient
      categories={categories}
      featuredProducts={products}
      settings={settings}
    />
  );
}
