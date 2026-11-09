import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import AskButton from "@/components/assistant/AskButton";
import { ArrowRight, Container, ExternalLink, StatusLabel, TagList, buttonClasses } from "@/components/ui/primitives";
import { ArchitectureDiagram, FlowSteps } from "@/components/work/ArchitectureDiagram";
import {
  caseStudyProjects,
  categoryLabels,
  formatDate,
  formatPeriod,
  getLastActivity,
  getProject,
  getRepoSnapshot,
  projects,
  SITE_URL,
  statusLabels,
} from "@/content";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = project.caseStudy ? `${project.name} — case study` : project.name;
  return {
    title,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: { type: "article", url: `/work/${project.slug}`, title, description: project.tagline },
    twitter: { card: "summary_large_image", title, description: project.tagline },
  };
}

function Section({ index, title, children, id }: { index: string; title: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line-strong pt-6 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-3">
        <p className="font-mono text-xs text-subtle">{index}</p>
        <h2 id={id} className="mt-2 text-xl font-semibold tracking-tight">
          {title}
        </h2>
      </div>
      <div className="lg:col-span-9">{children}</div>
    </section>
  );
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const study = project.caseStudy;
  const snapshot = getRepoSnapshot(project);
  const lastActivity = getLastActivity(project);
  const position = caseStudyProjects.findIndex((item) => item.slug === project.slug);
  const next = position >= 0 ? caseStudyProjects[(position + 1) % caseStudyProjects.length] : caseStudyProjects[0];
  const source = project.links.find((link) => link.kind === "source");

  const structuredData = {
    "@context": "https://schema.org",
    "@type": source ? "SoftwareSourceCode" : "CreativeWork",
    name: project.name,
    description: project.summary,
    url: `${SITE_URL}/work/${project.slug}`,
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: "Samuel Maxwell Obeng Avornyoh" },
    dateModified: lastActivity,
    keywords: project.stack.join(", "),
    ...(source ? { codeRepository: source.href, programmingLanguage: project.stack.slice(0, 3) } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Container className="pt-10 pb-24 sm:pt-14 sm:pb-32">
        <nav aria-label="Breadcrumb" className="no-print">
          <ol className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-subtle">
            <li>
              <Link href="/work" className="hover:text-fg">
                Work
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-fg">
              {project.name}
            </li>
          </ol>
        </nav>

        <header className="mt-12">
          <p className="label">{project.categories.map((category) => categoryLabels[category]).join(" · ")}</p>
          <h1 className="mt-5 max-w-5xl text-display font-semibold">{project.name}</h1>
          <p className="mt-6 max-w-3xl text-lede">{project.tagline}</p>
          <p className="mt-5 max-w-3xl text-muted">{project.summary}</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {project.links.map((link) => (
              <ExternalLink key={link.href} href={link.href} className="min-h-11 font-medium">
                {link.label}
              </ExternalLink>
            ))}
            {project.repository?.visibility === "private" && <span className="text-sm text-subtle">Source repository is private.</span>}
            <AskButton className={`${buttonClasses("secondary")} no-print`} prompt={`Tell me about ${project.name}: what it does, how it's built and its current status.`}>
              Ask the assistant about {project.name}
            </AskButton>
          </div>
        </header>

        <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-bg p-5">
            <dt className="label">Status</dt>
            <dd className="mt-3">
              <StatusLabel status={project.status} label={statusLabels[project.status]} />
              <p className="mt-2 text-sm text-muted">{project.statusNote}</p>
            </dd>
          </div>
          <div className="bg-bg p-5">
            <dt className="label">Role</dt>
            <dd className="mt-3 text-[0.95rem]">
              {project.role}
              {project.contribution && <p className="mt-1 text-sm text-muted">{project.contribution}</p>}
            </dd>
          </div>
          <div className="bg-bg p-5">
            <dt className="label">Timeline</dt>
            <dd className="mt-3 text-[0.95rem]">
              {formatPeriod(project.started, project.ended)}
              <p className="mt-1 text-sm text-muted">
                Last activity <time dateTime={lastActivity}>{formatDate(lastActivity)}</time>
                {snapshot && snapshot.stars > 0 ? ` · ${snapshot.stars} ★` : ""}
              </p>
            </dd>
          </div>
          <div className="bg-bg p-5">
            <dt className="label">Stack</dt>
            <dd className="mt-3">
              <TagList items={project.stack} label={`${project.name} technologies`} />
            </dd>
          </div>
        </dl>

        <div className="mt-20 space-y-20">
          {study ? (
            <>
              <Section index="01" title="The problem" id="problem">
                <div className="prose-body text-lg">
                  <p className="text-fg">{study.problem}</p>
                  <p>{study.motivation}</p>
                </div>
              </Section>

              <Section index="02" title="The approach" id="approach">
                <p className="prose-body text-lg">{study.solution}</p>
              </Section>

              <Section index="03" title="Architecture" id="architecture">
                <p className="prose-body mb-8">{study.architecture.summary}</p>
                <ArchitectureDiagram name={project.name} architecture={study.architecture} />
                <h3 className="label mt-12 mb-4">How a request flows</h3>
                <FlowSteps steps={study.architecture.flow} />
              </Section>

              <Section index="04" title="Core features" id="features">
                <ul className="grid gap-x-10 sm:grid-cols-2">
                  {project.highlights.map((item) => (
                    <li key={item} className="border-t border-line py-4 text-[0.98rem]">
                      {item}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section index="05" title="Engineering decisions" id="decisions">
                <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {study.decisions.map((item) => (
                    <div key={item.title} className="border-t border-line pt-4">
                      <dt className="font-semibold">{item.title}</dt>
                      <dd className="mt-2 text-muted">{item.detail}</dd>
                    </div>
                  ))}
                </dl>
              </Section>

              <Section index="06" title="Challenges" id="challenges">
                <dl className="space-y-8">
                  {study.challenges.map((item) => (
                    <div key={item.title} className="border-t border-line pt-4">
                      <dt className="font-semibold">{item.title}</dt>
                      <dd className="prose-body mt-2">{item.detail}</dd>
                    </div>
                  ))}
                </dl>
              </Section>

              <Section index="07" title="Where it stands" id="status">
                <div className="grid gap-10 sm:grid-cols-2">
                  <div>
                    <h3 className="label mb-3">Done and verified</h3>
                    <ul className="space-y-3">
                      {study.progress.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-fg" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="label mb-3">Next</h3>
                    <ul className="space-y-3 text-muted">
                      {study.next.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 border border-fg" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Section>
            </>
          ) : (
            <Section index="01" title="What it does" id="features">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {project.highlights.map((item) => (
                  <li key={item} className="border-t border-line py-4">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-subtle">A full case study for this project has not been written yet.</p>
            </Section>
          )}
        </div>

        {next && next.slug !== project.slug && (
          <nav aria-label="Next case study" className="no-print mt-28 border-t border-line-strong pt-8">
            <Link href={`/work/${next.slug}`} className="group flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <span>
                <span className="label">Next case study</span>
                <span className="mt-3 block text-title font-semibold">{next.name}</span>
                <span className="mt-2 block text-muted">{next.tagline}</span>
              </span>
              <ArrowRight className="size-8" />
            </Link>
          </nav>
        )}
      </Container>
    </article>
  );
}
