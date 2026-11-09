import Link from "next/link";
import { profile } from "@/content";
import { ArrowUpRight, Container } from "@/components/ui/primitives";
import { primaryNav } from "./nav";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="inverted no-print scroll-mt-16" aria-labelledby="contact-heading">
      <Container className="py-20 sm:py-28">
        <p className="label">Contact</p>
        <h2 id="contact-heading" className="mt-5 max-w-4xl text-title font-semibold">
          Building something where correctness matters? Let&apos;s talk.
        </h2>
        <p className="mt-5 max-w-2xl text-muted">{profile.availability}. Based in {profile.location}; working remotely across time zones.</p>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex min-h-12 items-center gap-3 bg-fg px-6 text-base font-medium text-bg transition-opacity hover:opacity-85"
          >
            {profile.email}
            <ArrowUpRight />
          </a>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {profile.socials.map((social) => (
              <li key={social.href}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-11 items-center gap-1.5">
                  <span className="link">{social.label}</span>
                  <ArrowUpRight />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
            <li>
              <a href="/resume.pdf" className="group inline-flex min-h-11 items-center gap-1.5" download>
                <span className="link">Résumé (PDF)</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-line pt-8 text-sm text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {primaryNav
                .filter((item) => !item.href.startsWith("#"))
                .map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-fg">
                      {item.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
