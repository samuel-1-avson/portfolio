import { portfolioData } from "../data/portfolio.ts";

export type EvidenceKind = "profile" | "project" | "experience" | "education" | "award";

export type PortfolioEvidence = {
  id: string;
  sourceId: string;
  sourceTitle: string;
  kind: EvidenceKind;
  text: string;
  href?: string;
};

export type RetrievedEvidence = PortfolioEvidence & { score: number };
export type RagSource = Pick<PortfolioEvidence, "sourceId" | "sourceTitle" | "kind" | "href">;

const ignoredTerms = new Set([
  "about", "also", "and", "are", "can", "does", "for", "from", "have", "how", "into", "like", "more", "please", "samuel", "that", "the", "their", "this", "what", "when", "which", "with", "would", "you", "your",
]);

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function tokenize(value: string) {
  return normalizeWhitespace(value.toLowerCase())
    .match(/[a-z0-9]+/g)
    ?.filter((term) => term.length > 2 && !ignoredTerms.has(term)) ?? [];
}

function splitIntoChunks(value: string, maxLength = 850) {
  const sentences = normalizeWhitespace(value).match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [];
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const next = current ? `${current} ${sentence.trim()}` : sentence.trim();
    if (next.length > maxLength && current) {
      chunks.push(current);
      current = sentence.trim();
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [normalizeWhitespace(value)];
}

function projectEvidence(): PortfolioEvidence[] {
  return portfolioData.projects.flatMap((project) => {
    const sourceId = `project:${project.slug}`;
    const href = project.link !== "#" ? project.link : project.demo;
    const overview: PortfolioEvidence = {
      id: `${sourceId}:overview`,
      sourceId,
      sourceTitle: project.title,
      kind: "project",
      href,
      text: `Project: ${project.title}. Status: ${project.status}. Role: ${project.role}. ${project.description} Technology: ${project.tech.join(", ")}.`,
    };

    const detailChunks = project.details
      ? splitIntoChunks(project.details.replace(/#+\s*/g, "")).map((text, index) => ({
        id: `${sourceId}:detail:${index + 1}`,
        sourceId,
        sourceTitle: project.title,
        kind: "project" as const,
        href,
        text: `Project detail for ${project.title}: ${text}`,
      }))
      : [];

    return [overview, ...detailChunks];
  });
}

export const portfolioKnowledgeBase: PortfolioEvidence[] = [
  {
    id: "profile:samuel",
    sourceId: "profile:samuel",
    sourceTitle: "Samuel Maxwell Obeng Avornyoh",
    kind: "profile",
    text: `${portfolioData.personal.name} is a ${portfolioData.personal.tagline} based in ${portfolioData.personal.location}. ${portfolioData.personal.bio} Contact: ${portfolioData.personal.email}. GitHub: ${portfolioData.socials.github}. LinkedIn: ${portfolioData.socials.linkedin}.`,
  },
  ...projectEvidence(),
  ...portfolioData.cv.map((item, index) => ({
    id: `experience:${index + 1}`,
    sourceId: `experience:${index + 1}`,
    sourceTitle: `${item.role} — ${item.company}`,
    kind: "experience" as const,
    text: `Experience: ${item.role} at ${item.company} (${item.period}). ${normalizeWhitespace(item.description)}`,
  })),
  ...portfolioData.education.map((item, index) => ({
    id: `education:${index + 1}`,
    sourceId: `education:${index + 1}`,
    sourceTitle: item.degree,
    kind: "education" as const,
    text: `Education: ${item.degree}, ${item.school} (${item.period}). ${item.details}`,
  })),
  ...portfolioData.awards.map((award, index) => {
    const links = portfolioData.awardLinks.filter((item) => item.award === award);
    return {
      id: `award:${index + 1}`,
      sourceId: `award:${index + 1}`,
      sourceTitle: award,
      kind: "award" as const,
      href: links[0]?.href,
      text: `Recognition: ${award}.${links.length > 0 ? ` Evidence links: ${links.map((item) => `${item.label}: ${item.href}`).join(" | ")}` : ""}`,
    };
  }),
];

const documentTokenSets = portfolioKnowledgeBase.map((document) => new Set(tokenize(`${document.sourceTitle} ${document.text}`)));
const documentFrequency = new Map<string, number>();
for (const tokenSet of documentTokenSets) {
  for (const term of tokenSet) {
    documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
  }
}

function inverseDocumentFrequency(term: string) {
  return Math.log((portfolioKnowledgeBase.length + 1) / ((documentFrequency.get(term) ?? 0) + 1)) + 1;
}

