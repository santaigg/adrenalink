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
					0: "var(--mantine-color-surfaceColors-0)",
					1: "var(--mantine-color-surfaceColors-1)",
					2: "var(--mantine-color-surfaceColors-2)",
					3: "var(--mantine-color-surfaceColors-3)",
					4: "var(--mantine-color-surfaceColors-4)",
					5: "var(--mantine-color-surfaceColors-5)",
					6: "var(--mantine-color-surfaceColors-6)",
					7: "var(--mantine-color-surfaceColors-7)",
					8: "var(--mantine-color-surfaceColors-8)",
					9: "var(--mantine-color-surfaceColors-9)",
				},
        	primary: {
					0: "var(--mantine-color-primaryColors-0)",
					1: "var(--mantine-color-primaryColors-1)",
					2: "var(--mantine-color-primaryColors-2)",
					3: "var(--mantine-color-primaryColors-3)",
					4: "var(--mantine-color-primaryColors-4)",
					5: "var(--mantine-color-primaryColors-5)",
					6: "var(--mantine-color-primaryColors-6)",
					7: "var(--mantine-color-primaryColors-7)",
					8: "var(--mantine-color-primaryColors-8)",
					9: "var(--mantine-color-primaryColors-9)",
				},
      },
    },
  },
  plugins: [],
} satisfies Config;
