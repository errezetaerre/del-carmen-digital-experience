import type { Metadata } from "next";
import { Navigation } from "@/domains/navigation";

import {
  Cormorant_Garamond,
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={[
        geistSans.variable,
        geistMono.variable,
        cormorant.variable,
        "h-full",
        "antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">
        <Navigation />
        {children}
      </body>
    </html>
  );
}