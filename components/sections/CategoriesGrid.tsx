"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Variants } from "framer-motion";
import type { Category } from "@/lib/types";

// ─── Animation Variants ─────────────────────────────────────────────────────

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any },
  },
};

const underlineVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" },
  },
};

// ─── Category Card ──────────────────────────────────────────────────────────

function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.div variants={cardVariants}>
      <Link
        href={`/category/${category.slug}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-secondary-100/60 shadow-sm hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary-50">
          <Image
            src={
              category.image_url ||
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop"
            }
            alt={`${category.name} collection at cycle and toy store in Gandhinagar`}
            loading="lazy"
            fill
            quality={58}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 390px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop";
            }}
          />

          {/* Hover overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-secondary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-secondary mb-2 group-hover:text-primary transition-colors duration-200">
            {category.name}
          </h3>

          {category.description && (
            <p className="text-sm text-secondary-300 leading-relaxed line-clamp-2 mb-4">
              {category.description}
            </p>
          )}

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all duration-200">
            View Products
            <svg
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Categories Grid (Client Component) ─────────────────────────────────────

export default function CategoriesGrid({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <section id="categories" className="py-20 sm:py-28 bg-accent">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-14 sm:mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold tracking-widest uppercase text-primary mb-3"
          >
            Our Collection
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary tracking-tight"
          >
            What We Offer
          </motion.h2>

          {/* Animated underline */}
          <motion.div
            variants={underlineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-5 text-secondary-300 text-base sm:text-lg max-w-xl mx-auto"
          >
            From high-performance road cycles to exciting electric remote cars —
            find the perfect ride for every age.
          </motion.p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
