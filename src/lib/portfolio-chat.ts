import { portfolioData } from "../data/portfolio.ts";

export const MAX_CHAT_MESSAGE_LENGTH = 800;
export const MAX_CHAT_HISTORY_MESSAGES = 6;
export const MAX_CHAT_HISTORY_MESSAGE_LENGTH = 600;

export type PortfolioAction = { label: string; href: string };
export type ChatHistoryItem = { role: "user" | "assistant"; text: string };

export type ChatValidationResult =
  | { ok: true; message: string }
  | { ok: false; status: 400 | 413; error: string };

export type ChatHistoryValidationResult =
  | { ok: true; history: ChatHistoryItem[] }
  | { ok: false; status: 400 | 413; error: string };

export function validateChatMessage(value: unknown): ChatValidationResult {
  if (typeof value !== "string") {
    return { ok: false, status: 400, error: "Message must be a string." };
  }

  const message = value.trim().replace(/\s+/g, " ");

  if (!message) {
    return { ok: false, status: 400, error: "Message is required." };
  }

  if (message.length > MAX_CHAT_MESSAGE_LENGTH) {
    return {
      ok: false,
      status: 413,
      error: `Message must be ${MAX_CHAT_MESSAGE_LENGTH} characters or fewer.`,
    };
  }

  return { ok: true, message };
}

export function validateChatHistory(value: unknown): ChatHistoryValidationResult {
  if (value === undefined) {
    return { ok: true, history: [] };
  }

  if (!Array.isArray(value)) {
    return { ok: false, status: 400, error: "Chat history must be a list." };
  }

  if (value.length > MAX_CHAT_HISTORY_MESSAGES) {
    return { ok: false, status: 413, error: `Chat history can include at most ${MAX_CHAT_HISTORY_MESSAGES} messages.` };
  }

  const history: ChatHistoryItem[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object" || !("role" in item) || !("text" in item)) {
      return { ok: false, status: 400, error: "Each chat history item needs a role and text." };
    }

    const { role, text } = item as { role?: unknown; text?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof text !== "string") {
      return { ok: false, status: 400, error: "Chat history contains an invalid message." };
    }

    const normalizedText = text.trim().replace(/\s+/g, " ");
    if (!normalizedText) {
      return { ok: false, status: 400, error: "Chat history cannot contain empty messages." };
    }
    if (normalizedText.length > MAX_CHAT_HISTORY_MESSAGE_LENGTH) {
      return { ok: false, status: 413, error: `Each chat history message must be ${MAX_CHAT_HISTORY_MESSAGE_LENGTH} characters or fewer.` };
    }

    history.push({ role, text: normalizedText });
  }

  return { ok: true, history };
}

export function buildPortfolioContext() {
  const experiences = portfolioData.cv
    .map((item) => `- ${item.role} at ${item.company} (${item.period}): ${item.description.replace(/\n/g, " ")}`)
    .join("\n");
  const projects = portfolioData.projects
    .map((project) => `- ${project.title}: ${project.description} Tech: ${project.tech.join(", ")}. Link: ${project.link}`)
    .join("\n");

  return `
Name: ${portfolioData.personal.name}
Role: ${portfolioData.personal.tagline}
Location: ${portfolioData.personal.location}
Bio: ${portfolioData.personal.bio}
Email: ${portfolioData.personal.email}
GitHub: ${portfolioData.socials.github}
LinkedIn: ${portfolioData.socials.linkedin}

Experience:
${experiences}

Education:
${portfolioData.education.map((item) => `- ${item.degree}, ${item.school} (${item.period}). ${item.details}`).join("\n")}

Skills:
- Technical: ${portfolioData.skills.technical.join(", ")}
- Tools: ${portfolioData.skills.tools.join(", ")}
- Soft skills: ${portfolioData.skills.soft.join(", ")}

Projects:
${projects}

Awards:
${portfolioData.awards.map((award) => {
    const links = portfolioData.awardLinks
      .filter((item) => item.award === award)
      .map((item) => `${item.label}: ${item.href}`)
      .join(" | ");
    return `- ${award}${links ? ` (${links})` : ""}`;
  }).join("\n")}`.trim();
}

