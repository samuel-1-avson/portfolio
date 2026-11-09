// Content model for the portfolio. Every page, the résumé and the AI assistant
// read from these types, so a fact only needs to be written once.
// Keep this file free of runtime imports so node:test can load it directly.

export type ProjectCategory =
  | "ai"
  | "blockchain"
  | "fintech"
  | "backend"
  | "security"
  | "networking"
  | "embedded"
  | "devtools"
  | "web"
  | "data";

export type ProjectTier = "featured" | "standard" | "archive";

/**
 * Delivery status, worded the way the project's own repository describes it.
 * - live: deployed and publicly usable
 * - released: versioned release with published artifacts
 * - testnet: running against test networks / test money only
 * - alpha: public alpha with documented gaps
 * - in-development: under active construction, not deployed
 * - mvp: core flow built and tested, not yet in production use
 * - prototype: working proof of concept
 * - archived: no longer developed
 */
export type ProjectStatus = "live" | "released" | "testnet" | "alpha" | "in-development" | "mvp" | "prototype" | "archived";

export type ProjectLinkKind = "live" | "source" | "docs" | "demo" | "writeup";

export interface ProjectLink {
  kind: ProjectLinkKind;
  label: string;
  href: string;
}

export interface Repository {
  owner: string;
  name: string;
  visibility: "public" | "private";
}

export interface ArchitectureLayer {
  name: string;
  components: string[];
}

export interface Note {
  title: string;
  detail: string;
}

export interface CaseStudy {
  problem: string;
  motivation: string;
  solution: string;
  architecture: {
    summary: string;
    layers: ArchitectureLayer[];
    flow: string[];
  };
  decisions: Note[];
  challenges: Note[];
  progress: string[];
  next: string[];
}

export interface Project {
  slug: string;
  name: string;
  /** One sentence for cards and social previews. */
  tagline: string;
  /** Two or three sentences for detail headers and the assistant. */
  summary: string;
  categories: ProjectCategory[];
  tier: ProjectTier;
  status: ProjectStatus;
  /** Exact, evidence-backed status wording. */
  statusNote: string;
  role: string;
  /** Optional note about team size or authorship share. */
  contribution?: string;
  /** ISO year-month, e.g. "2026-02". */
  started: string;
  ended?: string;
  /** ISO date of the latest meaningful activity (repository pushed_at). */
  lastActivity: string;
  stack: string[];
  highlights: string[];
  links: ProjectLink[];
  repository?: Repository;
  caseStudy?: CaseStudy;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location?: string;
  start: string;
  /** Omit for a current role. */
  end?: string;
  /** Free-text period exactly as on the CV, used when months are uncertain. */
  periodLabel: string;
  summary?: string;
  highlights: string[];
  relatedProjects?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  completed: string;
  standing?: string;
  coursework: string[];
}

export interface SkillGroup {
  name: string;
  description: string;
  skills: string[];
}

export interface Recognition {
  title: string;
  issuer: string;
  detail: string;
  /** Unverified items are kept for the owner to confirm and are never rendered or sent to the assistant. */
  verified: boolean;
  links: { label: string; href: string }[];
}

export interface Milestone {
  /** ISO year-month. */
  date: string;
  title: string;
  detail: string;
  href?: string;
}

export interface Specialization {
  title: string;
  description: string;
}

export interface Profile {
  name: string;
  shortName: string;
  role: string;
  headline: string;
  intro: string;
  about: string[];
  location: string;
  availability: string;
  email: string;
  /** Shown on the résumé only, matching the owner's published CV. */
  phone: string;
  siteUrl: string;
  socials: { label: string; href: string }[];
  specializations: Specialization[];
  languages: string[];
}
