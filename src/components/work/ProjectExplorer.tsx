"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/content/types";
import { ProjectRow } from "./ProjectList";

type Props = {
  projects: Project[];
  categories: { id: ProjectCategory; label: string; count: number }[];
};

function matches(project: Project, query: string) {
  if (!query) return true;
  const haystack = [project.name, project.tagline, project.summary, project.stack.join(" "), project.categories.join(" ")].join(" ").toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

/** Compact category filter and search over all projects. The server renders the full list first. */
export default function ProjectExplorer({ projects, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const fromUrl = params.get("category");
  const active = categories.some((category) => category.id === fromUrl) ? (fromUrl as ProjectCategory) : null;
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim());
  const [showArchive, setShowArchive] = useState(false);

  const filtered = useMemo(
    () => projects.filter((project) => (!active || project.categories.includes(active)) && matches(project, deferredQuery)),
    [projects, active, deferredQuery],
  );
  const current = filtered.filter((project) => project.tier !== "archive");
  const archived = filtered.filter((project) => project.tier === "archive");
  const filtering = Boolean(active || deferredQuery);

  const select = (category: ProjectCategory | null) => {
    const next = new URLSearchParams(params.toString());
    if (category) next.set("category", category);
    else next.delete("category");
    const search = next.toString();
    router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by category" className="-mx-1 flex flex-wrap gap-1">
          <button
            type="button"
            onClick={() => select(null)}
            aria-pressed={!active}
            className="min-h-9 border border-transparent px-3 font-mono text-[0.78rem] uppercase tracking-[0.06em] text-muted hover:text-fg aria-pressed:border-line-strong aria-pressed:text-fg"
          >
            All <span className="text-subtle">{projects.length}</span>
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => select(active === category.id ? null : category.id)}
              aria-pressed={active === category.id}
              className="min-h-9 border border-transparent px-3 font-mono text-[0.78rem] uppercase tracking-[0.06em] text-muted hover:text-fg aria-pressed:border-line-strong aria-pressed:text-fg"
            >
              {category.label} <span className="text-subtle">{category.count}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <label htmlFor="project-search" className="sr-only">
            Search projects
          </label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or technology"
            className="min-h-11 w-full border border-line bg-transparent px-3 text-[0.95rem] placeholder:text-subtle focus:border-line-strong focus:outline-none"
          />
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "project" : "projects"} shown
      </p>

      {current.length > 0 ? (
        <ul className="border-b border-line">
          {current.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </ul>
      ) : (
        !archived.length && (
          <p className="py-16 text-center text-muted">
            No projects match.{" "}
            <button type="button" className="underline underline-offset-4" onClick={() => { setQuery(""); select(null); }}>
              Clear filters
            </button>
          </p>
        )
      )}

      {archived.length > 0 && (
        <div className="mt-14">
          <div className="flex items-center justify-between gap-4">
            <h2 className="label">Earlier & archived work ({archived.length})</h2>
            {!filtering && (
              <button type="button" onClick={() => setShowArchive((open) => !open)} aria-expanded={showArchive} aria-controls="archive-list" className="min-h-10 text-sm underline underline-offset-4">
                {showArchive ? "Hide" : "Show"}
              </button>
            )}
          </div>
          {(showArchive || filtering) && (
            <ul id="archive-list" className="mt-4 border-b border-line">
              {archived.map((project) => (
                <ProjectRow key={project.slug} project={project} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
