import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        mono:    ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        brand: {
          50:  "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          900: "#064e3b",
        },
      },
      backgroundImage: {
        "gradient-brand":      "linear-gradient(135deg, #059669 0%, #047857 100%)",
        "gradient-brand-soft": "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
      },
      boxShadow: {
        soft:         "0 2px 8px 0 rgba(0,0,0,0.06)",
        card:         "0 1px 3px 0 rgba(0,0,0,0.4), 0 4px 16px 0 rgba(0,0,0,0.25)",
        "card-hover": "0 4px 24px 0 rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)",
        "glow-brand": "0 0 20px rgba(16,185,129,0.35), 0 0 40px rgba(16,185,129,0.15)",
        "glow-sm":    "0 0 12px rgba(16,185,129,0.25)",
      },
      animation: {
        "fade-in":  "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s cubic-bezier(0.22,1,0.36,1)",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
