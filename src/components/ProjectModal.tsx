"use client";

import { useEffect, useRef } from "react";
import { portfolioData, type Project } from "@/data/portfolio";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project | null;
}

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButton.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !project) return null;

  const sourceAvailable = project.link !== "#";

  // Helper to parse system notes markdown into readable structured elements
  const renderDetails = (details: string) => {
    const lines = details.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const flushList = (key: string) => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${key}`} className="my-3 space-y-2 font-mono">
            {currentList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-[var(--retro-fg)]/90 leading-relaxed">
                <span className="text-green-500 font-bold mt-0.5 select-none">▸</span>
                <span>
                  {item.split("**").map((part, pIdx) =>
                    pIdx % 2 === 1 ? (
                      <strong key={pIdx} className="text-green-500 font-bold">{part}</strong>
                    ) : (
                      part
                    )
                  )}
                </span>
              </li>
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("#")) {
        flushList(`${index}`);
        const text = trimmed.replace(/^#+\s?/, "");
        const isMainHeading = trimmed.startsWith("# ");
        elements.push(
          <div key={`head-${index}`} className={`my-4 border-b border-[var(--retro-border)] pb-2 ${isMainHeading ? "pt-2" : "pt-4"}`}>
            <span className="text-xs font-mono text-green-600 font-bold tracking-wider mr-2">
              $ CAT {text.toUpperCase().replace(/\s+/g, "_")}.LOG
            </span>
            <h3 className={`${isMainHeading ? "text-xl" : "text-lg"} font-mono font-bold text-[var(--retro-fg)] mt-1`}>
              {text}
            </h3>
          </div>
        );
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        currentList.push(trimmed.replace(/^[-*]\s?/, ""));
      } else {
        flushList(`${index}`);
        elements.push(
          <p key={`p-${index}`} className="my-2 text-sm font-mono text-[var(--retro-fg)]/90 leading-relaxed">
            {trimmed.split("**").map((part, pIdx) =>
              pIdx % 2 === 1 ? (
                <strong key={pIdx} className="text-green-500 font-bold">{part}</strong>
              ) : (
                part
              )
            )}
          </p>
        );
      }
    });

    flushList("end");
    return elements;
  };

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/75 p-3 backdrop-blur-md font-mono"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-dialog-title"
        className="terminal-scrollbar max-h-[88vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[var(--terminal-green)]/40 bg-[var(--retro-bg)] shadow-[0_0_50px_rgba(34,197,94,0.2)]"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Terminal Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[var(--retro-border)] bg-[var(--retro-card-bg)] px-5 py-3.5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="font-mono text-xs font-bold tracking-wider text-[var(--retro-fg)]">
              CASE_STUDY // {project.status.toUpperCase()}
            </p>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="rounded-md border border-[var(--retro-border)] px-3 py-1 text-xs font-mono text-[var(--retro-fg)] transition-colors hover:border-green-500 hover:text-green-500"
            aria-label="Close project details"
          >
            [X] CLOSE
          </button>
        </header>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-1">
                PROJECT CASE STUDY
              </span>
              <h2 id="project-dialog-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--retro-fg)]">
                {project.title}
              </h2>
            </div>
            <span className="rounded border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 uppercase tracking-wider">
              {project.status}
            </span>
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-4 text-xs text-[var(--retro-fg)]/80 border-y border-[var(--retro-border)] py-3 bg-[var(--retro-card-bg)]/50 px-4 rounded">
            <div>
              <span className="text-[var(--text-subtle)] font-bold">ROLE: </span>
              <span className="text-green-500 font-bold">{project.role}</span>
            </div>
            <div>
              <span className="text-[var(--text-subtle)] font-bold">SLUG: </span>
              <span className="text-[var(--terminal-cyan)] font-mono">{project.slug}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <span className="text-xs font-mono text-[var(--text-subtle)] font-bold block mb-2">$ cat overview.txt</span>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--retro-fg)]/90 font-mono">
              {project.description}
            </p>
          </div>

          {/* Detailed Specs Markdown */}
          {project.details && (
            <div className="my-8 border-t border-[var(--retro-border)] pt-6">
              {renderDetails(project.details)}
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="mt-8 border-t border-[var(--retro-border)] pt-6">
            <span className="text-xs font-mono text-[var(--text-subtle)] font-bold block mb-3">$ cat stack.json</span>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="rounded border border-[var(--terminal-green)]/40 bg-[var(--terminal-green)]/10 px-3 py-1.5 text-xs font-bold text-green-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--retro-border)] pt-6">
            {sourceAvailable && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-600"
              >
                <span>Open Source Code</span>
                <ExternalLinkIcon />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-green-500 px-5 py-2.5 text-sm font-bold text-green-600 transition-colors hover:bg-green-500 hover:text-white"
              >
                <span>View Live Demo</span>
                <ExternalLinkIcon />
              </a>
            )}
            {!sourceAvailable && (
              <a
                href={`mailto:${portfolioData.personal.email}?subject=${encodeURIComponent(`Case study request: ${project.title}`)}`}
                className="inline-flex items-center gap-2 rounded-md border border-[var(--retro-border)] bg-[var(--retro-card-bg)] px-5 py-2.5 text-sm font-bold text-[var(--retro-fg)] transition-colors hover:border-green-500 hover:text-green-600"
              >
                <span>Request Detailed Case Study</span>
              </a>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
