import type { Metadata } from "next";
import "../styles/global.css";
import { Mohave } from "next/font/google";
import Footer from "../components/navigation/Footer";
import Navbar from "../components/navigation/Navbar";

export const metadata: Metadata = {
  title: "Santai.GG",
  description: "The #1 Spectre Divide tracker.",
};

export const santaiFont = Mohave({
  variable: "--font-mohave",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${santaiFont.variable} antialiased bg-surface-8`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