export function getPortfolioFallback(message: string) {
  const question = message.toLowerCase();
  const matchingProject = portfolioData.projects.find((project) => {
    const title = project.title.toLowerCase();
    const slug = project.slug.replace(/-/g, " ");
    return question.includes(title) || question.includes(slug);
  });

  if (matchingProject) {
    const destination = matchingProject.link !== "#" ? matchingProject.link : matchingProject.demo || "case study available on request";
    return `${matchingProject.title} is a ${matchingProject.status} project where Samuel worked as ${matchingProject.role}. ${matchingProject.description} Technology: ${matchingProject.tech.join(", ")}. Destination: ${destination}.`;
  }

  if (/^(hi|hello|hey|good morning|good afternoon|good evening|hiya)[!,. ]*$/.test(question)) {
    return `Hi! I’m Samuel’s portfolio assistant. I can help you explore his projects, experience, technical skills, education, awards, or contact details. What would you like to know?`;
  }

  if (/\b(who|about|background|whoami)\b/.test(question)) {
    return `${portfolioData.personal.name} is a ${portfolioData.personal.tagline} based in ${portfolioData.personal.location}. ${portfolioData.personal.bio}`;
  }

  if (/\b(contact|email|hire|hiring|reach|connect)\b/.test(question)) {
    return `The best way to contact Samuel is ${portfolioData.personal.email}. You can also connect on LinkedIn: ${portfolioData.socials.linkedin}`;
  }

  if (/\b(projects?|portfolio|built|work|case stud(?:y|ies))\b/.test(question)) {
    const highlights = portfolioData.projects.slice(0, 6)
      .map((project) => `• ${project.title} — ${project.tech.slice(0, 3).join(", ")}`)
      .join("\n");
    return `Samuel's selected projects:\n${highlights}\n\nThe work spans AI systems, embedded tooling, full-stack platforms, blockchain, and data engineering. Ask about a project by name for more detail.`;
  }

  if (/\b(skills?|stack|technolog(?:y|ies)|tech|languages?|tools?|frameworks?|software)\b/.test(question)) {
    return `Samuel works across ${portfolioData.skills.technical.slice(0, 5).join(", ")}. His tooling includes ${portfolioData.skills.tools.slice(0, 8).join(", ")}.`;
  }

  if (/\b(experience|career|resume|résumé|cv|roles?|jobs?|work history)\b/.test(question)) {
    return `Samuel's recent roles include ${portfolioData.cv.map((item) => `${item.role} at ${item.company}`).join("; ")}.`;
  }

  if (/\b(education|degree|university|school)\b/.test(question)) {
    const education = portfolioData.education[0];
    return `Samuel holds a ${education.degree} from ${education.school} (${education.period}). ${education.details}`;
  }

  if (/\b(award|achievement|competition|hackathon)\b/.test(question)) {
    return `Samuel's achievements include ${portfolioData.awards.join("; ")}.`;
  }

  return `I can help with Samuel's background, experience, projects, skills, education, awards, or contact details. For direct contact, email ${portfolioData.personal.email}.`;
}

export function getSuggestedActions(message: string): PortfolioAction[] {
  const question = message.toLowerCase();
  const matchingProject = portfolioData.projects.find((project) => {
    const title = project.title.toLowerCase();
    const slug = project.slug.replace(/-/g, " ");
    return question.includes(title) || question.includes(slug);
  });

  if (matchingProject) {
    const actions: PortfolioAction[] = [{ label: "View project case study", href: "#projects" }];
    if (matchingProject.demo) {
      actions.push({ label: "Open live demo", href: matchingProject.demo });
    } else if (matchingProject.link !== "#") {
      actions.push({ label: "Open source", href: matchingProject.link });
    }
    return actions;
  }

  if (/\b(award|achievement|competition|hackathon|winner)\b/.test(question) && portfolioData.awardLinks.length > 0) {
    return portfolioData.awardLinks.map(({ label, href }) => ({ label, href }));
  }

  if (/\b(contact|email|hire|hiring|reach|connect)\b/.test(question)) {
    return [
      { label: "Email Samuel", href: `mailto:${portfolioData.personal.email}` },
      { label: "Open LinkedIn", href: portfolioData.socials.linkedin },
    ];
  }
  if (/\b(projects?|portfolio|built|work|rust|ai|machine learning|ml)\b/.test(question)) {
    return [
      { label: "Explore projects", href: "#projects" },
      { label: "View GitHub", href: portfolioData.socials.github },
    ];
  }
  if (/\b(experience|career|resume|cv|role|job|education|degree|award|achievement)\b/.test(question)) {
    return [
      { label: "View experience", href: "#experience" },
      { label: "Open résumé", href: "/resume.pdf" },
    ];
  }
  return [
    { label: "About Samuel", href: "#about" },
    { label: "Contact Samuel", href: "#connect" },
  ];
}
