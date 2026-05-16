"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Product, Category } from "@/lib/types";

// ─── WhatsApp Config ────────────────────────────────────────────────────────

const WHATSAPP_NUMBER = "916354955653"; // Replace with actual number

function getWhatsAppLink(productName: string) {
  const message = encodeURIComponent(
    `Hi! I'm interested in ${productName}. Could you share more details?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

// ─── Price Formatter ────────────────────────────────────────────────────────

function formatINR(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Image Carousel ─────────────────────────────────────────────────────────

function ImageCarousel({
  images,
  name,
  slug,
}: {
  images: string[];
  name: string;
  slug: string;
}) {
  const [current, setCurrent] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";
  const validImages = images.length > 0 ? images : [FALLBACK_IMAGE];

  return (
    <Link
      href={`/product/${slug}`}
      className="relative aspect-[4/3] overflow-hidden bg-secondary-50 group block cursor-pointer"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          <Image
            src={
              failedImages.has(current) ? FALLBACK_IMAGE : validImages[current]
            }
            alt={`${name} for sale at cycle and toy store in Gandhinagar image ${current + 1}`}
            loading="lazy"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={() =>
              setFailedImages((prev) => new Set(prev).add(current))
            }
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      {validImages.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {validImages.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrent(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                i === current ? "bg-white w-4" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`View image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Arrows */}
      {validImages.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrent((p) => (p === 0 ? validImages.length - 1 : p - 1));
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm z-10"
            aria-label="Previous image"
          >
            <svg
              className="w-3.5 h-3.5 text-secondary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrent((p) => (p === validImages.length - 1 ? 0 : p + 1));
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm z-10"
            aria-label="Next image"
          >
            <svg
              className="w-3.5 h-3.5 text-secondary"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    </Link>
  );
}

// ─── WhatsApp Icon ──────────────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ─── Search Icon ────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg
      className="w-4.5 h-4.5 text-secondary-300"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
  );
}

// ─── Product Card ───────────────────────────────────────────────────────────

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.97,
    transition: { duration: 0.3 },
  },
};

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.div
      layout
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="bg-white rounded-2xl overflow-hidden border border-secondary-100/60 shadow-sm hover:shadow-xl hover:shadow-secondary/5 transition-shadow duration-300 flex flex-col"
    >
      {/* Image */}
      <ImageCarousel
        images={product.images}
        name={product.name}
        slug={product.slug}
      />

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap mb-3">
          {product.age_range && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary/10 text-primary tracking-wide">
              Age {product.age_range}
            </span>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
              product.is_available
                ? "bg-emerald-50 text-emerald-600"
                : "bg-secondary-50 text-secondary-300"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                product.is_available ? "bg-emerald-500" : "bg-secondary-300"
              }`}
            />
            {product.is_available ? "In Stock" : "Out of Stock"}
          </span>
          {product.is_featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 tracking-wide">
              ★ Featured
            </span>
          )}
        </div>

        {/* Name */}
        <Link
          href={`/product/${product.slug}`}
          className="text-base sm:text-lg font-bold text-secondary leading-snug mb-1.5 hover:text-primary transition-colors"
        >
          {product.name}
        </Link>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-secondary-300 leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4 border-t border-secondary-100/60">
          <div>
            <p className="text-xs text-secondary-300 mb-0.5">Price</p>
            <p className="text-xl sm:text-2xl font-extrabold text-secondary tracking-tight">
              {formatINR(product.price)}
            </p>
          </div>

          <a
            href={getWhatsAppLink(product.name)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md shrink-0"
          >
            <WhatsAppIcon />
            <span className="hidden sm:inline">Enquire</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Catalogue Component ───────────────────────────────────────────────

interface ProductCatalogueProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
}

export default function ProductCatalogue({
  products,
  categories,
  initialCategory,
}: ProductCatalogueProps) {
  const [activeCategory, setActiveCategory] = useState<string>(
    initialCategory || "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");

  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach((product) => {
      product.tags.forEach((tag) => tagSet.add(tag));
    });
    return ["all", ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ||
        categories.find((c) => c.slug === activeCategory)?.id === p.category_id;

      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTag =
        selectedTag === "all" || p.tags.some((tag) => tag === selectedTag);

      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [products, categories, activeCategory, searchQuery, selectedTag]);

  return (
    <section id="catalogue" className="py-20 sm:py-28 bg-accent-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
            Browse Products
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary tracking-tight">
            Our Catalogue
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary origin-left"
          />
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4 mb-10"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setActiveCategory("all")}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeCategory === "all"
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white text-secondary-400 hover:text-secondary border border-secondary-100 hover:border-secondary-200"
                }`}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.slug
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-white text-secondary-400 hover:text-secondary border border-secondary-100 hover:border-secondary-200"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <SearchIcon />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-secondary-100 bg-white text-sm text-secondary placeholder:text-secondary-300 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-300 hover:text-secondary transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              <a
                href="/search"
                className="inline-flex items-center justify-center rounded-xl border border-secondary-100 bg-white px-4 py-2.5 text-sm font-semibold text-secondary transition-colors hover:border-secondary-200 hover:text-primary"
              >
                Advanced Filters
              </a>
            </div>
          </div>

          {availableTags.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-all duration-200 ${
                    selectedTag === tag
                      ? "bg-secondary text-white"
                      : "bg-white text-secondary-300 border border-secondary-100 hover:text-secondary"
                  }`}
                >
                  {tag === "all" ? "All Tags" : tag}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeCategory + searchQuery}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                visible: {
                  transition: { staggerChildren: 0.08 },
                },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-50 flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-secondary-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">
                No products found
              </h3>
              <p className="text-sm text-secondary-300">
                Try adjusting your search or category filter.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSearchQuery("");
                  setSelectedTag("all");
                }}
                className="mt-4 text-sm font-semibold text-primary hover:text-primary-600 transition-colors"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Count */}
        {filteredProducts.length > 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-secondary-300 mt-8"
          >
            Showing {filteredProducts.length} of {products.length} products
          </motion.p>
        )}
      </div>
    </section>
  );
}
