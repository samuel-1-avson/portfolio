import type { MetadataRoute } from "next";
import { getLastActivity, projects, SITE_URL } from "@/content";
import { RESUME_REVISED } from "@/content/resume";

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = projects.map(getLastActivity).sort().at(-1) ?? new Date().toISOString().slice(0, 10);
  return [
    { url: `${SITE_URL}/`, lastModified: latest, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: latest, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: latest, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/resume`, lastModified: `${RESUME_REVISED}-01`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((project) => ({
      url: `${SITE_URL}/work/${project.slug}`,
      lastModified: getLastActivity(project),
      changeFrequency: "monthly" as const,
      priority: project.tier === "featured" ? 0.8 : project.tier === "standard" ? 0.5 : 0.3,
    })),
  ];
}
