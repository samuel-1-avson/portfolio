// Chat orchestration, independent of HTTP so it can be unit-tested.
// Produces a sequence of events that the route streams as NDJSON.
import { profile } from "../../content/profile.ts";
import { statusLabels } from "../../content/projects.ts";
import type { Project } from "../../content/types.ts";
import { detectIntent, isDeterministicIntent, portfolioAnswer, type Intent } from "./answers.ts";
import type { EvidenceKind } from "./knowledge.ts";
import { buildPrompt, SYSTEM_INSTRUCTION } from "./prompt.ts";
import type { ModelStream, ModelUsage } from "./provider.ts";
import { findNamedProjects, matchCategories, recommendProjects, retrieve, type RetrievedDocument } from "./retrieval.ts";
import type { ChatHistoryItem } from "./validation.ts";

export type SourceRef = { id: string; title: string; kind: EvidenceKind; href?: string };
export type ProjectRef = { slug: string; name: string; tagline: string; status: string; href: string };
export type ChatAction = { label: string; href: string };
export type AnswerMode = "model" | "portfolio";

export type ChatEvent =
  | { type: "meta"; requestId: string; sources: SourceRef[]; projects: ProjectRef[]; actions: ChatAction[]; retrieval: "local" | "semantic" }
  | { type: "delta"; text: string }
  | { type: "done"; mode: AnswerMode; notice?: string };

export type ChatMetrics = {
  intent: Intent;
  mode: AnswerMode;
  retrieval: "local" | "semantic";
  firstTokenMs?: number;
  totalMs: number;
  outputChars: number;
  usage?: ModelUsage;
  modelError?: string;
};

export type ChatDependencies = {
  model: ModelStream | null;
  semanticRetrieve?: (query: string) => Promise<RetrievedDocument[] | null>;
  /** Returns false when the model budget is exhausted. */
  reserveModelCall?: () => boolean;
  signal?: AbortSignal;
  onMetrics?: (metrics: ChatMetrics) => void;
  now?: () => number;
};

const FOLLOW_UP = /\b(it|its|it's|that one|this one|they|them|those|these|the project|the system)\b/i;

/** Follow-up questions ("what stack does it use?") inherit the subject of the previous question. */
export function buildRetrievalQuery(message: string, history: ChatHistoryItem[]) {
  if (findNamedProjects(message).length > 0 || matchCategories(message).length > 0) return message;
  const previous = [...history].reverse().find((item) => item.role === "user");
  return previous && FOLLOW_UP.test(message) ? `${previous.text} ${message}` : message;
}

function toProjectRef(project: Project): ProjectRef {
  return { slug: project.slug, name: project.name, tagline: project.tagline, status: statusLabels[project.status], href: `/work/${project.slug}` };
}

function toSources(evidence: RetrievedDocument[]): SourceRef[] {
  const seen = new Map<string, SourceRef>();
  for (const document of evidence) {
    if (!seen.has(document.sourceId)) seen.set(document.sourceId, { id: document.sourceId, title: document.title, kind: document.kind, href: document.href });
  }
  return [...seen.values()].slice(0, 5);
}

export function suggestActions(intent: Intent, recommended: Project[], query: string): ChatAction[] {
  if (intent === "contact" || intent === "greeting") {
    const linkedIn = profile.socials.find((social) => social.label === "LinkedIn");
    return [
      { label: "Email Samuel", href: `mailto:${profile.email}` },
      ...(linkedIn ? [{ label: "LinkedIn", href: linkedIn.href }] : []),
      { label: "Résumé", href: "/resume" },
    ];
  }
  if (intent === "experience" || intent === "education" || intent === "skills" || intent === "recognition") {
    return [
      { label: "About & experience", href: "/about" },
      { label: "Résumé", href: "/resume" },
    ];
  }
  if (intent === "project" && recommended[0]) {
    const project = recommended[0];
    const external = project.links.find((link) => link.kind === "live" || link.kind === "demo") ?? project.links.find((link) => link.kind === "source");
    return [{ label: project.caseStudy ? "Read the case study" : "View project", href: `/work/${project.slug}` }, ...(external ? [{ label: external.label, href: external.href }] : [])];
  }
  const category = matchCategories(query)[0];
  return [{ label: "Browse all work", href: category ? `/work?category=${category}` : "/work" }];
}

export async function* runChat(input: { message: string; history: ChatHistoryItem[]; requestId: string }, deps: ChatDependencies): AsyncGenerator<ChatEvent> {
  const now = deps.now ?? Date.now;
  const started = now();
  const query = buildRetrievalQuery(input.message, input.history);
  const intent = detectIntent(query);

  let retrieval: "local" | "semantic" = "local";
  let evidence: RetrievedDocument[] | null = null;
  if (deps.semanticRetrieve && !isDeterministicIntent(intent)) {
    evidence = await deps.semanticRetrieve(query).catch(() => null);
    if (evidence && evidence.length > 0) retrieval = "semantic";
  }
  if (!evidence || evidence.length === 0) evidence = retrieve(query);

  const recommended = recommendProjects(query, evidence);
  yield {
    type: "meta",
    requestId: input.requestId,
    sources: toSources(evidence),
    projects: recommended.map(toProjectRef),
    actions: suggestActions(intent, recommended, query),
    retrieval,
  };

  const finish = (mode: AnswerMode, outputChars: number, extra: Partial<ChatMetrics> = {}) =>
    deps.onMetrics?.({ intent, mode, retrieval, totalMs: now() - started, outputChars, ...extra });

  const fallback = () => portfolioAnswer(query, evidence ?? []);

  if (isDeterministicIntent(intent) || !deps.model) {
    const text = fallback();
    yield { type: "delta", text };
    yield { type: "done", mode: "portfolio" };
    finish("portfolio", text.length);
    return;
  }

  if (deps.reserveModelCall && !deps.reserveModelCall()) {
    const text = fallback();
    yield { type: "delta", text };
    yield { type: "done", mode: "portfolio", notice: "The AI assistant has reached today's limit, so this answer comes straight from the portfolio data." };
    finish("portfolio", text.length, { modelError: "daily-budget" });
    return;
  }

  let output = "";
  let firstTokenMs: number | undefined;
  let usage: ModelUsage | undefined;
  try {
    const stream = deps.model({
      systemInstruction: SYSTEM_INSTRUCTION,
      prompt: buildPrompt(input.message, input.history, evidence),
      signal: deps.signal ?? new AbortController().signal,
      onUsage: (value) => {
        usage = value;
      },
    });
    for await (const text of stream) {
      if (firstTokenMs === undefined) firstTokenMs = now() - started;
      output += text;
      yield { type: "delta", text };
    }
  } catch (error) {
    const modelError = error instanceof Error ? error.name : "UnknownError";
    if (deps.signal?.aborted) {
      finish("model", output.length, { firstTokenMs, usage, modelError: "aborted" });
      return;
    }
    if (!output) {
      const text = fallback();
      yield { type: "delta", text };
      yield { type: "done", mode: "portfolio", notice: "The AI service is unavailable right now, so this answer comes straight from the portfolio data." };
      finish("portfolio", text.length, { modelError });
      return;
    }
    yield { type: "done", mode: "model", notice: "The answer was cut short. Try asking again." };
    finish("model", output.length, { firstTokenMs, usage, modelError });
    return;
  }

  if (!output.trim()) {
    const text = fallback();
    yield { type: "delta", text };
    yield { type: "done", mode: "portfolio" };
    finish("portfolio", text.length, { modelError: "empty-response" });
    return;
  }

  yield { type: "done", mode: "model" };
  finish("model", output.length, { firstTokenMs, usage });
}
