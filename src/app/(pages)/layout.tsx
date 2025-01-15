import type { Metadata } from "next";
import { MantineProvider, ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { mantineTheme, santaiFont } from "../styles/theme";
import Footer from "../components/navigation/Footer";
import "@mantine/core/styles.css";
import "../styles/global.css";
import Navbar from "../components/navigation/Navbar";

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
          <div className="flex flex-col">
            {children}
            <Footer />
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
