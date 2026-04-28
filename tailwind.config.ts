import type { Config } from "tailwindcss";

// StrategAIze Style Guide V2 — Brand Tokens (DEC-017)
// MT-6: Tailwind-Theme + Brand-Farben aus STRATEGAIZE_STYLE_GUIDE_V2.md
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          "primary-dark": "#120774",
          primary: "#4454b8",
          "success-dark": "#00a84f",
          success: "#4dcb8b",
          "warning-dark": "#f2b705",
          warning: "#ffd54f",
        },
        // Status-Badge-Farben aus Style Guide V2 sind Tailwind-Standard-Slate/Blue/Orange/Emerald — kein Custom-Token noetig.
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
      maxWidth: {
        // Style Guide V2 Container-Standard: max-w-[1800px] mx-auto
        page: "1800px",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(to right, #120774, #4454b8)",
        "gradient-success": "linear-gradient(to right, #00a84f, #4dcb8b)",
        "gradient-warning": "linear-gradient(to right, #f2b705, #ffd54f)",
        "gradient-ai": "linear-gradient(to right, #9333ea, #4f46e5)",
      },
    },
  },
  plugins: [],
};

export default config;
