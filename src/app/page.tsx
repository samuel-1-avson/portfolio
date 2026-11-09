import Link from "next/link";
import AskButton from "@/components/assistant/AskButton";
import { ArrowRight, ButtonLink, Container, DownloadIcon, SectionHeading, buttonClasses } from "@/components/ui/primitives";
import { FeaturedProjectRow, ProjectRow } from "@/components/work/ProjectList";
import { education, featuredProjects, formatDate, milestones, profile, projectsByRecency, recognition } from "@/content";

export default function HomePage() {
  const moreWork = projectsByRecency.filter((project) => project.tier === "standard").slice(0, 5);
  const award = recognition.find((item) => item.verified);
  const degree = education[0];
  const recent = milestones.slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="border-b border-line">
        <Container className="pt-16 pb-20 sm:pt-24 sm:pb-28">
          <p className="label">
            {profile.name} <span aria-hidden="true">—</span> {profile.role}, {profile.location}
          </p>
          <h1 id="hero-title" className="mt-8 max-w-5xl text-display font-semibold">
            {profile.headline}
          </h1>
          <p className="mt-8 max-w-2xl text-lede text-muted">{profile.intro}</p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <ButtonLink href="/work">
              Selected work <ArrowRight />
            </ButtonLink>
            <ButtonLink href="/resume.pdf" variant="secondary" download>
              <DownloadIcon /> Download CV
            </ButtonLink>
            <AskButton className={buttonClasses("ghost")} prompt={undefined}>
              Ask the AI assistant
            </AskButton>
          </div>

          <ul className="mt-20 grid gap-px border-t border-line-strong sm:grid-cols-2 lg:grid-cols-4" aria-label="Specializations">
            {profile.specializations.map((item, index) => (
              <li key={item.title} className="pt-5 pr-6 pb-2">
                <p className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 font-semibold">{item.title}</h2>
                <p className="mt-2 text-[0.95rem] text-muted">{item.description}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Selected work */}
      <section aria-labelledby="work-title" className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="work-title"
            index="01"
            eyebrow="Selected work"
            title="Systems I've designed and built end to end."
            description="Each project links to a case study with the problem, architecture, engineering decisions and an honest status."
            action={
              <Link href="/work" className="group inline-flex min-h-11 items-center gap-2 font-medium">
                <span className="link">All projects</span> <ArrowRight />
              </Link>
            }
          />
          <ol className="mt-6">
            {featuredProjects.map((project, index) => (
              <FeaturedProjectRow key={project.slug} project={project} index={index} />
            ))}
          </ol>
        </Container>
      </section>

      {/* At a glance — for recruiters */}
      <section aria-labelledby="glance-title" className="inverted py-20 sm:py-28">
        <Container>
          <p className="label">02 · At a glance</p>
          <h2 id="glance-title" className="mt-4 max-w-3xl text-title font-semibold">
            The short version.
          </h2>
          <dl className="mt-12 grid gap-x-10 gap-y-8 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt className="label">Focus</dt>
              <dd className="mt-2">Payments and blockchain infrastructure, backend systems, security tooling and applied AI.</dd>
            </div>
            <div>
              <dt className="label">Core stack</dt>
              <dd className="mt-2">Rust, Go, TypeScript, Python · PostgreSQL, Redis · Next.js · Solana, EVM, Tron · Google Cloud, Terraform.</dd>
            </div>
            <div>
              <dt className="label">Strongest evidence</dt>
              <dd className="mt-2">
                <Link href="/work/bitmomo" className="link">BitMomo</Link>, <Link href="/work/proxyhubb" className="link">ProxyHubb</Link>,{" "}
                <Link href="/work/ciphervault" className="link">CipherVault</Link> and <Link href="/work/creg" className="link">CREG</Link>.
              </dd>
            </div>
            <div>
              <dt className="label">Education</dt>
              <dd className="mt-2">
                {degree.degree}, {degree.institution} ({formatDate(degree.completed)}){degree.standing ? ` · ${degree.standing}` : ""}.
              </dd>
            </div>
            {award && (
              <div>
                <dt className="label">Recognition</dt>
                <dd className="mt-2">{award.title.replace("Winner — ", "Winner, ")} ({award.issuer}).</dd>
              </div>
            )}
            <div>
              <dt className="label">Availability</dt>
              <dd className="mt-2">{profile.availability}. Remote-friendly from {profile.location}.</dd>
            </div>
          </dl>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/resume">Read the résumé</ButtonLink>
            <ButtonLink href={`mailto:${profile.email}`} variant="secondary">
              Email Samuel
            </ButtonLink>
            <AskButton className={buttonClasses("ghost")} prompt="Which projects best show his backend and system architecture skills?">
              Ask: best backend work? <ArrowRight />
            </AskButton>
          </div>
        </Container>
      </section>

      {/* More work */}
      <section aria-labelledby="more-title" className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            id="more-title"
            index="03"
            eyebrow="More work"
            title="AI tools, platforms and experiments."
            action={
              <Link href="/work" className="group inline-flex min-h-11 items-center gap-2 font-medium">
                <span className="link">Browse and filter</span> <ArrowRight />
              </Link>
            }
          />
          <ul className="mt-6 border-b border-line">
            {moreWork.map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
          </ul>
        </Container>
      </section>

      {/* Recent milestones */}
      <section aria-labelledby="timeline-title" className="pb-24 sm:pb-32">
        <Container>
          <SectionHeading
            id="timeline-title"
            index="04"
            eyebrow="Recently"
            title="What changed lately."
            action={
              <Link href="/about#timeline" className="group inline-flex min-h-11 items-center gap-2 font-medium">
                <span className="link">Full timeline</span> <ArrowRight />
              </Link>
            }
          />
          <ol className="mt-6">
            {recent.map((item) => (
              <li key={`${item.date}-${item.title}`} className="reveal grid gap-1 border-t border-line py-5 first:border-t-0 sm:grid-cols-12 sm:gap-6">
                <time dateTime={item.date} className="font-mono text-sm text-subtle sm:col-span-2">
                  {formatDate(item.date)}
                </time>
                <div className="sm:col-span-10">
                  {item.href ? (
                    <Link href={item.href} className="font-semibold hover:underline hover:underline-offset-4">
                      {item.title}
                    </Link>
                  ) : (
                    <p className="font-semibold">{item.title}</p>
                  )}
                  <p className="mt-1 text-muted">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}
