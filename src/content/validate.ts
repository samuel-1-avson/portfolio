import { education, experience, milestones, profile, recognition, skillGroups } from "./profile.ts";
import { categoryLabels, projects } from "./projects.ts";

const ISO_MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const ISO_DAY = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Strings that must never appear in public content (internal infrastructure of private repos).
const FORBIDDEN_PATTERNS = [/gen-lang-client-\d+/i, /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/, /\.dev\.bitmomo\.app/i, /cryptopos-dev/i];

/**
 * Structural checks for the portfolio content. Returns a list of problems;
 * an empty list means the content is valid. Run by `npm test`.
 */
export function validateContent(): string[] {
  const errors: string[] = [];
  const slugs = new Set<string>();

  for (const project of projects) {
    const where = `project ${project.slug}`;
    if (!SLUG.test(project.slug)) errors.push(`${where}: slug must be kebab-case`);
    if (slugs.has(project.slug)) errors.push(`${where}: duplicate slug`);
    slugs.add(project.slug);
    if (!project.name.trim() || !project.tagline.trim() || !project.summary.trim()) errors.push(`${where}: name, tagline and summary are required`);
    if (project.tagline.length > 140) errors.push(`${where}: tagline should be 140 characters or fewer`);
    if (project.categories.length === 0) errors.push(`${where}: at least one category`);
    for (const category of project.categories) if (!(category in categoryLabels)) errors.push(`${where}: unknown category ${category}`);
    if (!ISO_MONTH.test(project.started)) errors.push(`${where}: started must be YYYY-MM`);
    if (project.ended && !ISO_MONTH.test(project.ended)) errors.push(`${where}: ended must be YYYY-MM`);
    if (project.ended && project.ended < project.started) errors.push(`${where}: ended before started`);
    if (!ISO_DAY.test(project.lastActivity)) errors.push(`${where}: lastActivity must be YYYY-MM-DD`);
    if (project.stack.length === 0) errors.push(`${where}: stack is required`);
    if (project.tier === "featured" && !project.caseStudy) errors.push(`${where}: featured projects need a case study`);
    if (project.tier === "archive" && project.status !== "archived") errors.push(`${where}: archive tier must have archived status`);
    for (const link of project.links) {
      if (!link.href.startsWith("https://")) errors.push(`${where}: link ${link.label} must use https`);
    }
    const source = project.links.find((link) => link.kind === "source");
    if (project.repository?.visibility === "private" && source) errors.push(`${where}: private repositories must not expose a source link`);
    if (project.repository?.visibility === "public" && !source) errors.push(`${where}: public repository is missing its source link`);
    const study = project.caseStudy;
    if (study) {
      if (study.architecture.layers.length < 2) errors.push(`${where}: case study needs at least two architecture layers`);
      if (study.architecture.flow.length < 3) errors.push(`${where}: case study flow needs at least three steps`);
      if (study.decisions.length === 0 || study.challenges.length === 0) errors.push(`${where}: case study needs decisions and challenges`);
    }
  }

  for (const item of experience) {
    if (!ISO_MONTH.test(item.start)) errors.push(`experience ${item.id}: start must be YYYY-MM`);
    if (item.end && !ISO_MONTH.test(item.end)) errors.push(`experience ${item.id}: end must be YYYY-MM`);
    for (const slug of item.relatedProjects ?? []) if (!slugs.has(slug)) errors.push(`experience ${item.id}: unknown project ${slug}`);
  }
  for (const item of education) if (!ISO_MONTH.test(item.completed)) errors.push(`education ${item.degree}: completed must be YYYY-MM`);
  for (const item of milestones) {
    if (!ISO_MONTH.test(item.date)) errors.push(`milestone ${item.title}: date must be YYYY-MM`);
    if (item.href?.startsWith("/work/") && !slugs.has(item.href.slice(6))) errors.push(`milestone ${item.title}: unknown project link`);
  }
  for (const item of recognition) {
    if (item.verified && item.links.length === 0) errors.push(`recognition ${item.title}: verified items need an evidence link`);
  }
  if (skillGroups.some((group) => group.skills.length === 0)) errors.push("skills: empty group");
  if (!profile.email.includes("@")) errors.push("profile: email is invalid");

  const serialized = JSON.stringify({ projects, experience, milestones, profile });
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(serialized)) errors.push(`content contains a forbidden internal identifier matching ${pattern}`);
  }

  return errors;
}
