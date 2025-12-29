import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Scanlines from "@/components/effects/Scanlines";
import KonamiListener from "@/components/effects/KonamiListener";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Retro Portfolio",
  description: "A minimal retro portfolio website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} antialiased bg-retro-bg text-retro-fg`}
        suppressHydrationWarning
      >
        <Scanlines />
        <KonamiListener />
        {children}
      </body>
    </html>
  );
}
