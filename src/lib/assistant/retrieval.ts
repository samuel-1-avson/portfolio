// Local retrieval over the portfolio knowledge base: TF-IDF cosine similarity
// with query expansion, exact project-name matching and intent boosts.
// Deterministic, dependency-free and fast enough to run on every request.
import { projects } from "../../content/projects.ts";
import type { Project, ProjectCategory } from "../../content/types.ts";
import { knowledgeBase, type EvidenceKind, type KnowledgeDocument } from "./knowledge.ts";

export type RetrievedDocument = KnowledgeDocument & { score: number };

const STOPWORDS = new Set(
  "a about after all also an and any are as at be been but by can could did do does for from had has have he her him his how i if in into is it its just me more most my no not of on or our please samuel samuel's she so some tell than that the their them then there these they this to us was we were what when where which who why will with would you your his he's does give show list".split(" "),
);

/** Lightweight query expansion so "AI" also finds "LLM", "Gemini" and "machine learning". */
const EXPANSIONS: Record<string, string[]> = {
  ai: ["ai", "ml", "llm", "gemini", "machine", "learning", "model", "assistant", "rag"],
  ml: ["ml", "machine", "learning", "model", "pytorch", "tensorflow", "ai"],
  llm: ["llm", "gemini", "rag", "assistant", "ai"],
  blockchain: ["blockchain", "solana", "ethereum", "sepolia", "tron", "evm", "escrow", "consensus", "pbft", "chain", "onchain"],
  crypto: ["crypto", "stablecoin", "usdt", "solana", "tron", "wallet", "blockchain", "payments"],
  web3: ["web3", "blockchain", "solana", "wallet", "escrow"],
  payment: ["payment", "payments", "settlement", "ledger", "payout", "payouts", "invoice", "fintech"],
  payments: ["payment", "payments", "settlement", "ledger", "payout", "payouts", "invoice", "fintech"],
  fintech: ["fintech", "payment", "payments", "ledger", "settlement", "merchant"],
  backend: ["backend", "api", "rust", "go", "axum", "postgresql", "services", "worker", "server", "grpc"],
  security: ["security", "encryption", "encrypted", "cryptography", "xchacha20", "threat", "supply", "verification"],
  embedded: ["embedded", "mcu", "firmware", "microcontroller", "iot", "raspberry", "stm32", "esp32"],
  iot: ["iot", "embedded", "raspberry", "sensor", "monitor"],
  frontend: ["frontend", "react", "next", "solidjs", "ui", "tailwind"],
  architecture: ["architecture", "layers", "design", "system", "services", "flow"],
  rust: ["rust", "axum", "tokio", "tauri", "cargo"],
  golang: ["go"],
  networking: ["networking", "proxy", "socks5", "quic", "tunnels", "gateway", "network"],
  devops: ["terraform", "docker", "kubernetes", "cloud", "gcp", "deployment"],
  cloud: ["cloud", "gcp", "google", "terraform", "deployment"],
};

/** Names and aliases visitors use for each project. */
export const PROJECT_ALIASES: Record<string, string[]> = {
  bitmomo: ["bitmomo", "bit momo", "cryptopos", "crypto pos", "crypto payment system"],
  proxyhubb: ["proxyhubb", "proxyhub", "proxy hub", "proxysocialhub", "proxy social hub", "proxy marketplace"],
  ciphervault: ["ciphervault", "cipher vault"],
  creg: ["creg", "chain registry", "chain-registry", "contribution arena"],
  neurobench: ["neurobench", "neurostate", "neuro bench", "neuro state"],
  posai: ["posai", "pos ai", "pos builder"],
  "sms-ai-ghana": ["sms ai", "sms-ai", "ussd"],
  "agentic-qa-platform": ["agentic qa", "qa platform", "qa automation"],
  "sound-health-monitor": ["sound health", "sound anomaly", "generator sound", "acoustic anomaly"],
  "tonycon-cold-store": ["cold store", "tonycon", "tonycold", "coldstore"],
  marketwise: ["marketwise", "market wise"],
  "rgt-training-program": ["really great tech", "rgt", "training programme", "training program"],
  "ai-merchant-assistant": ["merchant assistant"],
  "healthcare-no-show": ["no-show", "no show", "healthcare"],
  "music-companion": ["music companion"],
  "sports-odds-arbitrage": ["arbitrage", "sports odds", "betting"],
  "arcade-hub": ["arcade"],
  "fsm-designer": ["fsm designer", "pyqt"],
  "sign-language-detection": ["sign language"],
  "vf-digital": ["vf-digital", "vf digital", "video fingerprint"],
  "smart-proxy-system": ["smart proxy"],
};

