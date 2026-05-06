"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Map link provided by user
const MAP_LINK = "https://share.google/R8gBmW9VrypRLlC3m";
// Fake google map embed URL for visual representation
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.3323565576!2d88.26495111244498!3d22.535406456076412!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0277aec11121d5%3A0xe2130e6981881dc6!2sCycle%20Store!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

const INSTAGRAM_LINK = "https://www.instagram.com/thefunzo1/";

export default function AboutContact() {
  return (
    <>
      {/* About Section */}
      <section id="about" className="py-20 sm:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex-1 space-y-6 sm:space-y-8"
            >
              <div>
                <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
                  About Us
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary tracking-tight">
                  Fueling Adventures Since Day One
                </h2>
                <div className="mt-4 h-1 w-16 rounded-full bg-primary" />
              </div>

              <div className="space-y-4 text-base sm:text-lg text-secondary-300 leading-relaxed">
                <p>
                  At <strong>The Funzo</strong>, we believe every journey should
                  be filled with excitement, whether you&apos;re taking your
                  first wobbly pedal strokes or racing down a scenic trail. We
                  are your ultimate destination for everything that rolls.
                </p>
                <p>
                  From high-performance <strong>cycles for all ages</strong> to
                  thrilling <strong>electric remote cars for kids</strong>, our
                  carefully curated selection is designed to spark joy and
                  encourage outdoor exploration. We prioritize quality, safety,
                  and most importantly—fun!
                </p>
              </div>
            </motion.div>

            {/* Decorative Graphic */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-square lg:aspect-[4/3] rounded-3xl overflow-hidden bg-accent-100 shadow-xl"
            >
              {/* Using a placeholder for the graphic, with a cycling theme */}
              <Image
                src="https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=1000&q=80"
                alt="People enjoying cycling"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent mix-blend-multiply" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 sm:py-28 bg-accent">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 sm:mb-16"
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-primary mb-3">
              Visit Us
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-secondary tracking-tight">
              Contact & Location
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-primary" />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Contact Details */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-secondary-100/60"
            >
              <div className="space-y-8">
                {/* Address */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
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
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary mb-1">
                      Store Address
                    </h3>
                    <p className="text-secondary-300">
                      123 Funzo Avenue, Cycling District
                      <br />
                      Mumbai, Maharashtra 400001
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary mb-1">
                      Phone
                    </h3>
                    <p className="text-secondary-300">
                      <a
                        href="tel:+916354955653"
                        className="hover:text-primary transition-colors"
                      >
                        +91 6354 955 653
                      </a>
                    </p>
                  </div>
                </div>

                {/* Socials / Instagram */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-secondary mb-1">
                      Social Media
                    </h3>
                    <p className="text-secondary-300">
                      <a
                        href={INSTAGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        @thefunzo1
                      </a>
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-secondary-100">
                  <a
                    href={MAP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-primary hover:bg-primary-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg shadow-primary/20"
                  >
                    Get Directions
                    <svg
                      className="w-5 h-5 ml-2"
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
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Map Iframe */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-3xl p-3 shadow-sm border border-secondary-100/60 aspect-square sm:aspect-video lg:aspect-square"
            >
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
                title="The Funzo Location Map"
              ></iframe>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
