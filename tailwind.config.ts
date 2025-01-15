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
  			surface: {
  				'0': 'var(--mantine-color-surfaceColors-0)',
  				'1': 'var(--mantine-color-surfaceColors-1)',
  				'2': 'var(--mantine-color-surfaceColors-2)',
  				'3': 'var(--mantine-color-surfaceColors-3)',
  				'4': 'var(--mantine-color-surfaceColors-4)',
  				'5': 'var(--mantine-color-surfaceColors-5)',
  				'6': 'var(--mantine-color-surfaceColors-6)',
  				'7': 'var(--mantine-color-surfaceColors-7)',
  				'8': 'var(--mantine-color-surfaceColors-8)',
  				'9': 'var(--mantine-color-surfaceColors-9)'
  			},
  			primary: {
  				'0': 'var(--mantine-color-primaryColors-0)',
  				'1': 'var(--mantine-color-primaryColors-1)',
  				'2': 'var(--mantine-color-primaryColors-2)',
  				'3': 'var(--mantine-color-primaryColors-3)',
  				'4': 'var(--mantine-color-primaryColors-4)',
  				'5': 'var(--mantine-color-primaryColors-5)',
  				'6': 'var(--mantine-color-primaryColors-6)',
  				'7': 'var(--mantine-color-primaryColors-7)',
  				'8': 'var(--mantine-color-primaryColors-8)',
  				'9': 'var(--mantine-color-primaryColors-9)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
