import type { Config } from "tailwindcss";

export default {
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        table: {
          DEFAULT: "hsl(var(--table) / <alpha-value>)",
          secondary: "hsl(var(--table-secondary) / <alpha-value>)",
          header: "hsl(var(--table-header) / <alpha-value>)",
        },
        input: {
          DEFAULT: "hsl(var(--input) / <alpha-value>)",
          foreground: "hsl(var(--input-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
      },
      gap: {
        primary: "calc(var(--spacing))",
        secondary: "calc(var(--spacing) * 0.6)",
      },
      padding: {
        primary: "calc(var(--spacing))",
        secondary: "calc(var(--spacing) * 0.6)",
      },
      margin: {
        primary: "calc(var(--spacing))",
        secondary: "calc(var(--spacing) * 0.6)",
      },
      borderRadius: {
        primary: "calc(var(--rounding))"
      },
      fontFamily: {
        sans: ["mohave", "system-ui", "sans-serif"]
      },
      screens: {
        constrict: "var(--constrict-threshold)"
      }
    },
  },
  plugins: [],
} satisfies Config;
