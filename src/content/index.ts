import { githubSnapshot } from "./generated/github.ts";
import { categoryLabels, projects, statusLabels } from "./projects.ts";
import type { Project, ProjectCategory } from "./types.ts";

export { education, experience, milestones, profile, recognition, skillGroups, SITE_URL } from "./profile.ts";
export { categoryLabels, projects, statusLabels } from "./projects.ts";
export type * from "./types.ts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-02" → "Feb 2026"; "2026-02-14" → "14 Feb 2026". */
export function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  const label = `${MONTHS[Number(month) - 1]} ${year}`;
  return day ? `${Number(day)} ${label}` : label;
}

export function formatPeriod(start: string, end?: string) {
  if (end && end === start) return formatDate(start);
  return `${formatDate(start)} – ${end ? formatDate(end) : "Present"}`;
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export const featuredProjects = projects.filter((project) => project.tier === "featured");
export const caseStudyProjects = projects.filter((project) => project.caseStudy);

/** Latest activity from the content file or the public GitHub snapshot, whichever is newer. */
export function getLastActivity(project: Project) {
  const repo = project.repository;
  const snapshot = repo && repo.visibility === "public" ? githubSnapshot.repos[`${repo.owner}/${repo.name}`] : undefined;
  const fromSnapshot = snapshot?.pushedAt.slice(0, 10);
  return fromSnapshot && fromSnapshot > project.lastActivity ? fromSnapshot : project.lastActivity;
}

export function getRepoSnapshot(project: Project) {
  const repo = project.repository;
  if (!repo || repo.visibility !== "public") return undefined;
  return githubSnapshot.repos[`${repo.owner}/${repo.name}`];
}

export function getSourceLink(project: Project) {
  return project.links.find((link) => link.kind === "source");
}

export function getPrimaryLink(project: Project) {
  return project.links.find((link) => link.kind === "live") ?? project.links.find((link) => link.kind === "demo") ?? getSourceLink(project);
}

/** Categories that are actually used, in a stable display order, with counts. */
export function getCategoryCounts() {
  const order = Object.keys(categoryLabels) as ProjectCategory[];
  return order
    .map((id) => ({ id, label: categoryLabels[id], count: projects.filter((project) => project.categories.includes(id)).length }))
    .filter((item) => item.count > 0);
}

export function describeStatus(project: Project) {
  return `${statusLabels[project.status]} — ${project.statusNote}`;
}

export const projectsByRecency = [...projects].sort((left, right) => getLastActivity(right).localeCompare(getLastActivity(left)));

export const githubSnapshotDate = githubSnapshot.generatedAt;
