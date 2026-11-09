// Builds the assistant's knowledge base from the same typed content the site
// renders. Nothing else is indexed: no private repository content, no
// unverified recognition, no phone number.
import { education, experience, milestones, profile, recognition, skillGroups } from "../../content/profile.ts";
import { categoryLabels, projects, statusLabels } from "../../content/projects.ts";
import type { Project } from "../../content/types.ts";

export type EvidenceKind = "profile" | "project" | "experience" | "education" | "skills" | "recognition" | "timeline";

export type KnowledgeDocument = {
  id: string;
  sourceId: string;
  title: string;
  kind: EvidenceKind;
  text: string;
  /** On-site destination for this source (e.g. /work/bitmomo). */
  href?: string;
  projectSlug?: string;
};

function formatMonth(value: string) {
  const [year, month] = value.split("-");
  return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][Number(month) - 1]} ${year}`;
}

function projectPeriod(project: Project) {
  return project.ended ? `${formatMonth(project.started)} – ${formatMonth(project.ended)}` : `since ${formatMonth(project.started)}`;
}

function publicLinks(project: Project) {
  return project.links.map((link) => `${link.label}: ${link.href}`).join("; ");
}

function projectDocuments(project: Project): KnowledgeDocument[] {
  const sourceId = `project:${project.slug}`;
  const href = `/work/${project.slug}`;
  const base = { sourceId, title: project.name, kind: "project" as const, href, projectSlug: project.slug };
  const categories = project.categories.map((category) => categoryLabels[category]).join(", ");
  const repoNote = project.repository?.visibility === "private" ? " The source repository is private." : "";
  const documents: KnowledgeDocument[] = [
    {
      ...base,
      id: `${sourceId}:overview`,
      text:
        `${project.name} (${projectPeriod(project)}; last activity ${project.lastActivity}). ${project.tagline} ${project.summary} ` +
        `Categories: ${categories}. Status: ${statusLabels[project.status]} — ${project.statusNote}. Samuel's role: ${project.role}.` +
        `${project.contribution ? ` Contribution: ${project.contribution}.` : ""} Technology: ${project.stack.join(", ")}.` +
        `${project.links.length ? ` Links: ${publicLinks(project)}.` : ""}${repoNote}`,
    },
    {
      ...base,
      id: `${sourceId}:features`,
      text: `Main features of ${project.name}: ${project.highlights.join("; ")}.`,
    },
  ];

  const study = project.caseStudy;
  if (study) {
    documents.push(
      {
        ...base,
        id: `${sourceId}:problem`,
        text: `Why ${project.name} exists. Problem: ${study.problem} Motivation: ${study.motivation} Solution: ${study.solution}`,
      },
      {
        ...base,
        id: `${sourceId}:architecture`,
        text:
          `${project.name} system architecture: ${study.architecture.summary} Layers: ` +
          study.architecture.layers.map((layer) => `${layer.name} (${layer.components.join(", ")})`).join("; ") +
          `. Flow: ${study.architecture.flow.join(" → ")}.`,
      },
      {
        ...base,
        id: `${sourceId}:engineering`,
        text:
          `${project.name} engineering decisions: ` +
          study.decisions.map((item) => `${item.title} — ${item.detail}`).join(" ") +
          ` Challenges: ` +
          study.challenges.map((item) => `${item.title} — ${item.detail}`).join(" "),
      },
      {
        ...base,
        id: `${sourceId}:progress`,
        text: `${project.name} current progress: ${study.progress.join("; ")}. Planned next: ${study.next.join("; ")}.`,
      },
    );
  }
  return documents;
}

export const knowledgeBase: KnowledgeDocument[] = [
  {
    id: "profile:summary",
    sourceId: "profile",
    title: profile.name,
    kind: "profile",
    href: "/about",
    text: `${profile.name} (${profile.shortName}) is a ${profile.role} based in ${profile.location}. ${profile.headline} ${profile.intro} ${profile.about.join(" ")}`,
  },
  {
    id: "profile:specializations",
    sourceId: "profile",
    title: "Specializations",
    kind: "profile",
    href: "/about",
    text: `Samuel's specializations: ${profile.specializations.map((item) => `${item.title} — ${item.description}`).join(" ")}`,
  },
  {
    id: "profile:contact",
    sourceId: "contact",
    title: "Contact",
    kind: "profile",
    href: "#contact",
    text: `How to contact or hire Samuel: email ${profile.email}. ${profile.socials.map((social) => `${social.label}: ${social.href}`).join(". ")}. Résumé PDF: /resume.pdf. Availability: ${profile.availability}. Location: ${profile.location}. Languages: ${profile.languages.join(", ")}.`,
  },
  ...projects.flatMap(projectDocuments),
  ...experience.map((item) => ({
    id: `experience:${item.id}`,
    sourceId: `experience:${item.id}`,
    title: `${item.role} — ${item.organization}`,
    kind: "experience" as const,
    href: "/about#experience",
    text: `Experience: ${item.role} at ${item.organization} (${item.periodLabel}). ${item.summary ?? ""} ${item.highlights.join(" ")}`.replace(/\s+/g, " "),
  })),
  ...education.map((item) => ({
    id: `education:${item.degree}`,
    sourceId: "education",
    title: item.degree,
    kind: "education" as const,
    href: "/about#education",
    text: `Education: ${item.degree}, ${item.institution}, ${item.location}, completed ${formatMonth(item.completed)}${item.standing ? `, ${item.standing}` : ""}. Coursework: ${item.coursework.join(", ")}.`,
  })),
  {
    id: "skills:all",
    sourceId: "skills",
    title: "Skills",
    kind: "skills",
    href: "/about#skills",
    text: `Technical skills by area: ${skillGroups.map((group) => `${group.name}: ${group.skills.join(", ")}`).join(". ")}.`,
  },
  ...recognition
    .filter((item) => item.verified)
    .map((item, index) => ({
      id: `recognition:${index + 1}`,
      sourceId: `recognition:${index + 1}`,
      title: item.title,
      kind: "recognition" as const,
      href: "/about#recognition",
      text: `Award and recognition: ${item.title} (${item.issuer}). ${item.detail} Evidence: ${item.links.map((link) => `${link.label}: ${link.href}`).join("; ")}.`,
    })),
  {
    id: "timeline:all",
    sourceId: "timeline",
    title: "Recent milestones",
    kind: "timeline",
    href: "/about#timeline",
    text: `Timeline of recent milestones, newest first: ${milestones.map((item) => `${formatMonth(item.date)}: ${item.title} — ${item.detail}`).join(" ")}`,
  },
];
