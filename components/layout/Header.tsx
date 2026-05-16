"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
      <span
        className={`block h-[2px] w-full rounded-full bg-white transition duration-300 ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`block h-[2px] w-full rounded-full bg-white transition duration-200 ${
          open ? "-translate-x-5 opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`block h-[2px] w-full rounded-full bg-white transition duration-300 ${
          open ? "-translate-y-2 -rotate-45" : ""
        }`}
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
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition duration-300 ${
          scrolled
            ? "border-b border-white/8 bg-black/55 shadow-[0_18px_50px_rgba(0,0,0,0.25)] backdrop-blur-2xl"
            : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-8 lg:px-10">
          <Link href="/" className="relative z-50 group" aria-label="Home">
            <span className="font-display block text-[1.45rem] font-semibold uppercase tracking-[0.16em] text-white transition duration-200 group-hover:scale-[1.03] group-hover:text-sky-100 sm:text-[1.7rem]">
              The Funzo
            </span>
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
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />

          <nav className="absolute right-0 top-0 flex h-full w-[78%] max-w-sm flex-col border-l border-white/10 bg-[#0b121a]/95 shadow-2xl backdrop-blur-2xl">
            <div className="flex flex-1 flex-col px-8 pt-24">
              <div className="mb-6">
                <SearchBar />
              </div>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 font-semibold uppercase tracking-[0.22em] text-slate-100 transition-all duration-200 hover:border-white/16 hover:bg-white/[0.06]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-[#f3f7fb] py-3.5 text-sm font-semibold uppercase tracking-[0.22em] text-slate-900 transition duration-200"
                >
                  Contact Us
                </Link>
              </div>

              <div className="mt-auto border-t border-white/10 pb-10 pt-8">
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
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
