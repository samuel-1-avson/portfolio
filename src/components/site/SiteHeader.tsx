"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAssistant } from "@/components/assistant/AssistantProvider";
import ThemeToggle from "./ThemeToggle";
import { primaryNav } from "./nav";

function isActive(pathname: string, href: string) {
  if (href.startsWith("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SiteHeader() {
  const pathname = usePathname();
  const assistant = useAssistant();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPath, setMenuPath] = useState(pathname);
  const menuButton = useRef<HTMLButtonElement>(null);
  const firstLink = useRef<HTMLAnchorElement>(null);

  // Close the mobile menu after navigation (state derived from the path, no effect needed).
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    firstLink.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line bg-[var(--header-bg)] backdrop-blur-md supports-[not(backdrop-filter:blur(1px))]:bg-bg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-baseline gap-2 font-semibold tracking-tight" aria-label="Samuel Avornyoh — home">
          <span className="text-[1.05rem]">Samuel Avornyoh</span>
          <span className="hidden font-mono text-[0.7rem] font-normal uppercase tracking-[0.08em] text-subtle sm:inline">Software &amp; AI</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {primaryNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className="relative inline-flex min-h-11 items-center px-3 text-[0.95rem] text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-2 h-px origin-left bg-fg transition-transform duration-300 ${active ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => assistant.open()}
            className="inline-flex min-h-10 items-center gap-2 border border-line-strong px-3 text-[0.9rem] font-medium transition-colors hover:bg-fg hover:text-bg"
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K"
            title="Ask the portfolio assistant (Ctrl/⌘ K)"
          >
            <span aria-hidden="true" className="inline-block size-1.5 bg-current" />
            Ask AI
          </button>
          <ThemeToggle />
          <button
            ref={menuButton}
            type="button"
            className="inline-flex size-11 items-center justify-center md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              {menuOpen ? <path d="M5 5l10 10M15 5 5 15" /> : <path d="M3 7h14M3 13h14" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Primary" className="fade-in border-t border-line bg-bg md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {primaryNav.map((item, index) => (
              <li key={item.href} className="border-b border-line last:border-b-0">
                <Link
                  ref={index === 0 ? firstLink : undefined}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="flex min-h-12 items-center justify-between text-lg aria-[current=page]:font-semibold"
                >
                  {item.label}
                  <span aria-hidden="true" className="font-mono text-xs text-subtle">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
