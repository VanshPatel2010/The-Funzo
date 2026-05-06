"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

// ─── Bicycle SVG ────────────────────────────────────────────────────────────

function BicycleSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 140"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Rear wheel */}
      <circle cx="50" cy="100" r="32" stroke="currentColor" strokeWidth="3" />
      <circle cx="50" cy="100" r="4" fill="currentColor" />
      {/* Spokes rear */}
      <line
        x1="50"
        y1="68"
        x2="50"
        y2="132"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="18"
        y1="100"
        x2="82"
        y2="100"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="27"
        y1="77"
        x2="73"
        y2="123"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="73"
        y1="77"
        x2="27"
        y2="123"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Front wheel */}
      <circle cx="150" cy="100" r="32" stroke="currentColor" strokeWidth="3" />
      <circle cx="150" cy="100" r="4" fill="currentColor" />
      {/* Spokes front */}
      <line
        x1="150"
        y1="68"
        x2="150"
        y2="132"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="118"
        y1="100"
        x2="182"
        y2="100"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="127"
        y1="77"
        x2="173"
        y2="123"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <line
        x1="173"
        y1="77"
        x2="127"
        y2="123"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />

      {/* Frame */}
      <path
        d="M50 100 L90 55 L150 100 M90 55 L115 55 L150 100 M90 55 L50 100"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Seat */}
      <path
        d="M82 50 L98 50"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="50"
        x2="90"
        y2="55"
        stroke="currentColor"
        strokeWidth="3"
      />
      {/* Handlebars */}
      <path
        d="M112 48 L120 55 L118 62"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Pedal area */}
      <circle cx="90" cy="88" r="6" stroke="currentColor" strokeWidth="2" />
      <line
        x1="84"
        y1="88"
        x2="96"
        y2="88"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Chain stay */}
      <line
        x1="50"
        y1="100"
        x2="90"
        y2="88"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

// ─── Toy Car SVG ────────────────────────────────────────────────────────────

function ToyCarSVG({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 120"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Car body lower */}
      <path
        d="M30 70 L30 85 Q30 95 40 95 L180 95 Q190 95 190 85 L190 70 Z"
        fill="currentColor"
        opacity="0.15"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Car body upper / cabin */}
      <path
        d="M50 70 L65 38 Q68 32 75 32 L140 32 Q147 32 150 38 L170 70"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Roof line */}
      <line
        x1="72"
        y1="35"
        x2="143"
        y2="35"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.3"
      />
      {/* Hood */}
      <line
        x1="30"
        y1="70"
        x2="190"
        y2="70"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      {/* Windshield */}
      <line
        x1="68"
        y1="42"
        x2="78"
        y2="68"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Rear window */}
      <line
        x1="148"
        y1="42"
        x2="138"
        y2="68"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      {/* Windows */}
      <path
        d="M80 68 L72 44 L105 44 L105 68 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      <path
        d="M110 68 L110 44 L143 44 L138 68 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.4"
      />
      {/* Headlight */}
      <circle
        cx="186"
        cy="78"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Taillight */}
      <circle
        cx="34"
        cy="78"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="currentColor"
        opacity="0.3"
      />
      {/* Front bumper */}
      <path
        d="M188 80 Q195 82 195 88 L190 92"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Rear bumper */}
      <path
        d="M32 80 Q25 82 25 88 L30 92"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Front wheel */}
      <circle cx="155" cy="97" r="14" stroke="currentColor" strokeWidth="3" />
      <circle cx="155" cy="97" r="5" fill="currentColor" opacity="0.5" />
      {/* Rear wheel */}
      <circle cx="65" cy="97" r="14" stroke="currentColor" strokeWidth="3" />
      <circle cx="65" cy="97" r="5" fill="currentColor" opacity="0.5" />

      {/* Antenna */}
      <line
        x1="80"
        y1="32"
        x2="75"
        y2="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="75" cy="12" r="3" fill="currentColor" opacity="0.6" />
      {/* RC signal waves */}
      <path
        d="M68 8 Q75 2 82 8"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
        fill="none"
      />
      <path
        d="M64 4 Q75 -4 86 4"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.2"
        fill="none"
      />
    </svg>
  );
}

// ─── Animation Variants ─────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as any },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: "easeOut" },
  }),
};

// ─── Hero Component ─────────────────────────────────────────────────────────

