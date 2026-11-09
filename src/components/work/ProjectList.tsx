import Link from "next/link";
import { categoryLabels, formatDate, getLastActivity, statusLabels, type Project } from "@/content";
import { ArrowRight, StatusLabel, TagList } from "@/components/ui/primitives";

/** Large editorial row used for featured work. */
export function FeaturedProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <li className="reveal border-t border-line first:border-t-0">
      <Link href={`/work/${project.slug}`} className="group grid gap-6 py-10 md:grid-cols-12 md:gap-8">
        <span className="font-mono text-sm text-subtle md:col-span-1">{String(index + 1).padStart(2, "0")}</span>
        <div className="md:col-span-7">
          <h3 className="text-[clamp(1.6rem,1.2rem+1.6vw,2.4rem)] font-semibold leading-tight tracking-[-0.025em]">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 ease-[var(--ease-out-expo)] group-hover:bg-[length:100%_2px]">
              {project.name}
            </span>
          </h3>
          <p className="mt-3 max-w-2xl text-lg text-muted">{project.tagline}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-[0.95rem] font-medium">
            Read the case study <ArrowRight />
          </span>
        </div>
        <div className="space-y-4 md:col-span-4">
          <StatusLabel status={project.status} label={statusLabels[project.status]} note={project.statusNote} />
          <p className="text-sm text-muted">{project.statusNote}</p>
          <p className="label">{project.categories.map((category) => categoryLabels[category]).join(" · ")}</p>
          <TagList items={project.stack} max={5} label={`${project.name} technologies`} />
        </div>
      </Link>
    </li>
  );
}

/** Compact row used in lists of standard and archived work. */
export function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="border-t border-line">
      <Link href={`/work/${project.slug}`} className="group grid gap-2 py-5 sm:grid-cols-12 sm:items-baseline sm:gap-6">
        <div className="sm:col-span-5">
          <h3 className="font-semibold">
            <span className="group-hover:underline group-hover:underline-offset-4">{project.name}</span>
          </h3>
          <p className="mt-1 text-[0.95rem] text-muted">{project.tagline}</p>
        </div>
        <p className="label sm:col-span-3">{project.categories.slice(0, 2).map((category) => categoryLabels[category]).join(" · ")}</p>
        <div className="flex items-center justify-between gap-4 sm:col-span-4">
          <StatusLabel status={project.status} label={statusLabels[project.status]} note={project.statusNote} />
          <span className="flex items-center gap-2 font-mono text-xs text-subtle">
            {formatDate(getLastActivity(project).slice(0, 7))}
            <ArrowRight className="text-fg" />
          </span>
        </div>
      </Link>
    </li>
  );
}
