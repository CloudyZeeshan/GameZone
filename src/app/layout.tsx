import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameZone - Play Free HTML5 Games Online",
  description: "Play thousands of free HTML5 games instantly online. No downloads required! Enjoy puzzle, action, arcade, racing, and more games on any device.",
  keywords: ["html5 games", "free games", "online games", "browser games", "instant play", "no download games"],
  authors: [{ name: "GameZone" }],
  openGraph: {
    title: "GameZone - Play Free HTML5 Games Online",
    description: "Play thousands of free HTML5 games instantly online. No downloads required!",
    type: "website",
    locale: "en_US",
    siteName: "GameZone",
  },
  twitter: {
    card: "summary_large_image",
    title: "GameZone - Play Free HTML5 Games Online",
    description: "Play thousands of free HTML5 games instantly online. No downloads required!",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
