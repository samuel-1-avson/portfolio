import type { MetadataRoute } from "next";
import { portfolioData } from "@/data/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://samuel-seven-gamma.vercel.app";
  const now = new Date();

  const mainRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/connect`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = portfolioData.projects.map((project) => ({
    url: `${baseUrl}/#projects-${project.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...mainRoutes, ...projectRoutes];
}

