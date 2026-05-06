import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E84A2F",
          50: "#FDF0ED",
          100: "#FBDDD6",
          200: "#F7B8A8",
          300: "#F3937A",
          400: "#EF6E4C",
          500: "#E84A2F",
          600: "#C93518",
          700: "#972813",
          800: "#651A0D",
          900: "#330D06",
        },
        secondary: {
          DEFAULT: "#1A1A1A",
          50: "#F5F5F5",
          100: "#E0E0E0",
          200: "#B3B3B3",
          300: "#808080",
          400: "#4D4D4D",
          500: "#1A1A1A",
          600: "#141414",
          700: "#0F0F0F",
          800: "#0A0A0A",
          900: "#050505",
        },
        accent: {
          DEFAULT: "#F5F5F0",
          50: "#FFFFFF",
          100: "#FDFDFB",
          200: "#FAFAF5",
          300: "#F7F7F3",
          400: "#F5F5F0",
          500: "#E8E8DE",
          600: "#D4D4C5",
          700: "#BFBFAC",
          800: "#ABAB93",
          900: "#96967A",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
