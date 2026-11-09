import type { Metadata } from "next";
import PrintButton from "@/components/resume/PrintButton";
import { ButtonLink, Container, DownloadIcon, buttonClasses } from "@/components/ui/primitives";
import { education, experience, formatDate, getProject, profile, recognition, SITE_URL, skillGroups, statusLabels } from "@/content";
import { RESUME_REVISED, resumeProjects, resumeSummary } from "@/content/resume";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Résumé of Samuel Maxwell Obeng Avornyoh — software and AI engineer: experience, selected projects, skills and education.",
  alternates: { canonical: "/resume" },
};

function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="break-after-avoid border-b border-line-strong pb-1.5 font-mono text-[0.78rem] font-semibold uppercase tracking-[0.1em] print:pb-1 print:text-[8pt]">{children}</h2>;
}

export default function ResumePage() {
  const site = SITE_URL.replace(/^https?:\/\//, "");
  const github = profile.socials.find((social) => social.label === "GitHub");
  const linkedIn = profile.socials.find((social) => social.label === "LinkedIn");

  return (
    <Container className="pt-10 pb-24 sm:pt-14 print:p-0">
      <div className="no-print mb-10 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted">The same résumé as a PDF, generated from this page.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/resume.pdf" download>
            <DownloadIcon /> Download PDF
          </ButtonLink>
          <PrintButton className={buttonClasses("secondary")} />
        </div>
      </div>

      <article className="mx-auto max-w-[52rem] text-[0.97rem] leading-relaxed print:max-w-none print:text-[9pt] print:leading-[1.38]" aria-label="Résumé">
        <header>
          <h1 className="text-[2.1rem] font-semibold leading-tight tracking-[-0.02em] print:text-[19pt]">{profile.name}</h1>
          <p className="mt-1 text-lg print:text-[11pt]">{profile.role}</p>
          <p className="mt-3 text-[0.9rem] text-muted print:mt-1.5 print:text-[8.5pt]">
            {profile.location} · {profile.phone} · <a href={`mailto:${profile.email}`}>{profile.email}</a>
            {linkedIn && (
              <>
                {" "}
                · <a href={linkedIn.href}>linkedin.com/in/samuel-maxwell-obeng-avornyoh</a>
              </>
            )}
            {github && (
              <>
                {" "}
                · <a href={github.href}>github.com/samuel-1-avson</a>
              </>
            )}{" "}
            · <a href={SITE_URL}>{site}</a>
          </p>
        </header>

        <section className="mt-7 print:mt-4" aria-labelledby="r-summary">
          <Heading>
            <span id="r-summary">Summary</span>
          </Heading>
          <ul className="mt-3 space-y-1.5 print:mt-2 print:space-y-0.5">
            {resumeSummary.map((line) => (
              <li key={line} className="flex gap-2.5">
                <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 bg-fg" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7 print:mt-4" aria-labelledby="r-experience">
          <Heading>
            <span id="r-experience">Experience</span>
          </Heading>
          <ol className="mt-3 space-y-5 print:mt-2 print:space-y-2.5">
            {experience.map((item) => (
              <li key={item.id} className="break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 print:flex-row print:items-baseline print:justify-between">
                  <h3 className="font-semibold">
                    {item.role} <span className="font-normal">| {item.organization}</span>
                  </h3>
                  <p className="shrink-0 font-mono text-[0.82rem] print:text-[8pt]">{item.periodLabel}</p>
                </div>
                <ul className="mt-1.5 space-y-1 print:mt-0.5 print:space-y-0">
                  {item.highlights.slice(0, 4).map((highlight) => (
                    <li key={highlight} className="flex gap-2.5">
                      <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 bg-fg" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-7 print:mt-4" aria-labelledby="r-projects">
          <Heading>
            <span id="r-projects">Selected projects</span>
          </Heading>
          <ol className="mt-3 space-y-4 print:mt-2 print:space-y-2">
            {resumeProjects.map(({ slug, bullets }) => {
              const project = getProject(slug);
              if (!project) return null;
              const link = project.links.find((item) => item.kind === "live") ?? project.links.find((item) => item.kind === "source");
              return (
                <li key={slug} className="break-inside-avoid">
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between sm:gap-4 print:flex-row print:items-baseline print:justify-between">
                    <h3 className="font-semibold">
                      {project.name}{" "}
                      <span className="font-normal">
                        — {statusLabels[project.status]}
                        {link ? (
                          <>
                            {" "}
                            · <a href={link.href}>{link.href.replace(/^https:\/\/(www\.)?/, "")}</a>
                          </>
                        ) : null}
                      </span>
                    </h3>
                    <p className="shrink-0 font-mono text-[0.82rem] print:text-[8pt]">
                      {formatDate(project.started)}
                      {project.ended ? ` – ${formatDate(project.ended)}` : " – Present"}
                    </p>
                  </div>
                  <ul className="mt-1 space-y-1 print:mt-0.5 print:space-y-0">
                    {bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-2.5">
                        <span aria-hidden="true" className="mt-[0.6em] size-1 shrink-0 bg-fg" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1 text-[0.85rem] text-muted print:hidden">{project.stack.slice(0, 8).join(" · ")}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-3 text-[0.85rem] text-muted print:mt-2 print:text-[8pt]">More — Agentic QA Platform, Generator Sound Health Monitor, healthcare no-show prediction and others — at {site}/work.</p>
        </section>

        <section className="mt-7 break-inside-avoid print:mt-4" aria-labelledby="r-skills">
          <Heading>
            <span id="r-skills">Skills</span>
          </Heading>
          <dl className="mt-3 space-y-1 print:mt-2 print:space-y-0">
            {skillGroups.map((group) => (
              <div key={group.name} className="sm:flex sm:gap-2">
                <dt className="shrink-0 font-semibold">{group.name}:</dt>
                <dd>{group.skills.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-7 break-inside-avoid print:mt-4" aria-labelledby="r-education">
          <Heading>
            <span id="r-education">Education</span>
          </Heading>
          {education.map((item) => (
            <div key={item.degree} className="mt-3 print:mt-2">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between print:flex-row print:justify-between">
                <h3 className="font-semibold">
                  {item.degree} <span className="font-normal">| {item.institution}, {item.location}</span>
                </h3>
                <p className="font-mono text-[0.82rem] print:text-[8pt]">{formatDate(item.completed)}</p>
              </div>
              <p className="mt-1">
                {item.standing ? `${item.standing}. ` : ""}Coursework: {item.coursework.join(", ")}.
              </p>
            </div>
          ))}
        </section>

        <section className="mt-7 break-inside-avoid print:mt-4" aria-labelledby="r-recognition">
          <Heading>
            <span id="r-recognition">Recognition</span>
          </Heading>
          <ul className="mt-3 space-y-1 print:mt-2">
            {recognition
              .filter((item) => item.verified)
              .map((item) => (
                <li key={item.title}>
                  <span className="font-semibold">{item.title}</span> — {item.issuer}. {item.detail}
                </li>
              ))}
          </ul>
        </section>

        <p className="mt-8 font-mono text-[0.75rem] text-subtle print:mt-4 print:text-[7pt]">
          Languages: {profile.languages.join(", ")} · Revised {formatDate(RESUME_REVISED)}
        </p>
      </article>
    </Container>
  );
}