export default function Hero() {
  const headlineWords = ["Ride", "Into", "Adventure"];

  const handleScrollToCatalogue = () => {
    const el = document.getElementById("catalogue");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-secondary -mt-[68px] pt-[68px]">
      {/* ── Animated gradient shimmer background ── */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary-700 to-secondary-900" />

        {/* Moving shimmer 1 */}
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(120deg, transparent 30%, #E84A2F 50%, transparent 70%)",
            backgroundSize: "200% 200%",
          }}
        />

        {/* Moving shimmer 2 (counter) */}
        <motion.div
          animate={{
            backgroundPosition: ["100% 0%", "0% 100%", "100% 0%"],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at center, #E84A2F 0%, transparent 70%)",
            backgroundSize: "150% 150%",
          }}
        />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #F5F5F0 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* ── Floating decorative shapes ── */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] right-[8%] w-20 h-20 rounded-full bg-primary/[0.06] blur-sm hidden lg:block"
      />
      <motion.div
        animate={{ y: [0, 12, 0], rotate: [0, -2, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-[20%] left-[5%] w-16 h-16 rounded-full bg-primary/[0.04] blur-sm hidden lg:block"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] left-[15%] w-2 h-2 rounded-full bg-primary/20 hidden lg:block"
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* ── Left: Text Content ── */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-primary">
                Now Open
              </span>
            </motion.div>

            {/* Headline — staggered words */}
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-extrabold leading-[1.08] tracking-tight mb-6"
            >
              {headlineWords.map((word) => (
                <motion.span
                  key={word}
                  variants={wordVariants}
                  className={`inline-block mr-4 sm:mr-5 ${
                    word === "Adventure" ? "text-primary" : "text-accent-50"
                  }`}
                >
                  {word}
                </motion.span>
              ))}

              {/* Second line */}
              <motion.span
                variants={wordVariants}
                className="block mt-2 text-[1.5rem] sm:text-3xl lg:text-4xl font-bold text-secondary-300"
              >
                with{" "}
                <span className="text-primary font-extrabold">The Funzo</span>
              </motion.span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              custom={0.9}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-secondary-200 text-base sm:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed mb-10"
            >
              Premium cycles and kids&apos; electric remote cars — built for
              fun, safety, and unforgettable adventures in every ride.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={1.1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row items-center lg:items-start gap-4"
            >
              <motion.button
                onClick={handleScrollToCatalogue}
                whileHover={{ scale: 1.05, backgroundColor: "#C93518" }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="relative group bg-primary text-white px-8 py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-shadow duration-300 overflow-hidden"
              >
                {/* Button shimmer */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative z-10 flex items-center gap-2">
                  Explore Catalogue
                  <svg
                    className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </span>
              </motion.button>

              <motion.button
                onClick={() => (window.location.href = "/about")}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="text-accent-400 hover:text-primary font-medium text-base flex items-center gap-2 px-4 py-3 transition-colors duration-200"
              >
                Learn More
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
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </motion.button>
            </motion.div>

            {/* Social proof / stats */}
            <motion.div
              custom={1.4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center lg:justify-start gap-8 mt-12 pt-8 border-t border-white/[0.06]"
            >
              {[
                { value: "500+", label: "Happy Riders" },
                { value: "50+", label: "Products" },
                { value: "4.9★", label: "Rating" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-accent-50">
                    {stat.value}
                  </p>
                  <p className="text-xs text-secondary-300 mt-1 tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Floating Visuals ── */}
          <div className="relative flex items-center justify-center min-h-[320px] sm:min-h-[400px] lg:min-h-[500px]">
            {/* Glow ring */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], opacity: [0.15, 0.25, 0.15] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full border border-primary/20"
            />
            <motion.div
              animate={{ scale: [1.05, 1, 1.05], opacity: [0.1, 0.18, 0.1] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute w-48 h-48 sm:w-60 sm:h-60 lg:w-72 lg:h-72 rounded-full border border-primary/10"
            />

            {/* Center circle */}
            <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 blur-2xl" />

            {/* Bicycle — floating top-left */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                x: [0, 8, 0],
                rotate: [0, -3, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-2 sm:top-0 left-4 sm:left-8 lg:left-4"
            >
              <BicycleSVG className="w-36 h-28 sm:w-44 sm:h-32 lg:w-52 lg:h-36 text-primary/60" />
            </motion.div>

            {/* Toy Car — floating bottom-right */}
            <motion.div
              animate={{
                y: [0, 16, 0],
                x: [0, -10, 0],
                rotate: [0, 4, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 lg:right-4"
            >
              <ToyCarSVG className="w-40 h-24 sm:w-48 sm:h-28 lg:w-56 lg:h-32 text-accent-400/50" />
            </motion.div>

            {/* Small floating accents */}
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
              className="absolute top-[30%] right-[20%] w-3 h-3 rounded-full bg-primary/30"
            />
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
              className="absolute bottom-[35%] left-[25%] w-2 h-2 rounded-full bg-accent-500/40"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute top-[55%] right-[35%] w-1.5 h-1.5 rounded-full bg-primary/40"
            />
          </div>
        </div>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-accent to-transparent pointer-events-none" />
    </section>
  );
}
