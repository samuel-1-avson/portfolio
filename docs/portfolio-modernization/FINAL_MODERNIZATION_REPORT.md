# Final modernization report

Date: 9 November 2026 · Branch: `feat/portfolio-modernization` (from `main` at `f04566c`) · **Not committed, pushed or deployed** — all changes are in the working tree for review.

## Outcome in one paragraph

The portfolio was rebuilt in place on its existing Next.js stack as a multi-page, black-and-white site whose every project claim traces to a GitHub repository. The four priority projects — BitMomo, ProxyHubb, CipherVault and CREG — were investigated in their repositories and now lead the site as case studies alongside NeuroBench, with honest status wording (testnet, public alpha, released). Gamification, terminal effects, the canvas background and ~50 dead or obsolete files were removed. The AI assistant was rebuilt with real token streaming, a knowledge base generated from the same content as the pages, project recommendations, deterministic contact/greeting answers, a full fallback when the model is unavailable, and fixes to its input-size and logging gaps. A new HTML résumé and a two-page PDF are generated from the same data. Lint, typecheck, 34 unit tests and the production build pass; Lighthouse accessibility, best-practices and SEO are 100 on every measured page.

## What changed

### Content and evidence
- Inventory of 83 repositories (+ PosAI in an organisation): [GITHUB_PROJECT_INVENTORY.md](GITHUB_PROJECT_INVENTORY.md).
- New typed content model in `src/content` — 21 projects (5 featured with case studies, 10 standard, 6 archive), experience, education, skills, verified recognition, 13 timeline milestones.
- Corrected or replaced inaccurate claims, notably: CREG (was described with ERC-721/Polygon/ZK features it does not have), BitMomo (was "concept"), ProxyHubb (wrong stack), NeuroBench (inconsistent 90+/285+; repository has 294 IPC commands), unverified awards withheld.
- Private repositories (BitMomo, PosAI, ProxyHubb — made private during the audit — and others) have no source links; a validator scans all public content for internal identifiers (cloud project IDs, IPs, internal hostnames).

### Design and UX
- Monochrome design system ([DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)): white/black tokens, inverted bands, Geist Sans/Mono self-hosted, numbered section rules, 44px targets, light-first with optional dark theme.
- Information architecture: `/` (hero, case studies, recruiter "at a glance", more work, recent milestones), `/work` (case studies + filter/search index), `/work/[slug]` (21 shareable pages), `/about`, `/resume`, contact band on every page, custom 404.
- Motion: page entrance (transform only), scroll-driven reveals where supported, underline/arrow hovers, nav indicator; all disabled under `prefers-reduced-motion`; content never hidden.
- Architecture diagrams as accessible HTML for every case study.

### Removed
Gamification (XP bar, levels, achievements, toasts, modal, icons, `lib/gamification.ts`), Konami/"hacker mode", scanlines, typewriter, glitch text, full-screen canvas, command palette, terminal boot/window, nine unused visual components, unused `Chatbot.tsx`, project/blog/résumé modals, blog section, Create Next App SVGs and favicon, `src/data/portfolio.ts` and the old assistant libraries (replaced). The July audit moved to `docs/portfolio-modernization/archive/`.

### AI assistant
See [AI_ASSISTANT_ARCHITECTURE.md](AI_ASSISTANT_ARCHITECTURE.md). Streaming NDJSON API; retrieval with aliases (e.g. "ProxySocialHub" → ProxyHubb) and category recommendations; related-project cards, actions and sources rendered from server data; prompt-injection delimiter neutralisation; streamed 16 KB body cap (fixes the chunked-body bypass); structured telemetry without message content; native `<dialog>` panel with stop/retry, session memory and `Ctrl/⌘+K`; panel code lazy-loaded.

### CV
`/resume` and `public/resume.pdf` (2 pages, regenerated) built from content; changes and open questions in [CV_UPDATE_REPORT.md](CV_UPDATE_REPORT.md). The original CV PDF in the repository root is untouched.

### Platform
- Next.js 16.2.10 → **16.4.5** (critical/high advisories in 16.2.x); removed the now-vulnerable PostCSS 8.5.10 override (Next 16.4.5 pins 8.5.23).
- Tighter security headers (`frame-ancestors 'none'`, `X-Frame-Options: DENY`, `object-src 'none'`, COOP, HSTS).
- SEO: `metadataBase`, canonical URLs, per-page metadata, generated OG images (site + 21 projects), Person/WebSite/SoftwareSourceCode/CreativeWork JSON-LD, real sitemap, robots disallowing `/api/`.
- GitHub snapshot script + weekly PR workflow; résumé PDF script; vector-search scripts ported (and now delete stale objects).
- Lint now also covers `scripts/`.

## Test evidence

All commands run on Windows, Node 24.20.0, in this session.