/** Visitor vocabulary that maps to a project category. */
const CATEGORY_KEYWORDS: Record<ProjectCategory, RegExp> = {
  ai: /\b(ai|a\.i\.|artificial intelligence|machine learning|ml|llms?|deep learning|neural|gemini|rag|nlp|computer vision)\b/,
  blockchain: /\b(blockchain|web3|crypto|cryptocurrency|solana|ethereum|evm|smart contracts?|on-?chain|tron|consensus|decentrali[sz]ed)\b/,
  fintech: /\b(fintech|payments?|financial|banking|merchants?|pos|point of sale|ledger|settlement|mobile money|momo)\b/,
  backend: /\b(backend|back-end|server|apis?|microservices?|distributed|databases?|postgres(ql)?|system design|(system|software) architecture|scalab\w*)\b/,
  security: /\b(security|secure|cryptograph\w*|encrypt\w*|secrets?|supply[- ]chain|threat)\b/,
  networking: /\b(network\w*|proxy|proxies|bandwidth|socks5?|quic|tunnel\w*)\b/,
  embedded: /\b(embedded|iot|firmware|microcontrollers?|mcus?|hardware|raspberry pi|stm32|esp32)\b/,
  devtools: /\b(developer tools?|devtools?|cli|tooling|ide|testing|qa|automation)\b/,
  web: /\b(web apps?|frontend|front-end|react|next\.?js|full[- ]?stack|ui)\b/,
  data: /\b(data|analytics|data engineering|etl|forecast\w*)\b/,
};

function tokenize(value: string) {
  return value.toLowerCase().normalize("NFKD").match(/[a-z0-9]+/g)?.filter((term) => term.length > 1 && !STOPWORDS.has(term)) ?? [];
}

function expand(tokens: string[]) {
  const expanded = [...tokens];
  for (const token of tokens) {
    const extra = EXPANSIONS[token];
    if (extra) expanded.push(...extra.filter((term) => term !== token));
  }
  return expanded;
}

const documentTokens = knowledgeBase.map((document) => tokenize(`${document.title} ${document.text}`));
const documentFrequency = new Map<string, number>();
for (const tokens of documentTokens) {
  for (const term of new Set(tokens)) documentFrequency.set(term, (documentFrequency.get(term) ?? 0) + 1);
}

function idf(term: string) {
  return Math.log((knowledgeBase.length + 1) / ((documentFrequency.get(term) ?? 0) + 1)) + 1;
}

function vectorize(tokens: string[]) {
  const counts = new Map<string, number>();
  for (const term of tokens) counts.set(term, (counts.get(term) ?? 0) + 1);
  const vector = new Map<string, number>();
  let magnitude = 0;
  for (const [term, count] of counts) {
    const weight = (1 + Math.log(count)) * idf(term);
    vector.set(term, weight);
    magnitude += weight * weight;
  }
  return { vector, magnitude: Math.sqrt(magnitude) };
}

const documentVectors = documentTokens.map(vectorize);
const documentTermSets = documentTokens.map((tokens) => new Set(tokens));

function cosine(query: ReturnType<typeof vectorize>, document: ReturnType<typeof vectorize>) {
  if (!query.magnitude || !document.magnitude) return 0;
  let dot = 0;
  for (const [term, weight] of query.vector) dot += weight * (document.vector.get(term) ?? 0);
  return dot / (query.magnitude * document.magnitude);
}

function intentBoost(kind: EvidenceKind, query: string) {
  if (kind === "project" && /\b(projects?|built|build|work|portfolio|case stud(y|ies)|demo|repo(sitory)?)\b/.test(query)) return 0.08;
  if (kind === "experience" && /\b(experience|career|employ\w*|jobs?|roles?|worked|internship|national service|cv|r[ée]sum[ée])\b/.test(query)) return 0.25;
  if (kind === "education" && /\b(education|degree|university|college|stud(y|ied|ies|ying)|school|graduat\w*|coursework|qualifications?)\b/.test(query)) return 0.3;
  if (kind === "recognition" && /\b(awards?|achievements?|hackathon|won|winner|recognition|kaggle|competition)\b/.test(query)) return 0.3;
  if (kind === "skills" && /\b(skills?|stack|technolog(y|ies)|languages?|tools?|frameworks?|proficien\w*)\b/.test(query)) return 0.2;
  if (kind === "timeline" && /\b(recent|latest|timeline|milestones?|history|newest|lately)\b/.test(query)) return 0.2;
  if (kind === "profile" && /\b(who|about|background|introduc\w*|summary|contact|email|hire|reach|available|availability)\b/.test(query)) return 0.15;
  return 0;
}

