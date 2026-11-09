# Implementation roadmap

Status key: **Done** = implemented and verified in this branch · **Next** = recommended, not started · **Owner** = needs a decision or information from Samuel.

## Feature evaluation

Scored 1 (low) to 5 (high). "Cost" columns: higher means more expensive.

| Feature | User value | Professional impact | Complexity | Maintenance cost | Performance cost | Decision |
| --- | :-: | :-: | :-: | :-: | :-: | --- |
| A. Featured engineering case studies | 5 | 5 | 3 | 2 | 1 | **Done** — 5 case studies |
| B. Project search and filtering | 4 | 3 | 2 | 1 | 1 | **Done** — compact category toggles + search, URL-shareable |
| C. GitHub-backed project updates | 3 | 3 | 2 | 1 | 0 | **Done** — snapshot script + weekly PR workflow |
| D. Architecture visualisation | 4 | 5 | 2 | 2 | 1 | **Done** — semantic HTML layer diagrams + request flows |
| E. Professional activity timeline | 3 | 3 | 1 | 2 | 0 | **Done** — curated milestones (not a commit feed) |
| F. Recruiter experience | 5 | 5 | 2 | 1 | 0 | **Done** — "At a glance" band, CV download in hero, assistant prompt |
| G. Shareable case studies | 4 | 4 | 2 | 1 | 0 | **Done** — clean URLs, per-page metadata, OG images, JSON-LD |
| H. Validated content model | 5 | 4 | 3 | 1 (reduces) | 0 | **Done** — typed model + `validateContent()` in tests |
| Real screenshots per project | 4 | 4 | 2 | 2 | 2 | **Owner/Next** — needs approved screenshots (private products) |
| Blog / writing section | 2 | 2 | 3 | 4 | 1 | **Deferred** — only revive with original, substantial posts |
| Command palette, games, XP | 1 | −2 | 3 | 3 | 3 | **Removed** |

## Milestones

### M1 — Discovery and audit · Done

- Audit of the existing site and assistant ([CURRENT_PORTFOLIO_AUDIT.md](CURRENT_PORTFOLIO_AUDIT.md)).
- GitHub inventory of 83 repositories plus PosAI ([GITHUB_PROJECT_INVENTORY.md](GITHUB_PROJECT_INVENTORY.md)).

Acceptance: every project on the site traces to a repository and a status wording. ✔

### M2 — Content model and data · Done

- `src/content` typed model; 21 projects; 5 case studies; experience, skills, education, recognition, timeline.
- `validateContent()` with forbidden-identifier scan.

Acceptance: `npm test` passes; no private-repo source links; no internal identifiers. ✔

### M3 — Design system and pages · Done

- Monochrome tokens, Geist fonts, primitives, header/footer, `/`, `/work`, `/work/[slug]`, `/about`, `/resume`, 404.
- Gamification, terminal effects, canvas background, modals and dead code removed.

Acceptance: build passes; no green/colour accents; 375px without horizontal scroll; Lighthouse accessibility 100 on the five main pages. ✔

### M4 — Assistant · Done

- Streaming NDJSON API, retrieval + recommendations, deterministic answers, fallback, prompt-injection neutralisation, body-size fix, telemetry; new panel UI.

Acceptance: assistant unit tests pass; API returns correct statuses; panel answers in browser without a key. ✔ — Live Gemini path **not verified** (no key in this environment).

### M5 — CV · Done

- `/resume` + `public/resume.pdf` (two pages) generated from content.

Acceptance: PDF text matches site data; owner questions listed in [CV_UPDATE_REPORT.md](CV_UPDATE_REPORT.md). ✔

### M6 — SEO, performance, security · Done

- Metadata, canonical URLs, OG images, JSON-LD, sitemap, robots, tightened CSP/headers.

Acceptance: Lighthouse SEO and best practices 100 on measured pages; mobile performance ≥90 on measured pages. ✔ (see final report for the numbers)

## Next steps (prioritised)

| # | Item | Why | Effort | Depends on |
| --- | --- | --- | --- | --- |
| 1 | **Owner review of flagged facts** (cold-store name/dates, independent title, CWA, unverified awards, PosAI naming, phone on CV) | Accuracy is priority #1 | 30 min | Owner |
| 2 | Set Gemini credentials on Vercel and smoke-test the six example questions | Model path untested here | 30 min | Owner (secret) |
| 3 | Deploy the branch as a Vercel preview, review on a real phone, then merge | Visual sign-off | 1 h | Owner approval |
| 4 | Add 1–2 approved screenshots per featured project (`next/image`, AVIF) | Visual proof of work | 0.5 day | Owner-approved images |
| 5 | Shared rate-limit store (Upstash/Vercel KV) | Per-instance limits are a baseline | 0.5 day | Account choice |
| 6 | Golden-question evaluation for the assistant in CI | Catch answer regressions when content changes | 0.5 day | #2 |
| 7 | Enable Vertex Vector Search (`npm run rag:sync`) if paraphrase misses appear in logs | Better recall | 0.5 day | GCP project |
| 8 | Playwright smoke tests (nav, filter, assistant open/close, keyboard) | UI regression safety | 1 day | — |
| 9 | Re-run `npm run github:sync` and review case-study "progress" lists monthly | Keep status honest | ongoing | — |
| 10 | Mining-technology / fleet-management work, if it exists | Requested but no evidence found | — | Owner information |
