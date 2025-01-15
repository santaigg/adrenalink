import type { Metadata } from "next";
import "../styles/global-variables.css";
import "../styles/global-style.css";
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
      <body className={`${santaiFont.variable} antialiased bg-bottom text-bottom-foreground`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
