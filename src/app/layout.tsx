import type { Metadata } from "next";
import { Mohave } from "next/font/google";
import { createTheme, MantineProvider, ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import Navbar from "./components/navigation/Navbar";
import "@mantine/core/styles.css";
import "./global.css";

const mantineTheme = createTheme({
  colors: {
    santai: ["#f9ffe2", "#f4ffcd", "#e8fe9c", "#dcfd67", "#d2fc3b", "#cbfb20", "#c8fb0d", "#afdf00", "#9bc700", "#83ab00"],
  },
  autoContrast: true,
  primaryColor: "santai",
  fontFamily: "Mohave, serif",
});

const mohave = Mohave({
  variable: "--font-mohave",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Santai.GG",
  description: "The #1 Spectre Divide tracker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${mohave.variable} antialiased bg-surface-base`}>
        <MantineProvider defaultColorScheme="dark" theme={mantineTheme}>
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
