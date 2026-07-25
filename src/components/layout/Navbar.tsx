"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import XPBar from "@/components/gamification/XPBar";
import CommandPaletteModal from "@/components/terminal/CommandPaletteModal";
import ResumeModal from "@/components/ResumeModal";

const navLinks = [
  { name: "About", path: "#about" },
  { name: "Experience", path: "#experience" },
  { name: "Projects", path: "#projects" },
  { name: "Connect", path: "#connect" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);

  useEffect(() => {
    const sections = ["hero", ...navLinks.map(({ path }) => path.slice(1))]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { rootMargin: "-25% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      observer.disconnect();
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
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
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--retro-border)] bg-[color:color-mix(in_srgb,var(--retro-bg)_92%,transparent)] backdrop-blur-md">
        <div className="container mx-auto flex min-h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link href="#hero" onClick={(event) => navigate(event, "#hero")} className="font-mono text-sm font-bold tracking-tight text-[var(--retro-fg)] focus-visible:outline-none">
              samuel<span className="text-[var(--terminal-green)]">_</span>
            </Link>
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="hidden sm:flex items-center gap-1.5 rounded border border-[var(--retro-border)] bg-[var(--retro-card-bg)] px-2.5 py-1 font-mono text-[11px] text-[var(--text-subtle)] hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)] transition-colors"
            >
              <span>[CMD]</span>
              <kbd className="rounded bg-[var(--retro-hover)] px-1 py-0.5 text-[9px]">Ctrl K</kbd>
            </button>
          </div>

          <nav aria-label="Primary navigation" className="hidden items-center gap-3 md:flex">
            {navLinks.map((link) => (
              <a key={link.path} href={link.path} onClick={(event) => navigate(event, link.path)} aria-current={activeSection === link.path.slice(1) ? "page" : undefined} className="rounded-md px-3 py-2 font-mono text-xs text-[var(--text-muted)] transition hover:bg-[var(--retro-hover)] hover:text-[var(--retro-fg)]">
                {link.name}
              </a>
            ))}
            <div className="h-4 w-px bg-[var(--retro-border)] mx-1" />
            <XPBar compact showLevel={false} />
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="rounded border border-[var(--retro-border)] bg-[var(--retro-card-bg)] px-2 py-1 font-mono text-[11px] text-[var(--terminal-green)]"
            >
              [CMD]
            </button>
            <ThemeToggle />
            <button type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label="Toggle navigation" onClick={() => setMenuOpen((open) => !open)} className="grid size-10 place-items-center rounded-md border border-[var(--retro-border)] font-mono text-lg">
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[var(--retro-border)] bg-[var(--retro-bg)] p-3 md:hidden">
            <div className="container mx-auto grid max-w-6xl gap-2 px-2">
              <XPBar compact className="py-2" />
              {navLinks.map((link) => (
                <a key={link.path} href={link.path} onClick={(event) => navigate(event, link.path)} className="rounded-md px-4 py-3 font-mono text-sm text-[var(--retro-fg)] hover:bg-[var(--retro-hover)]">
                  {link.name}
                </a>
              ))}
            </div>
          </nav>
        )}
      </header>

      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenResume={() => setResumeOpen(true)}
      />

      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
    </>
  );
}

