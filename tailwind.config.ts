import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bottom: {
          DEFAULT: "hsl(var(--bottom) / <alpha-value>)",
          foreground: "hsl(var(--bottom-foreground) / <alpha-value>)",
        },
        island: {
          DEFAULT: "hsl(var(--island) / <alpha-value>)",
          foreground: "hsl(var(--island-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        input: {
          DEFAULT: "hsl(var(--input) / <alpha-value>)",
          foreground: "hsl(var(--input-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
      },
      borderRadius: {
        bottom: "var(--radius) - 2px",
        island: "var(--radius) - 1px",
        popover: "var(--radius)",
      }
    },
  },
  plugins: [],
} satisfies Config;