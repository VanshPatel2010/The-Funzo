import { resolve } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/categories/:slug",
        destination: "/category/:slug",
        permanent: true,
      },
      {
        source: "/products/:slug",
        destination: "/product/:slug",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  webpack: (config, { dev, isServer }) => {
    // Only apply custom cache options for production builds.
    // In dev mode, Next.js default in-memory caching is faster.
    if (!dev) {
      try {
        config.cache = {
          type: "filesystem",
          store: "pack",
          allowCollectingMemory: true,
          readonly: false,
          cacheDirectory: resolve(process.cwd(), ".next", "cache", "webpack"),
          compression: "gzip",
        };
      } catch (e) {
        console.warn("Failed to set custom webpack cache options:", e);
      }
    }

    return config;
  },
};

export default nextConfig;
