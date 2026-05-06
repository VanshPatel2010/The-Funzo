"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category } from "@/lib/types";
import { searchProducts } from "@/lib/actions/products";
import { ProductCard } from "@/components/sections/ProductCard";
import { supabase } from "@/lib/supabase";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");

  const [results, setResults] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allTags, setAllTags] = useState<string[]>([]);

  // Fetch categories and all tags on mount
  useEffect(() => {
    const fetchData = async () => {
      const { data: cats } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      setCategories((cats || []) as Category[]);

      // Fetch all tags from products
      const { data: products } = await supabase
        .from("products")
        .select("tags")
        .eq("is_available", true);

      const tagSet = new Set<string>();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (products || []).forEach((p: any) => {
        if (Array.isArray(p.tags)) {
          p.tags.forEach((tag: string) => tagSet.add(tag));
        }
      });
      setAllTags(Array.from(tagSet).sort());
    };

    fetchData();
  }, []);

  // Perform search
  const performSearch = useCallback(async () => {
    if (!query.trim() && !selectedCategory && selectedTags.length === 0) {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("is_available", true)
        .order("created_at", { ascending: false });
      setResults((data || []) as Product[]);
      return;
    }

    setIsLoading(true);
    try {
      const result = await searchProducts(query, {
        categoryId: selectedCategory || undefined,
        tags: selectedTags,
      });

      if (result.success) {
        setResults(result.products);
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedCategory, selectedTags]);

  // Perform search when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [performSearch]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "name-asc") {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === "name-desc") {
      return b.name.localeCompare(a.name);
    }
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-accent-100 to-white">
      {/* Search Header */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#252525] border-b border-[#333333] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Search Products
          </h1>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product name, description, or tag..."
              className="w-full px-6 py-3 bg-white border border-secondary-200 rounded-lg text-secondary placeholder-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-secondary-200 p-6 space-y-6 sticky top-6">
              <div>
                <h3 className="text-lg font-semibold text-secondary mb-4">
                  Filters
                </h3>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-secondary mb-3">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              {allTags.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-secondary mb-3">
                    Tags
                  </label>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {allTags.map((tag) => (
                      <label
                        key={tag}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="w-4 h-4 rounded border-secondary-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-secondary">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-secondary mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest first</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setQuery("");
                  setSelectedCategory("");
                  setSelectedTags([]);
                  setSortBy("newest");
                }}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg text-secondary font-semibold hover:bg-secondary-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin">
                  <svg
                    className="w-8 h-8 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-secondary-200">
                <svg
                  className="w-16 h-16 text-secondary-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <p className="text-secondary-600 text-lg">
                  {query || selectedCategory || selectedTags.length > 0
                    ? "No products found matching your search"
                    : "Browse all products or use filters to narrow results"}
                </p>
              </div>
            ) : (
              <>
                <p className="text-secondary-600 mb-6">
                  Found {sortedResults.length} product
                  {sortedResults.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedResults.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-accent-100 to-white" />
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
