"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { StoreSettings } from "@/lib/types";
import { SearchBar } from "@/components/sections/SearchBar";

const navLinks = [
  { label: "Collection", href: "/#featured" },
  { label: "Categories", href: "/#categories" },
  { label: "Store", href: "/#store" },
  { label: "Reviews", href: "/#reviews" },
];

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <div className="relative flex h-5 w-6 flex-col justify-between">
      <motion.span
        animate={open ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="block h-[2px] w-full rounded-full bg-white"
      />
      <motion.span
        animate={open ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="block h-[2px] w-full rounded-full bg-white"
      />
      <motion.span
        animate={open ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.3 }}
        className="block h-[2px] w-full rounded-full bg-white"
      />
    </div>
  );
}

export default function Header({ settings }: { settings: StoreSettings }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.1 }}
        className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-black/55 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="relative z-50 group" aria-label="Home">
            <motion.span
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="font-display text-[1.45rem] font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 group-hover:text-sky-100 sm:text-[1.7rem]"
            >
              The Funzo
            </motion.span>
          </Link>

          <div className="hidden items-center gap-4 md:flex">
            <div className="w-72">
              <SearchBar />
            </div>
            <ul className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 backdrop-blur-xl lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-4 py-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-200 transition duration-200 hover:bg-white/7 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="hidden md:block">
            <Link
              href="/#contact"
              className="inline-flex items-center rounded-full bg-[#f3f7fb] px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-900 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(173,222,255,0.18)]"
            >
              Contact Us
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="relative z-50 -mr-2 p-2 focus:outline-none md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <HamburgerIcon open={mobileOpen} />
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 flex h-full w-[78%] max-w-sm flex-col border-l border-white/10 bg-[#0b121a]/95 shadow-2xl backdrop-blur-2xl"
            >
              <div className="flex flex-1 flex-col px-8 pt-24">
                <div className="mb-6">
                  <SearchBar />
                </div>
                <ul className="space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.07 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 font-semibold uppercase tracking-[0.22em] text-slate-100 transition-all duration-200 hover:border-white/16 hover:bg-white/[0.06]"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-8"
                >
                  <Link
                    href="/#contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-[#f3f7fb] py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900 transition duration-200"
                  >
                    Contact Us
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-auto border-t border-white/10 pb-10 pt-8"
                >
                  <div className="space-y-2 text-sm leading-relaxed text-slate-300">
                    <p>
                      Premium bikes for kids and boys with sporty styling and
                      family-friendly comfort.
                    </p>
                    <a
                      href={`tel:${settings.contact_number}`}
                      className="block text-sky-100"
                    >
                      {settings.contact_number}
                    </a>
                  </div>
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
