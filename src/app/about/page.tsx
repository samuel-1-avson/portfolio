import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink, Container, DownloadIcon, ExternalLink } from "@/components/ui/primitives";
import { education, experience, formatDate, getProject, milestones, profile, recognition, skillGroups } from "@/content";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience, skills, education and recognition of Samuel Maxwell Obeng Avornyoh, software and AI engineer.",
  alternates: { canonical: "/about" },
};

function Block({ id, label, title, children }: { id: string; label: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line-strong pt-6">
      <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <p className="label">{label}</p>
          <h2 id={`${id}-title`} className="mt-3 text-2xl font-semibold tracking-tight">
            {title}
          </h2>
        </div>
        <div className="lg:col-span-8">{children}</div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const verifiedRecognition = recognition.filter((item) => item.verified);

  return (
    <Container className="pt-16 pb-24 sm:pt-24 sm:pb-32">
      <p className="label">About</p>
      <h1 className="mt-6 max-w-4xl text-display font-semibold">I build the parts that have to be right.</h1>

      <div className="mt-12 grid gap-12 lg:grid-cols-12">
        <div className="prose-body text-lg lg:col-span-8">
          {profile.about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        <aside className="lg:col-span-4" aria-label="Quick facts">
          <dl className="space-y-5 border-t border-line pt-5 text-[0.95rem]">
            <div>
              <dt className="label">Based in</dt>
              <dd className="mt-1">{profile.location}</dd>
            </div>
            <div>
              <dt className="label">Languages</dt>
              <dd className="mt-1">{profile.languages.join(", ")}</dd>
            </div>
            <div>
              <dt className="label">Status</dt>
              <dd className="mt-1">{profile.availability}</dd>
            </div>
            <div>
              <dt className="label">Elsewhere</dt>
              <dd className="mt-1 flex flex-col gap-1">
                {profile.socials.map((social) => (
                  <ExternalLink key={social.href} href={social.href}>
                    {social.label}
                  </ExternalLink>
                ))}
              </dd>
            </div>
          </dl>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/resume.pdf" download>
              <DownloadIcon /> CV (PDF)
            </ButtonLink>
            <ButtonLink href="/resume" variant="secondary">
              Web résumé
            </ButtonLink>
          </div>
        </aside>
      </div>

      <div className="mt-24 space-y-24">
        <Block id="experience" label="01 · Experience" title="Where I've worked">
          <ol>
            {experience.map((item) => (
              <li key={item.id} className="reveal border-t border-line py-8 first:border-t-0 first:pt-0">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-lg font-semibold">
                    {item.role}
                    <span className="font-normal text-muted"> · {item.organization}</span>
                  </h3>
                  <p className="shrink-0 font-mono text-sm text-subtle">{item.periodLabel}</p>
                </div>
                {item.summary && <p className="mt-2 text-muted">{item.summary}</p>}
                <ul className="mt-4 space-y-2">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-[0.98rem]">
                      <span aria-hidden="true" className="mt-[0.6rem] size-1 shrink-0 bg-fg" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                {item.relatedProjects && item.relatedProjects.length > 0 && (
                  <p className="mt-4 text-sm text-muted">
                    Related:{" "}
                    {item.relatedProjects.map((slug, index) => {
                      const project = getProject(slug);
                      return project ? (
                        <span key={slug}>
                          {index > 0 && ", "}
                          <Link href={`/work/${slug}`} className="link text-fg">
                            {project.name}
                          </Link>
                        </span>
                      ) : null;
                    })}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Block>

        <Block id="skills" label="02 · Skills" title="What I work with">
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {skillGroups.map((group) => (
              <div key={group.name} className="border-t border-line pt-4">
                <dt className="font-semibold">{group.name}</dt>
                <dd className="mt-2 text-muted">{group.skills.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Block>

        <Block id="education" label="03 · Education" title="Education">
          {education.map((item) => (
            <div key={item.degree}>
              <h3 className="text-lg font-semibold">{item.degree}</h3>
              <p className="mt-1 text-muted">
                {item.institution}, {item.location} · Completed {formatDate(item.completed)}
                {item.standing ? ` · ${item.standing}` : ""}
              </p>
              <p className="label mt-6 mb-2">Relevant coursework</p>
              <p className="text-muted">{item.coursework.join(" · ")}</p>
            </div>
          ))}
        </Block>

        {verifiedRecognition.length > 0 && (
          <Block id="recognition" label="04 · Recognition" title="Recognition">
            <ul className="space-y-6">
              {verifiedRecognition.map((item) => (
                <li key={item.title}>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-muted">
                    {item.issuer}. {item.detail}
                  </p>
                  <p className="mt-3 flex flex-wrap gap-x-6 gap-y-1">
                    {item.links.map((link) => (
                      <ExternalLink key={link.href} href={link.href}>
                        {link.label}
                      </ExternalLink>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Block id="timeline" label="05 · Timeline" title="Milestones">
          <ol className="relative border-l border-line-strong">
            {milestones.map((item) => (
              <li key={`${item.date}-${item.title}`} className="reveal relative pb-8 pl-6 last:pb-0">
                <span aria-hidden="true" className="absolute top-2 -left-[4.5px] size-2 bg-fg" />
                <time dateTime={item.date} className="font-mono text-xs uppercase tracking-[0.08em] text-subtle">
                  {formatDate(item.date)}
                </time>
                <h3 className="mt-1 font-semibold">
                  {item.href ? (
                    <Link href={item.href} className="hover:underline hover:underline-offset-4">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                </h3>
                <p className="mt-1 text-muted">{item.detail}</p>
              </li>
            ))}
          </ol>
        </Block>
      </div>
    </Container>
  );
}
