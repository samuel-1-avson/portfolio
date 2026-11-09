# Current portfolio audit

Audit date: 9 November 2026 · Branch audited: `main` at `f04566c` · Auditor: Claude Code (Opus 5.5)

This document records the state of the portfolio **before** the modernization on branch `feat/portfolio-modernization`. Every finding below was confirmed by reading the source, running commands, or requesting the live URL. Findings carried over from the earlier `PORTFOLIO_AUDIT.md` (July 2026) are marked *(prior audit)* and were re-checked.

## 1. Architecture and stack

| Area | Finding |
| --- | --- |
| Framework | Next.js 16.2.10 (App Router), React 19.2.3, TypeScript 5.9, Tailwind CSS 4.1. Built with `next build --webpack` because Turbopack panicked on `/page` *(prior audit)*. |
| Rendering | `src/app/page.tsx` is a single `"use client"` page. Every section ships as client JavaScript even when static. |
| Routes | One page (`/`), `/api/chat`, `robots.txt`, `sitemap.xml`. Projects, writing and the résumé are modal-only — there are no shareable URLs. |
| Data | `src/data/portfolio.ts` holds profile, skills, education, experience, ten projects and awards. Blog posts live inline in `BlogSection.tsx`; coursework and expertise copy are duplicated inside `AboutSection.tsx`. |
| Backend | One route handler, `/api/chat`, using `@google/genai` (Gemini 2.5 Flash by default) with Vertex express / developer-key / service-account modes. |
| Retrieval | Local TF-IDF + cosine retrieval in `src/lib/portfolio-rag.ts`; optional Vertex AI Vector Search 2.0 (`src/lib/vertex-vector-search.ts`, `scripts/sync-vector-search.ts`). |
| Tests | One file, `src/lib/portfolio-chat.test.ts` (node:test, 10 cases) covering chat validation, fallback text and retrieval. No UI tests. |
| CI | `.github/workflows/ci.yml` runs lint, typecheck, test and build on every push. |
| Hosting | Vercel. Canonical production URL `https://samuel-seven-gamma.vercel.app` (HTTP 200, verified). |
| Security headers | `next.config.ts` sets CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, and disables `X-Powered-By`. |

## 2. Visual identity

- Cream/ink light theme (`#fdfbf7`) and OLED dark theme, with **green as the dominant accent** (`text-green-600`, `bg-green-500`, `--terminal-green`) used on nearly every heading, button, label and bullet.
- Additional cyan, amber, red and purple "terminal" tokens, glow shadows, CRT/scanline overlays, glitch text, matrix-rain keyframes and a 1px grid backdrop.
- Monospace (Space Mono) is used for body copy almost everywhere, which reduces readability for long text.
- Contrast: `text-green-600` on the cream background measures about 3.2:1 and fails WCAG AA for normal text; `/40`, `/50` opacity text also fails *(prior audit, still present in `BlogSection`, `HeroSection`, `ConnectSection`)*.
- The footer is hard-coded `bg-[#1a1a1a]` with green hover states.

**Decision:** replace entirely with the black-and-white system in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## 3. Gamification and novelty features (shipped)

| Component | Behaviour | Decision |
| --- | --- | --- |
| `gamification/GamificationProvider.tsx`, `lib/gamification.ts` | XP, levels, unique-project tracking, achievements persisted to `localStorage` | Remove |
| `gamification/XPBar.tsx`, `AchievementToast.tsx`, `AchievementsModal.tsx`, `icons/AchievementIcons.tsx` | XP bar, "achievement unlocked" toasts, achievements modal | Remove |
| `effects/KonamiListener.tsx` | Konami code toggles a green "hacker mode" body class | Remove |
| `effects/Scanlines.tsx` | Full-screen scanline overlay in the root layout | Remove |
| `effects/Typewriter.tsx`, `GlitchText.tsx` | Typewriter tagline (server-renders empty), glitch hover | Remove |
| `visuals/MLBackground.tsx` | Full-viewport canvas "3D organic wave & particle constellation" running at ~30 FPS | Remove |
| Hero chat | Adds 20 XP per question; fakes streaming with a 15 ms `setInterval` | Replace |

