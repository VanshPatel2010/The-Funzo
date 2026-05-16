"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { StoreSettings } from "@/lib/types";
import { buildWhatsAppLink } from "@/lib/store-settings";
import { storeSeo } from "@/lib/seo";

const footerLinks = [
  { label: "Featured", href: "/#featured" },
  { label: "Categories", href: "/#categories" },
  { label: "Our Store", href: "/#store" },
  { label: "Reviews", href: "/#reviews" },
  { label: "Contact", href: "/#contact" },
];

function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
      />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Footer({ settings }: { settings: StoreSettings }) {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-white/6 bg-[#071018] text-slate-300"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10"
      >
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 sm:py-16 lg:grid-cols-4 lg:gap-12">
          <motion.div
            variants={itemVariants}
            className="sm:col-span-2 lg:col-span-1"
          >
            <Link href="/" className="inline-block">
              <span className="font-display text-3xl font-semibold uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:text-sky-100">
                The Funzo
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
              Local cycle and toy store in Raysan, Gandhinagar for kids cycles,
              family bicycles, toys, and friendly buying guidance.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#76bce7]">
              Ride. Grow. Explore.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-white">
              Navigate
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                  >
                    <span className="h-[2px] w-0 rounded-full bg-[#76bce7] transition-all duration-200 group-hover:w-2" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-white">
              Signature Lines
            </h4>
            <ul className="space-y-3">
              {["Starter Bikes", "Adventure Bikes", "Junior Gear Bikes"].map(
                (cat) => (
                  <li key={cat}>
                    <Link
                      href="/#featured"
                      className="group inline-flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                    >
                      <span className="h-[2px] w-0 rounded-full bg-[#76bce7] transition-all duration-200 group-hover:w-2" />
                      {cat}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.22em] text-white">
              Contact
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={settings.address_url || "#contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                >
                  <span className="mt-0.5 text-slate-400 transition-colors duration-200 group-hover:text-sky-100">
                    <MapPinIcon />
                  </span>
                  <address className="not-italic">
                    The Funzo
                    <br />
                    {storeSeo.streetAddress}, {storeSeo.city}
                    <br />
                    {storeSeo.region} {storeSeo.postalCode}, India
                  </address>
                </a>
              </li>
              <li>
                <a
                  href={settings.instagram_url || "#contact"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                >
                  <span className="text-slate-400 transition-colors duration-200 group-hover:text-sky-100">
                    <InstagramIcon />
                  </span>
                  <span>
                    {settings.instagram_url || "Instagram link unavailable"}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.contact_number}`}
                  className="group flex items-center gap-3 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                >
                  <span className="text-slate-400 transition-colors duration-200 group-hover:text-sky-100">
                    <PhoneIcon />
                  </span>
                  <span>{settings.contact_number}</span>
                </a>
              </li>
              <li>
                <a
                  href={buildWhatsAppLink(settings.whatsapp_number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-slate-300 transition-colors duration-200 hover:text-white"
                >
                  <span className="text-[#25D366]">
                    <PhoneIcon />
                  </span>
                  <span>WhatsApp The Funzo</span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] py-6 sm:flex-row"
        >
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} The Funzo. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href={settings.instagram_url || "#contact"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors duration-200 hover:text-sky-100"
              aria-label="Social"
            >
              <InstagramIcon />
            </a>
            <a
              href={settings.address_url || "#contact"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 transition-colors duration-200 hover:text-sky-100"
              aria-label="Address"
            >
              <MapPinIcon />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
