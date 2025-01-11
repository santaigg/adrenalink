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
					'dark': "hsl(var(--surface-dark) / <alpha-value>)",
					'base': "hsl(var(--surface-base) / <alpha-value>)",
					'light': "hsl(var(--surface-light) / <alpha-value>)",
				},
      },
    },
  },
  plugins: [],
} satisfies Config;
