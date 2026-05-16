"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Variants } from "framer-motion";
import type { Product } from "@/lib/types";
import { parseImages } from "@/lib/helpers";
import { buildWhatsAppLink, defaultStoreSettings } from "@/lib/store-settings";
import { supabase } from "@/lib/supabase";

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
  // Ensure images is an array and has valid URLs
  const imageArray = parseImages(images);
  const validImages =
    imageArray.length > 0
      ? imageArray
      : [
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        ];

  return (
    <Link
      href={`/product/${slug}`}
      className="relative aspect-[4/3] overflow-hidden bg-secondary-50 group cursor-pointer block"
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
            alt={`${name} at cycle and toy store in Gandhinagar - image ${current + 1}`}
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

interface ProductCardProps {
  product: Product;
  showLink?: boolean;
}

export function ProductCard({ product, showLink = true }: ProductCardProps) {
  const [whatsAppNumber, setWhatsAppNumber] = useState(
    defaultStoreSettings.whatsapp_number
  );

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      try {
        const { data } = await supabase
          .from("store_settings")
          .select("whatsapp_number")
          .limit(1)
          .maybeSingle();

        if (isMounted && data?.whatsapp_number) {
          setWhatsAppNumber(data.whatsapp_number);
        }
      } catch {
        // Keep the default number if settings are unavailable.
      }
    }

    loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

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
      {showLink ? (
        <ImageCarousel
          images={product.images}
          name={product.name}
          slug={product.slug}
        />
      ) : (
        <div className="relative aspect-[4/3] overflow-hidden bg-secondary-50">
          {parseImages(product.images).length > 0 ? (
            <Image
              src={parseImages(product.images)[0]}
              alt={`${product.name} for sale in Gandhinagar`}
              loading="lazy"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-secondary-300">
              No image
            </div>
          )}
        </div>
      )}

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
        {showLink ? (
          <Link
            href={`/product/${product.slug}`}
            className="text-base sm:text-lg font-bold text-secondary leading-snug mb-1.5 hover:text-primary transition-colors"
          >
            {product.name}
          </Link>
        ) : (
          <h3 className="text-base sm:text-lg font-bold text-secondary leading-snug mb-1.5">
            {product.name}
          </h3>
        )}

        {/* Description */}
        {product.description && (
          <p className="text-sm text-secondary-300 leading-relaxed line-clamp-2 mb-4">
            {product.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end gap-3 pt-4 border-t border-secondary-100/60">
          <a
            href={buildWhatsAppLink(whatsAppNumber, product.name)}
            onClick={(e) => e.stopPropagation()}
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
