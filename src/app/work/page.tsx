import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/primitives";
import ProjectExplorer from "@/components/work/ProjectExplorer";
import { FeaturedProjectRow, ProjectRow } from "@/components/work/ProjectList";
import { featuredProjects, getCategoryCounts, projects, projectsByRecency } from "@/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Case studies and projects: crypto payments, a Solana proxy marketplace, encrypted secrets backup, a consensus package registry, AI tools and embedded-systems software.",
  alternates: { canonical: "/work" },
};

const tierOrder = { featured: 0, standard: 1, archive: 2 } as const;

export default function WorkPage() {
  const ordered = [...projectsByRecency].sort((left, right) => tierOrder[left.tier] - tierOrder[right.tier]);
  const current = ordered.filter((project) => project.tier !== "archive");

  return (
    <Container className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <p className="label">Work</p>
      <h1 className="mt-6 max-w-4xl text-display font-semibold">Projects, with the evidence.</h1>
      <p className="mt-6 max-w-2xl text-lede text-muted">
        {`${projects.length} projects from GitHub, verified against their repositories. Status labels use each project’s own wording — testnet means testnet.`}
      </p>

      <section aria-labelledby="featured-title" className="mt-20">
        <h2 id="featured-title" className="label border-t border-line-strong pt-6">
          Case studies
        </h2>
        <ol className="mt-2">
          {featuredProjects.map((project, index) => (
            <FeaturedProjectRow key={project.slug} project={project} index={index} />
          ))}
        </ol>
      </section>

      <section aria-labelledby="all-title" className="mt-20">
        <h2 id="all-title" className="label border-t border-line-strong pt-6 mb-6">
          Index of all projects
        </h2>
        <Suspense
          fallback={
            <ul className="border-b border-line">
              {current.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </ul>
          }
        >
          <ProjectExplorer projects={ordered} categories={getCategoryCounts()} />
        </Suspense>
      </section>
    </Container>
  );
}