function createVector(tokens: string[]) {
  const frequency = new Map<string, number>();
  for (const term of tokens) frequency.set(term, (frequency.get(term) ?? 0) + 1);
  const vector = new Map<string, number>();
  for (const [term, count] of frequency) vector.set(term, count * inverseDocumentFrequency(term));
  return vector;
}

function cosineSimilarity(left: Map<string, number>, right: Map<string, number>) {
  let dotProduct = 0;
  let leftMagnitude = 0;
  let rightMagnitude = 0;
  for (const value of left.values()) leftMagnitude += value ** 2;
  for (const value of right.values()) rightMagnitude += value ** 2;
  for (const [term, value] of left) dotProduct += value * (right.get(term) ?? 0);
  if (!leftMagnitude || !rightMagnitude) return 0;
  return dotProduct / Math.sqrt(leftMagnitude * rightMagnitude);
}

const documentVectors = documentTokenSets.map((tokens) => createVector([...tokens]));

function intentBoost(kind: EvidenceKind, query: string) {
  if (/\b(project|portfolio|built|work|case stud(?:y|ies)|demo|repository|github)\b/.test(query) && kind === "project") return 0.12;
  if (/\b(experience|career|resume|résumé|cv|role|job)\b/.test(query) && kind === "experience") return 0.12;
  if (/\b(education|degree|university|school)\b/.test(query) && kind === "education") return 0.12;
  if (/\b(award|achievement|competition|hackathon|winner)\b/.test(query) && kind === "award") return 0.12;
  if (/\b(contact|email|hire|hiring|reach|connect|background|who)\b/.test(query) && kind === "profile") return 0.1;
  return 0;
}

export function retrievePortfolioEvidence(query: string, limit = 4): RetrievedEvidence[] {
  const normalizedQuery = normalizeWhitespace(query.toLowerCase());
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return portfolioKnowledgeBase.filter((document) => document.kind === "profile").slice(0, 1).map((document) => ({ ...document, score: 1 }));
  }

  const queryVector = createVector(queryTokens);
  const namedProjectSourceIds = new Set(portfolioData.projects
    .filter((project) => tokenize(`${project.title} ${project.slug}`).some((term) => term.length >= 5 && queryTokens.includes(term)))
    .map((project) => `project:${project.slug}`));
  const ranked = portfolioKnowledgeBase
    .map((document, index) => {
      const documentTokens = documentTokenSets[index];
      const lexicalOverlap = queryTokens.filter((term) => documentTokens.has(term)).length / queryTokens.length;
      const titleMatch = normalizeWhitespace(document.sourceTitle.toLowerCase()).includes(normalizedQuery)
        || normalizedQuery.includes(normalizeWhitespace(document.sourceTitle.toLowerCase()))
        ? 0.2
        : 0;
      const namedSourceMatch = tokenize(document.sourceTitle).some((term) => term.length >= 5 && queryTokens.includes(term)) ? 0.18 : 0;
      const score = cosineSimilarity(queryVector, documentVectors[index]) * 0.7 + lexicalOverlap * 0.25 + titleMatch + namedSourceMatch + intentBoost(document.kind, normalizedQuery);
      return { ...document, score };
    })
    .filter((document) => namedProjectSourceIds.size === 0 || namedProjectSourceIds.has(document.sourceId))
    .filter((document) => document.score > 0)
    .sort((left, right) => right.score - left.score);

  const relevanceFloor = Math.max(0.08, (ranked[0]?.score ?? 0) * 0.35);
  const selected: RetrievedEvidence[] = [];
  const perSourceCount = new Map<string, number>();
  for (const document of ranked) {
    if (document.score < relevanceFloor || selected.length >= limit) continue;
    const count = perSourceCount.get(document.sourceId) ?? 0;
    const allowsDetailPair = tokenize(document.sourceTitle).some((term) => term.length >= 5 && queryTokens.includes(term));
    if (count >= (allowsDetailPair ? 2 : 1)) continue;
    selected.push(document);
    perSourceCount.set(document.sourceId, count + 1);
  }
  if (selected.length > 0) return selected.map((document) => ({ ...document, score: Number(document.score.toFixed(3)) }));

  return portfolioKnowledgeBase.filter((document) => document.kind === "profile").slice(0, 1).map((document) => ({ ...document, score: 0 }));
}

export function formatRetrievedEvidence(evidence: RetrievedEvidence[]) {
  return evidence.map((item) => `[${item.id}] ${item.sourceTitle}\n${item.text}${item.href ? `\nReference: ${item.href}` : ""}`).join("\n\n");
}

export function toRagSources(evidence: RetrievedEvidence[]): RagSource[] {
  return [...new Map(evidence.map((item) => [item.sourceId, {
    sourceId: item.sourceId,
    sourceTitle: item.sourceTitle,
    kind: item.kind,
    href: item.href,
  }])).values()];
}
