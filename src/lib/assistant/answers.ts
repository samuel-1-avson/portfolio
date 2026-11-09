// Deterministic answers built directly from portfolio content. Used for
// greetings and contact questions (no model call needed) and as the complete
// fallback whenever the AI provider is unavailable.
import { education, experience, profile, recognition, skillGroups } from "../../content/profile.ts";
import { categoryLabels, projects, statusLabels } from "../../content/projects.ts";
import type { Project } from "../../content/types.ts";
import { findNamedProjects, matchCategories, recommendProjects, type RetrievedDocument } from "./retrieval.ts";

export type Intent = "greeting" | "contact" | "project" | "category" | "recent" | "experience" | "education" | "skills" | "recognition" | "general";

export function detectIntent(message: string): Intent {
  const text = message.toLowerCase().trim();
  if (/^(hi|hello|hey|hiya|yo|good (morning|afternoon|evening)|greetings)\b[\s!.,?]*(there)?[\s!.,?]*$/.test(text)) return "greeting";
  if (/\b(contact|e-?mail|reach (him|samuel|out)|get in touch|hire|hiring|linkedin|phone|call him|available for)\b/.test(text)) return "contact";
  if (findNamedProjects(text).length > 0) return "project";
  if (/\b(recent|latest|newest|currently|working on|lately|these days)\b/.test(text)) return "recent";
  if (matchCategories(text).length > 0 && /\b(projects?|built|build|work|experience|what|which|show|examples?|has he)\b/.test(text)) return "category";
  if (/\b(education|degree|university|college|stud(y|ied|ies|ying)|graduat\w*|qualifications?)\b/.test(text)) return "education";
  if (/\b(awards?|achievements?|hackathon|won|winner|recognition)\b/.test(text)) return "recognition";
  if (/\b(experience|career|employ\w*|jobs?|roles?|internship|national service|worked at)\b/.test(text)) return "experience";
  if (/\b(skills?|stack|technolog(y|ies)|languages?|tools?|frameworks?)\b/.test(text)) return "skills";
  return "general";
}

/** Intents answered without the model even when one is configured. */
export function isDeterministicIntent(intent: Intent) {
  return intent === "greeting" || intent === "contact";
}

function projectLine(project: Project) {
  return `- ${project.name} — ${project.tagline} (${statusLabels[project.status]})`;
}

function describeProject(project: Project, question: string) {
  const q = question.toLowerCase();
  const parts = [`${project.name}: ${project.summary}`];
  if (/\b(tech|technolog|stack|built with|language|framework|use)\w*/.test(q)) {
    parts.push(`It is built with ${project.stack.join(", ")}.`);
  }
  if (project.caseStudy && /\b(architect\w*|design|how does|how it works|work)\b/.test(q)) {
    parts.push(project.caseStudy.architecture.summary);
  }
  if (/\b(feature|do|does|capabilit)\w*/.test(q)) {
    parts.push(`Key features: ${project.highlights.slice(0, 4).join("; ")}.`);
  }
  parts.push(`Status: ${statusLabels[project.status]} — ${project.statusNote}. Samuel's role: ${project.role}.`);
  if (project.repository?.visibility === "private") parts.push("The source code is private.");
  return parts.join(" ");
}

export function contactAnswer() {
  const linkedIn = profile.socials.find((social) => social.label === "LinkedIn");
  return `The best way to reach Samuel is by email at ${profile.email}.${linkedIn ? ` You can also connect on LinkedIn (${linkedIn.href}).` : ""} His résumé is available as a PDF at /resume.pdf. ${profile.availability}.`;
}

export function greetingAnswer() {
  return "Hi — I'm the assistant for Samuel's portfolio. I can walk you through his projects, how they're built, his experience and skills, or how to get in touch. What would you like to know?";
}

/** A complete, evidence-only answer for any question. */
export function portfolioAnswer(message: string, evidence: RetrievedDocument[]): string {
  const intent = detectIntent(message);
  switch (intent) {
    case "greeting":
      return greetingAnswer();
    case "contact":
      return contactAnswer();
    case "project": {
      const named = findNamedProjects(message);
      return named.slice(0, 2).map((project) => describeProject(project, message)).join("\n\n");
    }
    case "recent": {
      const recent = recommendProjects("recent", evidence, 4);
      return `Samuel's most recently active work:\n${recent.map(projectLine).join("\n")}`;
    }
    case "category": {
      const categories = matchCategories(message);
      const matches = recommendProjects(message, evidence, 4);
      if (matches.length === 0) break;
      const label = categories.map((category) => categoryLabels[category]).join(" / ");
      return `Projects that match ${label}:\n${matches.map(projectLine).join("\n")}\nOpen any of them for the full case study.`;
    }
    case "experience":
      return `Samuel's experience, most recent first:\n${experience
        .slice(0, 5)
        .map((item) => `- ${item.role}, ${item.organization} (${item.periodLabel})`)
        .join("\n")}`;
    case "education": {
      const degree = education[0];
      return `Samuel holds a ${degree.degree} from the ${degree.institution} (${degree.location}), completed in ${degree.completed.slice(0, 4)}${degree.standing ? ` with ${degree.standing} standing` : ""}. Coursework included ${degree.coursework.slice(0, 5).join(", ")}.`;
    }
    case "recognition": {
      const verified = recognition.filter((item) => item.verified);
      return verified.map((item) => `${item.title} (${item.issuer}). ${item.detail}`).join("\n");
    }
    case "skills":
      return `Samuel's skills by area:\n${skillGroups
        .slice(0, 5)
        .map((group) => `- ${group.name}: ${group.skills.slice(0, 6).join(", ")}`)
        .join("\n")}`;
    default:
      break;
  }

  const top = evidence.find((document) => document.kind === "project") ?? evidence[0];
  if (top?.projectSlug) {
    const project = projects.find((item) => item.slug === top.projectSlug);
    if (project) return describeProject(project, message);
  }
  if (top && top.kind !== "profile") return top.text.split(/(?<=\.)\s+/).slice(0, 3).join(" ");
  return `I can answer questions about Samuel's projects, how they're built, his experience, skills and education. For anything else, email him at ${profile.email}.`;
}
