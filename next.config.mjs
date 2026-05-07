import { resolve } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  webpack: (config, { dev, isServer }) => {
    try {
      // Enable PackFile cache options to allow Buffer conversion for large strings
      // and move cache out of node_modules to avoid rename/permission issues.
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

    return config;
  },
};

export default nextConfig;
