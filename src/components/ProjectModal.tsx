"use client";

import { useEffect, useRef } from "react";
import { portfolioData, type Project } from "@/data/portfolio";

interface ProjectModalProps { isOpen: boolean; onClose: () => void; project: Project | null; }

export default function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const handleKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey); document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButton.current?.focus(), 0);
    return () => { document.removeEventListener("keydown", handleKey); document.body.style.overflow = ""; previous?.focus(); };
  }, [isOpen, onClose]);
  if (!isOpen || !project) return null;
  const sourceAvailable = project.link !== "#";
  return <div className="fixed inset-0 z-[60] grid place-items-end bg-black/60 p-0 backdrop-blur-sm sm:place-items-center sm:p-4" role="presentation" onMouseDown={onClose}>
    <section role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-t-xl bg-[var(--retro-bg)] shadow-2xl sm:rounded-xl" onMouseDown={(event) => event.stopPropagation()}>
      <header className="sticky top-0 flex items-center justify-between border-b border-[var(--retro-border)] bg-[var(--retro-bg)] px-5 py-4"><p className="font-mono text-xs font-bold tracking-wider text-[var(--terminal-green)]">CASE STUDY / {project.status.toUpperCase()}</p><button ref={closeButton} type="button" onClick={onClose} className="rounded-md px-3 py-2 text-sm hover:bg-[var(--retro-hover)]" aria-label="Close project details">Close ×</button></header>
      <div className="p-5 sm:p-8"><h2 id="project-dialog-title" className="text-3xl font-bold tracking-tight text-[var(--retro-fg)]">{project.title}</h2><p className="mt-3 text-sm font-medium text-[var(--terminal-green)]">Role: {project.role}</p><p className="mt-5 text-base leading-7 text-[var(--text-muted)]">{project.description}</p>
        {project.details && <div className="mt-8 border-t border-[var(--retro-border)] pt-6"><p className="font-mono text-xs font-bold text-[var(--text-subtle)]">SELECTED SYSTEM NOTES</p><div className="mt-3 space-y-2 text-sm leading-6 text-[var(--text-muted)]">{project.details.split("\n").filter(Boolean).slice(0, 12).map((line) => <p key={line}>{line.replace(/^#+\s?|^\*\*|\*\*$/g, "")}</p>)}</div></div>}
        <div className="mt-8 flex flex-wrap gap-2">{project.tech.map((tech) => <span key={tech} className="rounded-full border border-[var(--retro-border)] px-3 py-1 text-xs text-[var(--text-muted)]">{tech}</span>)}</div>
        <div className="mt-8 flex flex-wrap gap-3 border-t border-[var(--retro-border)] pt-6">{sourceAvailable && <a href={project.link} target="_blank" rel="noopener noreferrer" className="rounded-md bg-[var(--retro-fg)] px-4 py-2 text-sm font-semibold text-[var(--retro-bg)]">Open source <span aria-hidden="true">↗</span></a>}{project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer" className="rounded-md border border-[var(--retro-border)] px-4 py-2 text-sm font-semibold text-[var(--retro-fg)]">View live demo <span aria-hidden="true">↗</span></a>}{!sourceAvailable && <a href={`mailto:${portfolioData.personal.email}?subject=${encodeURIComponent(`Case study request: ${project.title}`)}`} className="rounded-md border border-[var(--retro-border)] px-4 py-2 text-sm font-semibold text-[var(--retro-fg)]">Request case study</a>}</div>
      </div>
    </section>
  </div>;
}
