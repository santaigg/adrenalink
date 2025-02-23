import type { Metadata } from "next";
import { Mohave } from "next/font/google";
import "../styles/global-variables.css";
import "../styles/global-style.css";
import Footer from "../components/navigation/Footer";
import Navbar from "../components/navigation/Navbar";

export const metadata: Metadata = {
  title: "Santai.GG",
  description: "The #1 Spectre Divide tracker.",
};

export const defaultFont = Mohave({
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
      <body className={"antialiased h-svh font-sans bg-primary text-primary-foreground ${defaultFont.variable}"}>
        <Navbar />
        <div className="flex flex-col justify-between z-40 h-[92svh]">
          <div>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