/** Projects the visitor named explicitly (by name or alias). */
export function findNamedProjects(query: string): Project[] {
  const normalized = ` ${query.toLowerCase().replace(/[^a-z0-9\-\s]/g, " ").replace(/\s+/g, " ")} `;
  return projects.filter((project) => {
    const aliases = PROJECT_ALIASES[project.slug] ?? [project.name.toLowerCase()];
    return aliases.some((alias) => normalized.includes(` ${alias} `) || normalized.includes(` ${alias}s `) || normalized.includes(` ${alias}'`));
  });
}

export function matchCategories(query: string): ProjectCategory[] {
  const normalized = query.toLowerCase();
  return (Object.keys(CATEGORY_KEYWORDS) as ProjectCategory[]).filter((category) => CATEGORY_KEYWORDS[category].test(normalized));
}

export function retrieve(query: string, limit = 6): RetrievedDocument[] {
  const normalized = query.toLowerCase();
  const tokens = tokenize(query);
  const named = new Set(findNamedProjects(query).map((project) => project.slug));
  const queryVector = vectorize(expand(tokens));

  const ranked = knowledgeBase
    .map((document, index) => {
      const overlap = tokens.length ? tokens.filter((term) => documentTermSets[index].has(term)).length / tokens.length : 0;
      const nameBoost = document.projectSlug && named.has(document.projectSlug) ? 0.6 : 0;
      const score = cosine(queryVector, documentVectors[index]) * 0.65 + overlap * 0.2 + nameBoost + intentBoost(document.kind, normalized);
      return { ...document, score };
    })
    // A named project narrows the answer to that project (plus non-project context).
    .filter((document) => named.size === 0 || !document.projectSlug || named.has(document.projectSlug))
    .filter((document) => document.score > 0.04)
    .sort((left, right) => right.score - left.score);

  if (ranked.length === 0) {
    return knowledgeBase.filter((document) => document.id === "profile:summary").map((document) => ({ ...document, score: 0 }));
  }

  const floor = ranked[0].score * 0.3;
  const perSource = new Map<string, number>();
  const selected: RetrievedDocument[] = [];
  for (const document of ranked) {
    if (selected.length >= limit || document.score < floor) continue;
    const count = perSource.get(document.sourceId) ?? 0;
    const cap = document.projectSlug && named.has(document.projectSlug) ? 4 : 2;
    if (count >= cap) continue;
    perSource.set(document.sourceId, count + 1);
    selected.push({ ...document, score: Number(document.score.toFixed(3)) });
  }
  return selected;
}

const TIER_WEIGHT = { featured: 3, standard: 2, archive: 0.5 } as const;

/**
 * Projects to suggest for a question: explicitly named ones first; otherwise
 * projects in the categories the visitor asked about, ranked by depth (tier),
 * fit and recency; otherwise projects surfaced by retrieval.
 */
export function recommendProjects(query: string, evidence: RetrievedDocument[], limit = 3): Project[] {
  const named = findNamedProjects(query);
  if (named.length > 0) return named.slice(0, limit);

  const wantsArchive = /\b(old|older|archived?|earlier|all)\b/i.test(query);
  const wantsRecent = /\b(recent|latest|newest|current(ly)?|lately|now)\b/i.test(query);
  const categories = matchCategories(query);
  const candidates = projects.filter((project) => wantsArchive || project.tier !== "archive");

  if (categories.length > 0) {
    return candidates
      .map((project) => ({
        project,
        fit: project.categories.filter((category) => categories.includes(category)).length,
      }))
      .filter((item) => item.fit > 0)
      .sort(
        (left, right) =>
          right.fit - left.fit ||
          TIER_WEIGHT[right.project.tier] - TIER_WEIGHT[left.project.tier] ||
          right.project.lastActivity.localeCompare(left.project.lastActivity),
      )
      .slice(0, limit)
      .map((item) => item.project);
  }

  if (wantsRecent) {
    return [...candidates].sort((left, right) => right.lastActivity.localeCompare(left.lastActivity)).slice(0, limit);
  }

  const fromEvidence = [...new Set(evidence.map((document) => document.projectSlug).filter((slug): slug is string => Boolean(slug)))];
  return fromEvidence
    .map((slug) => projects.find((project) => project.slug === slug))
    .filter((project): project is Project => Boolean(project))
    .slice(0, limit);
}
