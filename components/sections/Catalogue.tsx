import { supabase } from "@/lib/supabase";
import type { Product, Category } from "@/lib/types";
import ProductCatalogue from "./ProductCatalogue";

// ─── Fallback Data ──────────────────────────────────────────────────────────

const fallbackCategories: Category[] = [
  {
    id: "a1b2c3d4-1111-4000-8000-000000000001",
    name: "Road Cycles",
    slug: "road-cycles",
    description:
      "High-performance road cycles built for speed, endurance, and the open road.",
    image_url:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    display_order: 1,
  },
  {
    id: "a1b2c3d4-2222-4000-8000-000000000002",
    name: "Kids Cycles",
    slug: "kids-cycles",
    description:
      "Safe, colorful, and fun cycles designed for young riders learning to explore.",
    image_url:
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&q=80",
    display_order: 2,
  },
  {
    id: "a1b2c3d4-3333-4000-8000-000000000003",
    name: "Electric Remote Cars",
    slug: "electric-remote-cars",
    description:
      "Exciting electric remote-controlled cars for kids — drive, drift, and race!",
    image_url:
      "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&q=80",
    display_order: 3,
  },
];

const fallbackProducts: Product[] = [
  {
    id: "p1",
    name: "Veloce Pro 700",
    slug: "veloce-pro-700",
    description:
      "Lightweight carbon frame road cycle with Shimano 105 groupset. Perfect for long-distance rides and competitive cycling.",
    price: 34999,
    category_id: "a1b2c3d4-1111-4000-8000-000000000001",
    images: [
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&q=80",
    ],
    tags: ["road", "carbon", "shimano", "pro"],
    is_featured: true,
    is_available: true,
    age_range: "16+",
    created_at: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Urban Glide X3",
    slug: "urban-glide-x3",
    description:
      "Versatile hybrid cycle ideal for city commuting and weekend trail rides. Aluminium body with disc brakes.",
    price: 18499,
    category_id: "a1b2c3d4-1111-4000-8000-000000000001",
    images: [
      "https://images.unsplash.com/photo-1571188654248-7a89013e5cd0?w=800&q=80",
    ],
    tags: ["hybrid", "city", "commute", "disc-brakes"],
    is_featured: false,
    is_available: true,
    age_range: "14+",
    created_at: new Date().toISOString(),
  },
  {
    id: "p3",
    name: 'Little Explorer 16"',
    slug: "little-explorer-16",
    description:
      "Sturdy kids cycle with training wheels, adjustable seat, and a fun bell. Available in red and blue.",
    price: 5999,
    category_id: "a1b2c3d4-2222-4000-8000-000000000002",
    images: [
      "https://images.unsplash.com/photo-1595558009725-9ba4e87bb0d0?w=800&q=80",
    ],
    tags: ["kids", "training-wheels", "beginner"],
    is_featured: true,
    is_available: true,
    age_range: "4-7",
    created_at: new Date().toISOString(),
  },
  {
    id: "p4",
    name: 'Junior Sprint 20"',
    slug: "junior-sprint-20",
    description:
      "Lightweight kids cycle with 6-speed gears and vibrant graphics. Ready for the next adventure.",
    price: 8499,
    category_id: "a1b2c3d4-2222-4000-8000-000000000002",
    images: [
      "https://images.unsplash.com/photo-1605235186583-a8272b61f9fe?w=800&q=80",
    ],
    tags: ["kids", "geared", "adventure"],
    is_featured: false,
    is_available: true,
    age_range: "7-12",
    created_at: new Date().toISOString(),
  },
  {
    id: "p5",
    name: "TurboZap RC Racer",
    slug: "turbozap-rc-racer",
    description:
      "High-speed remote control car with 2.4GHz controller, LED lights, and rechargeable battery. Top speed 15 km/h.",
    price: 3499,
    category_id: "a1b2c3d4-3333-4000-8000-000000000003",
    images: [
      "https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?w=800&q=80",
    ],
    tags: ["rc-car", "high-speed", "led", "rechargeable"],
    is_featured: true,
    is_available: true,
    age_range: "6+",
    created_at: new Date().toISOString(),
  },
  {
    id: "p6",
    name: "DriftKing Monster Truck",
    slug: "driftking-monster-truck",
    description:
      "All-terrain monster truck RC car with oversized wheels, suspension system, and 30-min battery life.",
    price: 4999,
    category_id: "a1b2c3d4-3333-4000-8000-000000000003",
    images: [
      "https://images.unsplash.com/photo-1581235707960-23b7e8f7e284?w=800&q=80",
    ],
    tags: ["rc-car", "monster-truck", "off-road", "all-terrain"],
    is_featured: false,
    is_available: true,
    age_range: "8+",
    created_at: new Date().toISOString(),
  },
];

// ─── Data fetching ──────────────────────────────────────────────────────────

async function fetchData(): Promise<{
  products: Product[];
  categories: Category[];
}> {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false }),
      supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true }),
    ]);

    const products =
      productsRes.error || !productsRes.data || productsRes.data.length === 0
        ? fallbackProducts
        : (productsRes.data as Product[]);

    const categories =
      categoriesRes.error ||
      !categoriesRes.data ||
      categoriesRes.data.length === 0
        ? fallbackCategories
        : (categoriesRes.data as Category[]);

    return { products, categories };
  } catch {
    return { products: fallbackProducts, categories: fallbackCategories };
  }
}

// ─── Server Component ───────────────────────────────────────────────────────

export default async function Catalogue() {
  const { products, categories } = await fetchData();

  return <ProductCatalogue products={products} categories={categories} />;
}