## 4. Dead code (not rendered anywhere)

`Chatbot.tsx` (296 lines), `terminal/BootSequence.tsx`, `terminal/TerminalWindow.tsx`, `visuals/DataFlowPipeline.tsx`, `LiveGraph.tsx`, `MatrixRain.tsx`, `NeuralBackground.tsx`, `NeuralNetwork.tsx`, `ObjectDetection.tsx`, `SystemMonitor.tsx`, `TrainingLog.tsx`, `layout/RetroContainer.tsx`, `sections/SkillsSection.tsx`, plus the Create Next App SVGs in `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`). Roughly 2,000 lines of unused UI. `terminal/CommandPaletteModal.tsx` is wired into the navbar but duplicates plain navigation.

## 5. Content accuracy

Cross-checked against the GitHub repositories (see [GITHUB_PROJECT_INVENTORY.md](GITHUB_PROJECT_INVENTORY.md)):

| Item on the current site | Evidence | Problem |
| --- | --- | --- |
| "Chain Registry Ecosystem … ERC-721/1155 anchors on Ethereum/Polygon … Zero-Knowledge & ECDSA state proof validation … multi-signature registry voting" | `chain-registry-blockchain-CREG-` README and `docs/PROTOCOL_PROGRESS.md` | **Inaccurate.** CREG is a validator-consensus package registry (Rust, libp2p, PBFT, IPFS, Sepolia staking/registry/governance contracts). No ERC-721/1155 or Polygon. The repo itself states it is a public alpha with no live public network. |
| CREG links point to `contribute.cregnet.dev` | Repo README | That is the **Contribution Arena** (education app), not the protocol. The protocol repo is public and is not linked. |
| "ProxyHub … Go, Python, React … usage-based billing" | `ProxySocialHub` README | Understated and partly wrong. It is a Solana-escrow proxy marketplace: Go control plane, **Rust** edge gateway and provider daemon, Anchor programs, Next.js, MV3 extension, three SDKs. No GitHub link was shown even though the repo was public (MIT) at audit time. *(The owner made it private later on 9 Nov 2026; the new site links only the live product and docs.)* |
| "Crypto POS Payment System — concept" | `crypto-payment-system` (BitMomo) | **Badly understated.** BitMomo is 9 months and ~400 commits of work: 13 Rust crates, four Next.js portals, two Expo apps, 140+ migrations, a GCP testnet deployment and a live marketing site. |
| CipherVault | — | **Missing entirely.** Public repo, v1.0.32, live dashboard. |
| CREG, PosAI, SMS AI, Agentic QA platform, Generator Sound Health Monitor rebuild | — | Missing. |
| NeuroBench "90+ IPC commands" (projects) vs "285+" (details, blog) | `Neurostate/neurobench/src-tauri` | Inconsistent. The repo has **294** `#[tauri::command]` handlers in 234 Rust files. "150+ frontend components" is wrong (96 TS/TSX files). |
| "Web3 Gaming Arcade … play-to-earn/reward workflows" | `Arcade` (private) | Play-to-earn is not evidenced; the repo shows Solana wallet sign-in and Firebase. The `arcade-gaming-hub.vercel.app` homepage returns 404; `arcade-7f03c.web.app` returns 200. |
| Award: "First Place: CodeAfrique … Robotics" and "IT President …" | No evidence in repos or CV | Unverified. Kept out of the public site pending confirmation. |
| Blog posts dated July 2026 ("we architected …") | — | Written in a team voice, repeat the unverified "285+" claim, and two 2023 entries summarise other people's articles. Low value; removed (recoverable from git history). |
| `/sitemap.xml` | `src/app/sitemap.ts` | Lists `/blog`, `/connect` (both 404) and `/#projects-*` hash URLs that search engines ignore. |

## 6. AI assistant (as found)

