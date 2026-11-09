import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { AssistantProvider } from "@/components/assistant/AssistantProvider";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { profile, projects, SITE_URL } from "@/content";
import "./globals.css";

const description =
  "Samuel Maxwell Obeng Avornyoh is a software and AI engineer in Ghana building payment infrastructure, security tooling, blockchain systems and grounded AI assistants.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${profile.name} — ${profile.role}`, template: `%s — ${profile.shortName}` },
  description,
  applicationName: `${profile.shortName} portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: profile.shortName,
    title: `${profile.name} — ${profile.role}`,
    description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: `${profile.name} — ${profile.role}`, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

// Runs before paint so a stored dark preference never flashes white. Light is the default.
const themeScript = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: profile.name,
      alternateName: profile.shortName,
      jobTitle: profile.role,
      description: profile.intro,
      url: SITE_URL,
      email: `mailto:${profile.email}`,
      address: { "@type": "PostalAddress", addressCountry: "GH" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "University of Mines and Technology" },
      sameAs: profile.socials.map((social) => social.href),
      knowsAbout: ["Rust", "Go", "TypeScript", "Payment systems", "Blockchain", "Applied AI", "Security engineering"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: `${profile.shortName} — portfolio`,
      author: { "@id": `${SITE_URL}/#person` },
      hasPart: projects.filter((project) => project.caseStudy).map((project) => ({ "@type": "WebPage", url: `${SITE_URL}/work/${project.slug}`, name: project.name })),
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-bg text-fg">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <a
          href="#main"
          className="sr-only z-50 bg-fg px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <AssistantProvider>
          <SiteHeader />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <SiteFooter />
        </AssistantProvider>
      </body>
    </html>
  );
}
