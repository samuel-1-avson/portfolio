import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Scanlines from "@/components/effects/Scanlines";
import KonamiListener from "@/components/effects/KonamiListener";
import { portfolioData } from "@/data/portfolio";

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
  title: { default: "Samuel Maxwell Obeng Avornyoh | AI & Systems Engineer", template: "%s | Samuel Avornyoh" },
  description: "Portfolio of Samuel Maxwell Obeng Avornyoh, an AI/ML engineer and full-stack developer building intelligent systems, data platforms, and embedded tooling.",
  keywords: ["AI engineer", "machine learning", "full-stack developer", "embedded systems", "Ghana"],
  openGraph: { type: "website", title: "Samuel Maxwell Obeng Avornyoh | AI & Systems Engineer", description: "Selected work in AI, data platforms, full-stack development, and embedded systems." },
  twitter: { card: "summary", title: "Samuel Maxwell Obeng Avornyoh | AI & Systems Engineer", description: "Selected work in AI, data platforms, full-stack development, and embedded systems." },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: portfolioData.personal.name,
        jobTitle: "AI/ML Engineer and Full-Stack Developer",
        description: portfolioData.personal.bio,
        email: portfolioData.personal.email,
        address: { "@type": "PostalAddress", addressCountry: portfolioData.personal.location },
        sameAs: [portfolioData.socials.github, portfolioData.socials.linkedin],
        knowsAbout: [...portfolioData.skills.technical, ...portfolioData.skills.tools.slice(0, 12)],
      },
      { "@type": "WebSite", name: `${portfolioData.personal.name} Portfolio`, description: "Selected AI, full-stack, embedded systems, and data engineering work." },
    ],
  };
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${spaceMono.variable} antialiased bg-retro-bg text-retro-fg`}
        suppressHydrationWarning
      >
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <Scanlines />
        <KonamiListener />
        {children}
      </body>
    </html>
  );
}
