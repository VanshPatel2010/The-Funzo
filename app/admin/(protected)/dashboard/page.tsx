import { createAdminClient } from "@/lib/supabase";
import { StatsCard } from "@/components/admin/StatsCard";

async function getStats() {
  try {
    const client = createAdminClient();

    // Fetch product count
    const { count: productCount, error: productError } = await client
      .from("products")
      .select("*", { count: "exact", head: true });

    // Fetch category count
    const { count: categoryCount, error: categoryError } = await client
      .from("categories")
      .select("*", { count: "exact", head: true });

    // Fetch featured product count
    const { count: featuredCount, error: featuredError } = await client
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("is_featured", true);

    if (productError || categoryError || featuredError) {
      throw new Error("Failed to fetch statistics");
    }

    return {
      products: productCount ?? 0,
      categories: categoryCount ?? 0,
      featured: featuredCount ?? 0,
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      products: 0,
      categories: 0,
      featured: 0,
    };
  }
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[#999999]">
          Welcome to The Funzo admin panel. Here&apos;s an overview of your
          store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Products */}
        <StatsCard
          icon="🚴"
          label="Total Products"
          value={stats.products}
          description="All products in your store"
        />

        {/* Total Categories */}
        <StatsCard
          icon="🏷️"
          label="Total Categories"
          value={stats.categories}
          description="Product categories available"
        />

        {/* Featured Products */}
        <StatsCard
          icon="⭐"
          label="Featured Products"
          value={stats.featured}
          description="Products marked as featured"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="bg-[#252525] rounded-2xl p-8 border border-[#333333] shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <ul className="space-y-3">
            <li>
              <a
                href="/admin/products"
                className="text-[#E84A2F] hover:text-[#D63A1F] text-sm font-medium transition-colors"
              >
                → Manage Products
              </a>
            </li>
            <li>
              <a
                href="/admin/categories"
                className="text-[#E84A2F] hover:text-[#D63A1F] text-sm font-medium transition-colors"
              >
                → Manage Categories
              </a>
            </li>
            <li>
              <a
                href="/admin/settings"
                className="text-[#E84A2F] hover:text-[#D63A1F] text-sm font-medium transition-colors"
              >
                → View Settings
              </a>
            </li>
          </ul>
        </div>

        <div className="bg-[#252525] rounded-2xl p-8 border border-[#333333] shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4">Store Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#CCCCCC] text-sm">Store Status</span>
              <span className="px-3 py-1 rounded-full bg-[#E84A2F]/20 text-[#E84A2F] text-xs font-semibold">
                Active
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#CCCCCC] text-sm">
                Database Connection
              </span>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                Connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
