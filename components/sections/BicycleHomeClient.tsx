"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import type { StoreSettings } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/store-settings";
import { storeSeo } from "@/lib/seo";
import heroImage from "../../images/519PXRrtVML._SX679_.jpg";

interface BicycleHomeClientProps {
  categories: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    accent: string;
    image: string;
  }>;
  featuredProducts: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    note: string;
    image: string;
  }>;
  settings: StoreSettings;
}

const reviews = [
  {
    quote:
      "The Funzo has the best collection of bikes for kids. My son loves his new mountain bike!",
    author: "Rahul S.",
    role: "Parent",
  },
  {
    quote:
      "Excellent customer service and top-notch quality. The buying process was incredibly smooth.",
    author: "Anita M.",
    role: "Avid Cyclist",
  },
  {
    quote:
      "Found exactly what I was looking for. Their premium road bikes are simply unmatched.",
    author: "Karan D.",
    role: "Professional Rider",
  },
];

function SectionLabel({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.26em] ${
        light
          ? "border border-teal-200/80 bg-white text-slate-500"
          : "border border-cyan-400/20 bg-cyan-400/10 text-cyan-200"
      }`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-[#25d0df]" />
      {children}
    </span>
  );
}

export function BicycleHomeClient({
  categories,
  featuredProducts,
  settings,
}: BicycleHomeClientProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 120, damping: 20 });
  const cursorGlow = useMotionTemplate`radial-gradient(360px circle at ${smoothX}px ${smoothY}px, rgba(37, 208, 223, 0.14), transparent 42%)`;

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, -36]);
  const tagY = useTransform(scrollY, [0, 400], [0, -18]);

  return (
    <div
      className="overflow-hidden bg-[#06111a] text-white"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - bounds.left);
        mouseY.set(event.clientY - bounds.top);
      }}
    >
      <div className="pointer-events-none fixed inset-0 z-[1] hidden md:block">
        <motion.div
          className="absolute inset-0"
          style={{ background: cursorGlow }}
        />
      </div>

      <section className="relative isolate overflow-hidden pb-24 pt-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#06111a_0%,#081724_50%,#0a1f30_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,208,223,0.14),transparent_26%),radial-gradient(circle_at_80%_18%,rgba(74,222,128,0.10),transparent_22%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.08),transparent_20%)]" />
        <div className="hidden md:block absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/8 blur-[120px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75 }}
            className="max-w-2xl"
          >
            <SectionLabel>Premium Family Cycling</SectionLabel>
            <h1 className="font-display mt-8 text-[3.4rem] font-semibold uppercase leading-[0.9] tracking-[-0.06em] text-white sm:text-[4.9rem] lg:text-[6rem]">
              Best Cycle & Toy Store in Gandhinagar.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              The Funzo brings kids cycles, family bicycles, and fun toys
              together in Raysan, Gandhinagar for families looking for a cycle
              shop and toy store near them.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#featured"
                className="inline-flex items-center justify-center rounded-full bg-[linear-gradient(90deg,#20d7e6_0%,#1792d8_100%)] px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_0_30px_rgba(32,215,230,0.25)] transition duration-300 hover:-translate-y-1"
              >
                Explore Products
              </a>
              <a
                href="#categories"
                className="inline-flex items-center justify-center rounded-full border border-white/16 bg-white/[0.03] px-8 py-4 text-base font-semibold text-white backdrop-blur-xl transition duration-300 hover:border-cyan-300/40 hover:bg-white/[0.06]"
              >
                Browse Categories
              </a>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                {
                  value: categories.length.toString(),
                  label: "Categories live",
                },
                {
                  value: featuredProducts.length.toString(),
                  label: "Products live",
                },
                { value: "Family", label: "Friendly designs" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="rounded-[1.55rem] border border-white/8 bg-white/[0.045] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                >
                  <p className="font-display text-3xl uppercase tracking-[-0.05em] text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08 }}
            className="relative mx-auto w-full max-w-4xl"
            style={{ y: heroY }}
          >
            <div className="absolute inset-10 rounded-[3rem] bg-cyan-400/8 blur-[90px]" />
            <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.42)] backdrop-blur-2xl">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(9,19,29,0.96),rgba(7,15,23,1))]">
                <div className="hidden md:block absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_24%)]" />
                <div className="hidden md:block absolute inset-0 bg-[linear-gradient(135deg,rgba(37,208,223,0.08),transparent_35%,rgba(255,255,255,0.04)_60%,transparent_80%)]" />
                <div className="absolute right-6 top-6 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-xl">
                  Featured Product
                </div>
                <div className="relative aspect-[1.15]">
                  <Image
                    src={heroImage}
                    alt="kids bicycle and cycle store in Gandhinagar"
                    fill
                    priority
                    fetchPriority="high"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover object-center"
                  />
                  <div className="hidden md:block absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,26,0.18),transparent_45%,rgba(6,17,26,0.22))]" />
                  <div className="hidden md:block absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent,rgba(6,17,26,0.54))]" />
                  <div className="absolute left-8 top-8 flex gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(37,208,223,0.7)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              whileHover={{ y: -6, rotate: -1.5 }}
              className="absolute -bottom-4 left-2 rounded-[1.45rem] border border-cyan-300/18 bg-[#0b1824]/78 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.32)] backdrop-blur-2xl sm:left-10 sm:w-56"
              style={{ y: tagY }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                Premium Quality
              </p>
              <p className="font-display mt-2 text-2xl uppercase tracking-[-0.04em] text-white">
                Top Brands
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Built to last with high-end components.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -6, rotate: 1.5 }}
              className="absolute -right-1 top-12 rounded-[1.45rem] border border-white/14 bg-white/10 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:right-6 sm:w-48"
              style={{ y: tagY }}
            >
              <p className="text-xs uppercase tracking-[0.24em] text-white/80">
                For All Ages
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-100">
                Perfect rides for every member of the family.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="absolute bottom-8 right-10 hidden rounded-[1.35rem] border border-white/14 bg-white/8 px-5 py-4 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-xl md:block"
            >
              <p className="text-[0.68rem] uppercase tracking-[0.28em] text-slate-300">
                Expert Pick
              </p>
              <p className="mt-2 font-display text-2xl uppercase tracking-[-0.04em] text-white">
                Bestseller
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section
        id="featured"
        className="scroll-mt-24 bg-[#eef7fb] py-24 text-slate-950"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel light>Featured Products</SectionLabel>
              <h2 className="font-display mt-6 max-w-3xl text-4xl font-semibold uppercase tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Our Top Selling Bicycles
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Explore our hand-picked selection of premium bicycles designed for
              performance, comfort, and ultimate fun.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <Link
                key={product.id}
                href={`/product/${product.slug}`}
                className="block"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -10 }}
                  className="group overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[0.95] overflow-hidden">
                    <Image
                      src={product.image}
                      alt={`${product.name} available at cycle store in Gandhinagar`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 group-hover:scale-[1.05]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-white/6" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/55 px-3 py-1 text-[0.68rem] uppercase tracking-[0.26em] text-slate-700 backdrop-blur-xl">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="rounded-[1.45rem] border border-sky-100 bg-white p-5 backdrop-blur-sm">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <h3 className="font-display text-3xl uppercase tracking-[-0.05em] text-slate-950">
                            {product.name}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {product.note}
                          </p>
                        </div>
                        <span className="text-xl text-slate-700 transition duration-300 group-hover:translate-x-1">
                          ↗
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="categories"
        className="scroll-mt-24 bg-[#eef7fb] py-24 text-slate-950"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel light>Shop by Category</SectionLabel>
              <h2 className="font-display mt-6 max-w-3xl text-4xl font-semibold uppercase tracking-[-0.05em] text-slate-950 sm:text-5xl">
                Find the perfect ride for every terrain.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Whether you&apos;re hitting the mountain trails, commuting to
              work, or looking for a fun ride for your kids, we have a category
              for you.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="block"
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  whileHover={{ y: -8 }}
                  className="overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-[0_18px_55px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative aspect-[1.05] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={`${category.title} at toy and cycle store in Raysan Gandhinagar`}
                      fill
                      loading="lazy"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition duration-700 hover:scale-[1.04]"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(7,15,23,0.48))]" />
                    <div className="absolute left-5 top-5 rounded-full border border-white/50 bg-white/55 px-3 py-1 text-[0.68rem] uppercase tracking-[0.26em] text-slate-700 backdrop-blur-xl">
                      {category.accent}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-3xl uppercase tracking-[-0.05em] text-slate-950">
                      {category.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">
                      {category.description}
                    </p>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="store"
        className="scroll-mt-24 bg-white py-24 text-slate-950"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <article>
            <SectionLabel light>Our Store</SectionLabel>
            <h2 className="font-display mt-6 text-4xl font-semibold uppercase tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Cycle and Toy Shop in Raysan, Gandhinagar.
            </h2>
            <p className="mt-6 text-base leading-8 text-slate-600">
              The Funzo is your local cycle and toy store in Raysan,
              Gandhinagar, Gujarat. We help families choose kids cycles,
              bicycles, ride-on toys, remote cars, and fun toys with friendly
              guidance and easy WhatsApp support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={buildWhatsAppLink(settings.whatsapp_number)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#20bd5a]"
              >
                Chat on WhatsApp
              </a>
              <a
                href={settings.address_url || storeSeo.googleBusinessUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-400"
              >
                Get Directions
              </a>
            </div>
          </article>

          <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 shadow-[0_18px_55px_rgba(15,23,42,0.08)]">
            <iframe
              title="The Funzo cycle and toy store location in Raysan Gandhinagar"
              src={storeSeo.googleMapsEmbedUrl}
              width="100%"
              height="420"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full"
            />
          </div>
        </div>
      </section>

      <section
        id="reviews"
        className="scroll-mt-24 bg-[#f5fbff] py-24 text-slate-950"
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel light>Testimonials</SectionLabel>
              <h2 className="font-display mt-6 text-4xl font-semibold uppercase tracking-[-0.05em] text-slate-950 sm:text-5xl">
                What our riders are saying.
              </h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Don&apos;t just take our word for it. Hear from our community of
              passionate cyclists who love their Funzo bikes.
            </p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {reviews.map((review, index) => (
              <motion.blockquote
                key={review.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="rounded-[2rem] border border-white/70 bg-white/72 p-6 shadow-[0_18px_55px_rgba(17,17,17,0.08)] backdrop-blur-2xl"
              >
                <p className="text-lg leading-8 text-slate-700">
                  &ldquo;{review.quote}&rdquo;
                </p>
                <footer className="mt-8 border-t border-slate-200 pt-5">
                  <p className="font-display text-2xl uppercase tracking-[-0.04em] text-slate-950">
                    {review.author}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{review.role}</p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