| Question | Answer |
| --- | --- |
| Model/provider | Google Gemini via `@google/genai`; `GEMINI_MODEL` default `gemini-2.5-flash`; Vertex express key, developer key or ADC/service account. |
| Frontend ↔ backend | `fetch("/api/chat")` with `{ message, history }`, JSON response. |
| Streaming | **No.** The server returns one JSON blob; the client simulates typing with `setInterval`, which delays the answer and announces every 15 ms update to screen readers. |
| Knowledge | Local TF-IDF over profile, projects (overview + `details` chunks), experience, education and awards. Optional Vertex Vector Search. Knowledge inherits the content inaccuracies above. |
| Hard-coded answers | Regex fallback (`getPortfolioFallback`) used when no key is configured or Gemini fails. Fallback ignores retrieval for most questions. |
| Memory | Client keeps messages in component state; last six sent as history; nothing persisted. Only the latest answer is shown. |
| Security | Good baseline: same-origin check, JSON/content-type and 4 KB body limits, 800-char message cap, history validation, per-IP minute limit and per-instance daily budget, 10 s upstream timeout, prompt-injection rules. Gaps: rate limiting is in-memory per instance; `content-length` is trusted (a chunked body bypasses the 4 KB check); `x-forwarded-for` is trusted as-is; no request IDs or latency logging. |
| Reliability | If Gemini fails the visitor still gets a fallback (good). No stop/retry control. |
| UX | Assistant is embedded in the hero; long answers push the layout; green terminal styling; XP side-effect. |

## 7. Accessibility, performance and SEO

- **Accessibility:** skip link, landmarks and dialog semantics exist *(prior audit fixes)*. Remaining: low-contrast green and opacity text; monospace body copy; fake-typing live region; decorative canvas and scanlines on every page.
- **Performance:** whole page is a client component; a continuous canvas animation; Google Fonts fetched at build time (Inter + Space Mono). No Lighthouse baseline was recorded previously.
- **SEO:** good title/description/OG basics and `Person` JSON-LD, but no canonical URL/`metadataBase`, no OG image, no per-project URLs or metadata, and an inaccurate sitemap.

## 8. CV / résumé

- `public/resume.pdf` is byte-identical to `Samuel Maxwell Obeng Avornyoh CV (3).pdf` *(prior audit)*.
- Content issues: experience out of order, "ACHEIVEMENTS"/"Hackation" typos, BitMomo described as a "concept", CipherVault/CREG/PosAI absent, CWA shown on the CV but deliberately removed from the website on 1 Aug 2026 (`c412501`).
- Details in [CV_UPDATE_REPORT.md](CV_UPDATE_REPORT.md).

## 9. Keep / redesign / remove / add

| Keep and improve | Redesign | Remove | Add |
| --- | --- | --- | --- |
| Next.js 16 + Tailwind 4 stack | Entire visual system (black and white) | All gamification, Konami/hacker mode, scanlines, canvas background, typewriter, glitch | Shareable project case-study routes `/work/[slug]` |
| `/api/chat` safeguards and Gemini integration | Information architecture (multi-page, minimal nav) | Dead terminal/visual components and starter SVGs | Project filter and search |
| Local retrieval + optional Vertex Vector Search | Assistant UI (dedicated panel, real streaming) | Blog section and modals | Typed, validated content model |
| Security headers, CI gates | Project content (rebuilt from GitHub evidence) | Command palette | HTML résumé page + regenerated PDF |
| Structured data | Experience/skills presentation | Inaccurate claims | GitHub metadata snapshot + scheduled sync |
| — | Sitemap (real URLs) | — | Per-page metadata, OG images, canonical URLs |

## 10. Risks observed

1. The site currently under-sells the strongest work (BitMomo, ProxyHubb, CipherVault, CREG) and over-states weaker items.
2. Private repositories (BitMomo, PosAI, TonyCon, Agentic QA, Arcade, Betting arbitrage, CREG Arena) contain infrastructure identifiers (cloud project IDs, IPs, VM names). These must never reach the public site or the assistant's knowledge base.
3. The assistant can only be as accurate as its knowledge; fixing the content is a prerequisite for fixing the assistant.
