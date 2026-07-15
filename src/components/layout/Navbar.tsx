"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { name: "About", path: "#about" },
  { name: "Experience", path: "#experience" },
  { name: "Projects", path: "#projects" },
  { name: "Connect", path: "#connect" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", ...navLinks.map(({ path }) => path.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    event.preventDefault();
    const target = document.querySelector(path);
    if (target instanceof HTMLElement) {
      history.pushState(null, "", path);
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--retro-border)] bg-[color:color-mix(in_srgb,var(--retro-bg)_92%,transparent)] backdrop-blur-md">
      <div className="container mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="#hero" onClick={(event) => navigate(event, "#hero")} className="font-mono text-sm font-bold tracking-tight text-[var(--retro-fg)] focus-visible:outline-none">
          samuel<span className="text-[var(--terminal-green)]">_</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a key={link.path} href={link.path} onClick={(event) => navigate(event, link.path)} aria-current={activeSection === link.path.slice(1) ? "page" : undefined} className="rounded-md px-3 py-2 font-mono text-xs text-[var(--text-muted)] transition hover:bg-[var(--retro-hover)] hover:text-[var(--retro-fg)]">
              {link.name}
            </a>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-md border border-[var(--retro-border)] font-mono text-lg">
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[var(--retro-border)] bg-[var(--retro-bg)] p-3 md:hidden">
          <div className="container mx-auto grid max-w-6xl gap-1 px-2">
            {navLinks.map((link) => (
              <a key={link.path} href={link.path} onClick={(event) => navigate(event, link.path)} className="rounded-md px-4 py-3 font-mono text-sm text-[var(--retro-fg)] hover:bg-[var(--retro-hover)]">
                {link.name}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
