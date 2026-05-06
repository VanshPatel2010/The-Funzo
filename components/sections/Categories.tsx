import { supabase } from "@/lib/supabase";
import type { Category } from "@/lib/types";
import CategoriesGrid from "./CategoriesGrid";

// ─── Fallback data for when Supabase is not configured ──────────────────────

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

// ─── Server Component ───────────────────────────────────────────────────────

async function fetchCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackCategories;
    }

    return data as Category[];
  } catch {
    return fallbackCategories;
  }
}

export default async function Categories() {
  const categories = await fetchCategories();

  return <CategoriesGrid categories={categories} />;
}
