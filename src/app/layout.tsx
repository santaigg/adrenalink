import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { mantineTheme, santaiFont } from "./styles/theme";
import Navbar from "./components/navigation/navbar";
import "@mantine/core/styles.css";
import "./styles/global.css";

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
      <body className={`${santaiFont.variable} antialiased bg-surface-8`}>
        <MantineProvider withGlobalClasses defaultColorScheme="dark" theme={mantineTheme}>
          <Navbar />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