| Check | Result |
| --- | --- |
| `npm run lint` (src, scripts, config) | Pass — 0 problems |
| `npm run typecheck` | Pass |
| `npm run test` | **34/34 pass** (8 suites: content, validation, knowledge privacy, retrieval/recommendations, intents/answers, prompt safety, chat orchestration, rate limiting) |
| `npm run build` (Next 16.4.5, webpack) | Pass — 52 static pages + `/api/chat` |
| `npm audit --omit=dev` | **0 vulnerabilities** |
| `npm audit` (incl. dev) | 8 moderate, all in the ESLint/typescript-eslint toolchain; the only fix offered is a breaking downgrade of `eslint-config-next` to v15, so not applied |
| `/api/chat` live contract (production server) | 200 NDJSON `meta → delta → done`; 400 bad JSON/history; 403 foreign Origin; 405 GET; 413 20 KB body and 900-char message; 415 wrong content type; 429 after the per-minute limit; `X-Request-Id` on every response |
| Route smoke test | 200 for `/`, `/work`, `/work/bitmomo`, `/work/proxyhubb`, `/about`, `/resume`, `/resume.pdf`, `/sitemap.xml`, `/robots.txt`, OG images; 404 for unknown paths; no ProxySocialHub source link emitted |
| Browser checks (in-app browser) | Desktop and 375px mobile layouts with no horizontal scroll; mobile menu (focus to first link, Escape); work filter via `?category=`; dark theme; assistant: open from header, suggestion answered with project card/actions/sources, "Ask about CipherVault" button, Escape restores focus, `Ctrl+K` reopens; no console errors |
| Résumé PDF | Generated from `/resume` with headless Edge; 2 A4 pages; text extracted and reviewed |

### Lighthouse (Lighthouse 12 via `npx`, headless Edge, local production build)

Mobile (default simulated throttling):

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| `/` | 90 | 100 | 100 | 100 | 2.9 s | 0.025 | 210 ms |
| `/work` | 90 | 100 | 100 | 100 | 2.9 s | 0 | 220 ms |
| `/work/bitmomo` | 93 | 100 | 100 | 100 | 2.8 s | 0 | 150 ms |
| `/about` | 93 | 100 | 100 | 100 | 2.8 s | 0.031 | 140 ms |
| `/resume` | 93 | 100 | 100 | 100 | 2.8 s | 0.041 | 140 ms |

Desktop preset: **100 / 100 / 100 / 100** on all five pages (LCP 0.6 s).

Notes: measured on `localhost` (no CDN, no HTTP/2), before the final Next 16.4.5 upgrade; production numbers on Vercel will differ. Two runs failed with Lighthouse's `NO_NAVSTART` trace error and were re-run. The first mobile run (before removing the opacity fade from the page entrance) scored 88–93; the case-study page had one heading-order issue (fixed).

## Acceptance criteria

| Criterion | Status |
| --- | --- |
| Green/black and grey-heavy identity replaced by consistent black-and-white | **Met** |
| Unnecessary gamification removed | **Met** |
| Readable, minimal, responsive | **Met** (375px and desktop verified; tablet not separately screenshotted) |
| GitHub analysed; portfolio represents significant current work | **Met** — with the gaps listed below |
| ProxySocialHub, CipherVault, BitMomo, CREG investigated and represented with evidence | **Met** |
| Compelling technical case studies for selected projects | **Met** — 5 case studies; no screenshots yet |
| Assistant more accurate, useful, secure, integrated | **Met in code and tests; live Gemini path not verified** (no credential available here) |
| CV reflects verified experience and projects | **Met, pending owner confirmation** of the items in the CV report |
| Simpler, purposeful navigation | **Met** — Work, About, Résumé, Contact + Ask AI |
| Accessibility expectations on important pages | **Met** — Lighthouse a11y 100; keyboard paths checked. Not a full manual WCAG 2.2 audit with a screen reader |
| Builds and passes tests | **Met** |
| Implementation and limitations documented | **Met** — eight documents in this folder |

## Known issues and limitations

1. **Live AI not exercised.** `.env.local` does not exist, so answers in this session came from the portfolio-data path. The model path is covered by unit tests with fake streams only.
2. **Rate limiting is per instance** (in memory). Adequate for a portfolio; use a shared store for high traffic.
3. **No project screenshots.** Most strong projects are private; images need owner approval.
4. **Unverified items withheld** (two awards, CWA, "4,097 submissions"); **no evidence found** for mining-technology or fleet-management work.
5. **ProxySocialHub became private** at 20:12 UTC on 9 Nov 2026, mid-audit. The site now links only proxyhubb.com and its docs.
6. **Dev-dependency advisories** (8 moderate, lint toolchain only) remain.
7. **CSP keeps `'unsafe-inline'` for scripts** (Next.js bootstrap, theme script, JSON-LD); nonces would force dynamic rendering.
8. **Old URL fragments** such as `/#projects-neurobench` from the previous sitemap now land on the home page rather than the project.
9. Local research artefacts (repo summaries, a shallow clone of `Neurostate`, Lighthouse JSON) are in `.research/`, which is excluded via `.git/info/exclude` and never committed. Delete it when no longer needed. `.claude/launch.json` (preview server config) is also untracked.

## Recommended next steps

1. Review the owner questions in [CV_UPDATE_REPORT.md](CV_UPDATE_REPORT.md) and correct `src/content/profile.ts` where needed.
2. Commit on this branch, push and open a pull request; let Vercel build a preview.
3. Add the Gemini key to the Vercel project (server-side variable) and ask the six example questions on the preview.
4. Review the preview on a real phone; then merge.
5. Follow [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for screenshots, a shared rate limiter, an assistant evaluation set and Playwright smoke tests.
