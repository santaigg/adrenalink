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
				surface: {
					0: "hsl(var(--mantine-color-surfaceColors-0) / <alpha-value>)",
					1: "hsl(var(--mantine-color-surfaceColors-1) / <alpha-value>)",
					2: "hsl(var(--mantine-color-surfaceColors-2) / <alpha-value>)",
					3: "hsl(var(--mantine-color-surfaceColors-3) / <alpha-value>)",
					4: "hsl(var(--mantine-color-surfaceColors-4) / <alpha-value>)",
					5: "hsl(var(--mantine-color-surfaceColors-5) / <alpha-value>)",
					6: "hsl(var(--mantine-color-surfaceColors-6) / <alpha-value>)",
					7: "hsl(var(--mantine-color-surfaceColors-7) / <alpha-value>)",
					8: "hsl(var(--mantine-color-surfaceColors-8) / <alpha-value>)",
					9: "hsl(var(--mantine-color-surfaceColors-9) / <alpha-value>)",
				},
        primary: {
					0: "hsl(var(--mantine-color-primaryColors-0) / <alpha-value>)",
					1: "hsl(var(--mantine-color-primaryColors-1) / <alpha-value>)",
					2: "hsl(var(--mantine-color-primaryColors-2) / <alpha-value>)",
					3: "hsl(var(--mantine-color-primaryColors-3) / <alpha-value>)",
					4: "hsl(var(--mantine-color-primaryColors-4) / <alpha-value>)",
					5: "hsl(var(--mantine-color-primaryColors-5) / <alpha-value>)",
					6: "hsl(var(--mantine-color-primaryColors-6) / <alpha-value>)",
					7: "hsl(var(--mantine-color-primaryColors-7) / <alpha-value>)",
					8: "hsl(var(--mantine-color-primaryColors-8) / <alpha-value>)",
					9: "hsl(var(--mantine-color-primaryColors-9) / <alpha-value>)",
				},
      },
    },
  },
  plugins: [],
} satisfies Config;
