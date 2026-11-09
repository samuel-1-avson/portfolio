import { ImageResponse } from "next/og";
import { OG_SIZE, OgCard } from "@/components/og/OgCard";
import { categoryLabels, getProject, projects, statusLabels } from "@/content";

export const alt = "Project case study";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectOpengraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) {
    return new ImageResponse(<OgCard eyebrow="Work" title="Samuel Avornyoh" subtitle="Software & AI engineer" footer="" />, size);
  }
  return new ImageResponse(
    <OgCard
      eyebrow={project.caseStudy ? "Case study" : "Project"}
      title={project.name}
      subtitle={project.tagline}
      footer={`${statusLabels[project.status]} · ${project.categories.slice(0, 2).map((category) => categoryLabels[category]).join(" · ")}`}
    />,
    size,
  );
}
