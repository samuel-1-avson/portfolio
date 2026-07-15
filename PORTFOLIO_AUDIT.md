# Portfolio Website Audit and 10x Improvement Roadmap

Audit date: July 14, 2026  
Implementation update: July 15, 2026

## Executive summary

The site has a coherent retro-terminal identity, a valid production build, accurate core contact links, and a useful structured portfolio data file. Those are good foundations.

The original audit found substantial reliability, discoverability, mobile navigation, accessibility, and content-hierarchy gaps. Phase 0 and the following foundation work now address the highest-risk engineering and experience issues locally. The remaining professional-quality work is primarily visual evidence: confirmed screenshots, project outcomes, and a production deployment/canary after Gemini quota is enabled.

The main design problem is not a lack of effects. It is that the terminal treatment is repeated everywhere while proof of work, outcomes, screenshots, live demos, education, and achievements are visually underrepresented. The best 10x direction is to keep the terminal aesthetic as a recognizable accent while rebuilding the information hierarchy around credibility, fast scanning, and evidence.

The site has now received a targeted foundation redesign. It preserves the terminal identity as an accent while leading with professional identity, visible proof, clear project status, responsive navigation, and safer interaction.

## Phase 0 implementation status

Phase 0 is implemented and locally verified:

- Migrated the chatbot from the retired `@google/generative-ai` SDK to `@google/genai` and made the model configurable. The current default is the stable, lower-cost `gemini-2.5-flash`.
- Rebuilt chatbot context from `portfolioData`, added an honest structured-data fallback, stopped impersonating Samuel in first person, and added prompt-injection boundaries.
- Added JSON/content-type validation, a 4 KB body limit, an 800-character message limit, same-origin enforcement, per-IP request limiting, a per-instance daily budget, upstream timeout, bounded retries, appropriate HTTP errors, and rate-limit headers.
- Updated the hero chatbot to handle non-200 responses, cap input, prevent duplicate submission, and announce responses accessibly.
- Updated Next.js to 16.2.10 and overrode its vulnerable nested PostCSS with 8.5.10. `npm audit --omit=dev` now reports zero vulnerabilities.
- Corrected all 11 lint errors and 10 warnings. The lint script now explicitly checks the repository and exits cleanly.
- Added a standalone TypeScript gate, four executable chatbot contract tests, a clean-install-compatible lockfile, GitHub Actions quality checks, `.env.example`, and accurate setup/deployment documentation.
- Removed the deceptive fake loading delays from the project, article, and résumé dialogs while resolving their effect-related failures.
- Production build passes with webpack. Turbopack in Next.js 16.2.10 currently panics while emitting `/page`, and Next's internal type worker crashes after the independent `tsc` pass; the build therefore uses webpack and skips the duplicated internal type worker while CI continues to enforce `npm run typecheck` separately.

The supplied local credential is stored only in ignored `.env.local`. End-to-end requests reach Google, but Google returns HTTP 429 for both Gemini 3.5 Flash and Gemini 2.5 Flash. The portfolio fallback returns useful answers with HTTP 200, so the public interaction remains functional, but GCP billing/quota must be enabled or increased before responses will have `source: "gemini"`.

## Phase 1–3 and launch-foundation implementation status

The following work is complete and locally verified:

- Expanded every project record with a stable slug, honest delivery status (`open-source`, `prototype`, or `concept`), Samuel's role, and an optional live-demo URL. No project now silently renders a `#` destination: visitors receive a source link, live demo, or an explicit case-study-request action.
- Surfaced education and recognition from the shared portfolio data, replacing duplicated skill lists with values derived from that data source.
- Rebuilt the hero around Samuel's complete name, focus, location, availability, clear work/résumé actions, and suggested portfolio-assistant questions.
- Added a responsive mobile navigation menu, active-section feedback, address-bar hash updates, and safe scroll-to-section behavior.
- Rebuilt project details as accessible responsive dialogs with titles, Escape close, focus restoration, scroll lock, and mobile bottom-sheet presentation. The résumé dialog now has the same baseline semantics and keyboard behavior.
- Added a visible skip link, semantic text tokens, consistent focus-visible styling, accessible social-link labels, theme state exposure, and reduced-motion rules.
- Removed the JavaScript-only main-content reveal failure. The profile is visible in initial HTML; decorative animation is no longer allowed to hide professional content.
- Updated the ambient canvas to respect reduced motion, pause while the tab is hidden, render at a bounded device-pixel ratio, and operate at roughly 30 FPS rather than an unrestricted redraw loop.
- Added professional metadata, Open Graph/Twitter metadata, `robots.txt`, `sitemap.xml`, and baseline security headers including a CSP, referrer policy, frame policy, permissions policy, and removal of `X-Powered-By`.

Current local checks after this implementation: lint passes with zero findings, TypeScript passes, four chatbot tests pass, and the production webpack build passes. The in-app browser session could not be established, so responsive visual screenshots and keyboard traversal remain the final browser-based validation step once the browser connection is available.

## Deployment status

The portfolio is deployed on Vercel and marked `Production`:

- Live URL: https://portfolio-215choh87-samuel-maxwell-obeng-avornyohs-projects.vercel.app
- Homepage smoke test: HTTP 200
- Sitemap smoke test: HTTP 200
- Security headers: CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options` verified
- Chatbot smoke test: HTTP 200 with portfolio fallback and working contact actions
- Gemini environment variable: not uploaded; the live assistant is intentionally using the safe portfolio fallback until production secret configuration is explicitly authorized and GCP quota is available

## Audit scope and evidence

The audit covered:

- All application, component, data, styling, configuration, and API source files.
- Both résumé PDFs, including visual rendering, extracted content, metadata, and embedded links.
- Production build, TypeScript compilation, lint, dependency security audit, local HTTP behavior, deployed response headers, and the deployed chatbot endpoint.
- All external links referenced by the website and résumé.
- Source-level UI, UX, interaction, accessibility, motion, SEO, security, performance, and maintainability analysis.

The in-app visual browser was unavailable in this session. Responsive screenshots, keyboard traversal, computed layout, and visual regression checks therefore remain a required final validation pass. Findings labeled as source-confirmed or endpoint-confirmed do not depend on that missing pass.

## Current scorecard

These are provisional product-quality scores based on the full source audit and live endpoint tests.

| Area | Score | Summary |
| --- | ---: | --- |
| UI and visual hierarchy | 5/10 | Consistent theme, but repetitive cards, weak proof-of-work visuals, low-contrast text, and little differentiation between important and secondary content. |
| UX and navigation | 4/10 | Clear desktop sections, but no mobile navigation, inaccessible modals, fake loading delays, weak project destinations, and limited recruiter-oriented scanning. |
| Animation and motion | 4/10 | On-brand effects, but continuous canvas work, no reduced-motion mode, no visibility pause, and content that initially renders hidden. |
| Interaction | 4/10 | Theme, modals, and forms exist, but focus management, URL state, failure handling, and mobile interaction are incomplete. |
| AI chatbot | 1/10 | Production request fails; retired model and legacy SDK; no rate limit, validation, citations, conversation history, or resilient fallback. |
| Accessibility | 3/10 | Semantic landmarks exist, but contrast, focus visibility, modal semantics, labels, motion preferences, and list semantics require substantial work. |
| Content and credibility | 5/10 | Strong breadth of experience, but outcomes, evidence, education, awards, case studies, and project status are not presented effectively. |
| SEO and discoverability | 3/10 | Only a basic title and generic description; no social metadata, canonical URL, structured data, sitemap, robots policy, or project-specific pages. |
| Engineering quality | 4/10 | Production build passes, but lint fails, no tests exist, dependencies are vulnerable, data is duplicated, and much of the source is disconnected dead code. |

## What is already working well

- The production homepage and résumé return HTTP 200.
- The production build completes successfully with Next.js static generation.
- Core identity, experience, skills, and project information is centralized in [`src/data/portfolio.ts`](src/data/portfolio.ts), even though other files still duplicate it.
- GitHub project URLs, the GitHub profile, article sources, résumé portfolio URL, and Kaggle award links resolve successfully.
- The résumé is visually clean, tagged, readable, and contains working link annotations.
- External links rendered as anchors generally use `noopener noreferrer`.
- The light/dark theme variables provide a usable foundation for a stronger design system.
- The main content has proper `main`, `section`, navigation, heading, and footer landmarks.

## Priority 0: release-blocking findings

### 1. The production chatbot is broken

Evidence:

- A real request to `https://samuel-seven-gamma.vercel.app/api/chat` returned the generic failure response.
- [`src/app/api/chat/route.ts`](src/app/api/chat/route.ts#L122) calls `gemini-1.5-flash`, which has been shut down.
- The project uses `@google/generative-ai`, which Google classifies as a legacy, unmaintained JavaScript SDK. Google recommends `@google/genai` and a current model such as `gemini-3.5-flash`.
- The hero's fallback tells visitors to try commands such as `whoami` and `projects`, but those commands only exist in an unused [`Chatbot.tsx`](src/components/Chatbot.tsx). The shipped hero chatbot sends every message to the failed API, so the suggested recovery does not work.

Recommended fix:

- Migrate to `@google/genai` and a current stable model.
- Add an environment-variable model setting so future retirement does not require code surgery.
- Return honest non-200 statuses for invalid input, missing configuration, upstream timeouts, and upstream failures.
- Provide a working local structured-data fallback for portfolio questions.
- Add a production smoke test that asks one known question after deployment.

References: [Google GenAI SDK migration guide](https://ai.google.dev/gemini-api/docs/migrate), [Gemini model deprecations](https://ai.google.dev/gemini-api/docs/deprecations), and [Gemini API libraries](https://ai.google.dev/gemini-api/docs/libraries).

### 2. Production dependencies have known vulnerabilities

`npm audit --omit=dev` reports:

- One high-severity vulnerability group affecting the installed Next.js version.
- One moderate PostCSS vulnerability inherited through Next.js.
- The audit currently recommends moving from Next.js 16.1.1 to 16.2.10.

Not every advisory is necessarily reachable in this application or Vercel deployment, but the supported response is still to patch and regression-test the framework immediately.

### 3. The chatbot endpoint is open to abuse and malformed traffic

[`src/app/api/chat/route.ts`](src/app/api/chat/route.ts#L104) has no schema validation, input length limit, rate limit, origin policy, timeout, abuse control, or request budget. Any caller can consume the Gemini quota when the endpoint is restored. Invalid JSON is caught as an upstream-style error and returned with HTTP 200, which hides operational failures.

Recommended minimum controls:

- Validate `{ message: string }`, trim it, and cap it at approximately 500-1,000 characters.
- Add per-IP sliding-window rate limiting and a global daily budget guard.
- Add an upstream timeout with `AbortSignal` and bounded retries only for transient errors.
- Emit structured error logs without storing full user messages.
- Return `400`, `413`, `429`, `500`, `502`, and `503` where appropriate.

### 4. The quality gate fails

`npm run lint` reports 11 errors and 10 warnings. The most important include:

- A conditional hook call in [`Chatbot.tsx`](src/components/Chatbot.tsx#L87), violating React's rules of hooks.
- State updates directly inside several effects.
- A component declared during render in [`SystemMonitor.tsx`](src/components/visuals/SystemMonitor.tsx#L23).
- Cleanup/ref and unused-code warnings across effects and visuals.

The build passes because lint is not part of the build gate. CI should require lint, typecheck, unit tests, and production build independently.

## Priority 1: user-facing findings

### Mobile navigation is missing

Every navigation link is hidden below the `sm` breakpoint in [`Navbar.tsx`](src/components/layout/Navbar.tsx#L48), leaving only the long full-name logo and theme button. The logo is likely to collide or wrap on narrow screens.

Fix with a real mobile menu, a shorter brand mark such as `samuel_`, a 44-pixel touch target, Escape/outside-click handling, focus containment, and active-section feedback.

### Important personal information is never displayed

The data file includes education, awards, languages, phone, and full project information, but the page never renders education or awards. The hero only shows the first name. This weakens the site's value as a professional profile.

Recommended content hierarchy:

1. Full name, focused role statement, location, availability, and primary CTA.
2. Three quantified proof points.
3. Two or three flagship case studies.
4. Experience and education timeline.
5. Skills supported by project evidence.
6. Awards and leadership.
7. Writing/notes and contact.

### Project cards lack evidence and destinations

Five of nine projects use `link: "#"` and silently render without an action. Four projects link to GitHub. None has a dedicated case-study route, and the existing Music Companion live deployment (`https://music-companion-seven.vercel.app`) is not surfaced even though it returns HTTP 200.

Each serious project should have:

- Problem, audience, personal role, constraints, architecture, and outcome.
- Screenshots or a short product clip.
- Measurable result or honest project status.
- Source, live demo, documentation, or a clear `Private / case study available` label.
- A stable slug and shareable project page.

### The interface overuses terminal chrome

Almost every section and card uses the same `cat`, `ls`, border, monospace, and green-accent grammar. This creates visual sameness and makes senior-level work feel like a themed component gallery.

Keep the terminal language for the navigation, chatbot, labels, and micro-interactions. Use stronger editorial typography, project imagery, diagrams, metrics, and varied layouts for the main narrative.

### Modals are not accessible dialogs

[`ResumeModal.tsx`](src/components/ResumeModal.tsx), [`ProjectModal.tsx`](src/components/ProjectModal.tsx), and [`BlogModal.tsx`](src/components/BlogModal.tsx) lack:

- `role="dialog"`, `aria-modal`, and an accessible title.
- Initial focus, focus trapping, Escape-to-close, and focus restoration.
- Background inertness and body-scroll locking.
- Responsive bottom-sheet behavior for small screens.

They also add artificial loading animations even though no content is being fetched. This delays the visitor without providing value and can mislead users with messages such as `fetching from github.com`.

### Color contrast fails in the default light theme

Against `#fdfbf7`, the main foreground at common opacity levels produces approximately:

- 60%: 4.54:1, barely meeting normal-text AA.
- 50%: 3.33:1, failing normal-text AA.
- 40%: 2.50:1, failing.
- 30%: 1.93:1, failing.
- Tailwind green-600 text: approximately 3.19:1, failing for normal text.

The site frequently uses 30-50% text and small green text. Introduce named semantic text tokens with verified contrast instead of opacity-based color styling.

### Keyboard and screen-reader support is incomplete

- There is no skip link.
- Inputs remove outlines without adding a consistent `:focus-visible` replacement.
- Social icon links rely on `title` and have no dependable accessible names.
- Experience bullets are rendered as glyphs inside paragraphs instead of semantic lists.
- Chat responses are not announced through an `aria-live` region.
- Theme state is not exposed with `aria-pressed` or an equivalent stateful label.
- Hash navigation prevents the default link action and does not update the URL/history.

### Motion does not respect the user or device

The shipped page combines a continuous full-viewport canvas, scanlines, pulses, a typewriter, section reveals, and theme transitions. There is no `prefers-reduced-motion` mode.

[`MLBackground.tsx`](src/components/visuals/MLBackground.tsx) redraws the viewport on every animation frame, does not pause when the page is hidden, does not scale for device pixel ratio, and reads theme state inside every frame. This can waste power and look blurry on high-density screens.

Recommended motion rules:

- Motion must explain hierarchy or acknowledge an action.
- Pause canvas work when hidden and reduce to 24-30 FPS where continuous animation remains.
- Render at bounded device pixel ratio.
- Disable nonessential motion under reduced-motion preferences.
- Never hide core content until JavaScript decides to reveal it.

### Core content initially renders invisible

[`src/app/page.tsx`](src/app/page.tsx#L39) server-renders the main content with `opacity-0`. Every later section also server-renders hidden through [`RevealOnScroll.tsx`](src/components/effects/RevealOnScroll.tsx#L62). If hydration or `IntersectionObserver` fails, most of the page remains invisible. The typewriter also server-renders an empty professional tagline.

The default HTML should be complete and visible. Enhancement code may animate from a safe state only after the client is confirmed ready.

## AI chatbot product audit

The chatbot should become a reliable portfolio guide, not a generic novelty prompt box.

### Current weaknesses

- The production integration fails.
- The assistant is instructed to impersonate Samuel in first person instead of clearly identifying itself as Samuel's portfolio assistant.
- Context is duplicated manually in the API route, creating drift from `portfolioData`.
- NeuroBench is described as having `90+` IPC commands in one place and `285+` in another.
- There is no conversation history, streaming, source citation, clickable project result, suggested question, feedback control, or retry action.
- The hero clears the user's question and displays only one response, so conversational context is lost.
- Concurrent submissions are not disabled or cancelled, allowing races and duplicated requests.
- A long answer can expand the hero and cause a large layout shift.
- Static command support exists in an unused component but is not connected to the shipped interface.
- Prompt injection is not isolated; user text is directly appended to the system context.
- The route may answer unsupported questions in Samuel's voice, which risks false claims.

### Recommended chatbot architecture

1. Generate the knowledge context from the same typed portfolio data used by the UI.
2. Identify as `Samuel's portfolio assistant`, not Samuel.
3. Answer only from approved portfolio facts and attach source actions such as `Open project`, `View experience`, or `Email Samuel`.
4. Use deterministic local answers for contact, skills, experience, and project listings; call the model only for synthesis.
5. Stream responses with a visible stop action and a bounded scroll region.
6. Add suggested prompts: `Which projects best show AI engineering?`, `Summarize Samuel's Rust experience`, and `How can I contact Samuel?`.
7. Add validation, rate limiting, timeout, monitoring, and a current-model canary test.
8. Preserve privacy by avoiding message persistence unless a clear notice and purpose are added.

## Content and résumé audit

### Consistency findings

- `public/resume.pdf` and the root CV PDF are byte-for-byte identical. Keep a single source and generate/copy the public artifact during the content workflow.
- The résumé's experience order is not chronological: the 2023 internship appears between 2026 and 2025 roles.
- The résumé omits the November 2025 education date that exists in the site data.
- The résumé contains the misspellings `ACHEIVEMENTS` and `Hackation`.
- The résumé only shows the Google DeepMind/Kaggle achievement, while the chatbot context contains two additional awards/leadership claims. These may be valid but should be reconciled into one approved source of truth.
- The page does not render any awards or education even though both are available in the data file.
- `Latest Thoughts` contains only two entries from December 2023.
- The Video Fingerprinting item presents an external 2009 paper by Jian Lu as a full post. It should be labeled as a reading/research note with explicit author, paper, DOI/source attribution, and a separate link to Samuel's implementation.

### Credibility improvements

- Replace broad claims with outcome-based statements where evidence exists.
- Add dates, team size, responsibilities, constraints, and measurable results to flagship projects.
- State `prototype`, `concept`, `private`, `in progress`, or `production` explicitly.
- Add repository descriptions, topics, licenses, screenshots, and live demos on GitHub; several linked repositories currently have minimal or null descriptions and no license metadata.
- Avoid presenting fake live metrics, randomly generated accuracy, system load, or training data as real unless clearly labeled `simulation`.

## SEO and sharing findings

[`src/app/layout.tsx`](src/app/layout.tsx#L18) only defines the name and the generic description `A minimal retro portfolio website.`

Add:

- A keyword-rich title template and a specific professional description.
- Canonical deployment URL.
- Open Graph and Twitter metadata with a branded social image.
- `Person`, `WebSite`, and `CreativeWork` JSON-LD.
- `sitemap.ts`, `robots.ts`, and dedicated project metadata.
- A branded favicon and icon set.
- Descriptive project URLs instead of modal-only state.

## Security and platform findings

- The deployed site provides HSTS through Vercel.
- The deployed response did not include a Content Security Policy, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, or a framing policy.
- `next.config.ts` has no security-header policy and does not explicitly disable `X-Powered-By` for non-Vercel hosting.
- The AI route needs request-size, rate, timeout, and cost controls.
- The production build depends on fetching Google Fonts. Self-hosted local font files would make builds more reproducible and reduce third-party build dependency.

Apply a tested CSP using `frame-ancestors`, restrict unnecessary browser capabilities, and ensure the résumé iframe remains allowed by the chosen policy.

## Maintainability and performance findings

- The entire page is a client component, and several static sections are marked `use client` without needing hooks. Convert static sections back to server components and keep small client islands for theme, chatbot, and dialogs.
- Profile and skills content is duplicated across `portfolio.ts`, `AboutSection.tsx`, `SkillsSection.tsx`, `Chatbot.tsx`, and the API prompt.
- `SkillsSection.tsx` is not rendered and contains a likely `LLOps` typo.
- The full terminal chatbot, gamification provider, XP bar, achievement toast, boot sequence, terminal window, and most visual components are disconnected from the shipped page.
- [`LiveGraph.tsx`](src/components/visuals/LiveGraph.tsx#L156) restarts its animation effect whenever mouse position changes and does not track subsequent animation-frame IDs correctly, which would cause severe animation-loop leakage if connected.
- The max-level XP calculation can produce a zero denominator and `NaN` at exactly 4,500 XP.
- The repository still contains unused Create Next App SVG assets.
- The README is the default Create Next App text, references the wrong source path, and describes Geist even though the project uses Inter and Space Mono.
- There are no unit, integration, accessibility, or end-to-end tests and no test script.

## Link audit

Website links:

- GitHub profile: valid.
- Neurostate, Music Companion, Healthcare Appointments, Sign Language Detection, and Video Fingerprinting repositories: valid.
- ResearchGate and IBM article sources: valid.
- LinkedIn: the exact URL is consistent across the site and résumé, but anonymous automated requests are redirected to LinkedIn's auth wall and return 999, so it requires a manual signed-in click check.
- Five project records intentionally use `#` and provide no visitor destination.
- Music Companion exposes a valid live Vercel deployment that the portfolio does not link.

Résumé links:

- Email, GitHub, deployed portfolio, Kaggle winners page, and Kaggle Neurostate write-up resolve.
- LinkedIn has the same auth-wall limitation noted above.

## Verification results

| Check | Result |
| --- | --- |
| `npm run build` | Pass on Next.js 16.2.10 with webpack after allowing the configured Google Font downloads. |
| `npm run typecheck` | Pass as an independent CI gate. |
| `npm run lint` | Pass: zero errors and zero warnings. |
| `npm audit --omit=dev` | Pass: zero vulnerabilities. |
| `npm run test` | Pass: four chatbot validation and fallback tests. |
| Local homepage | HTTP 200. |
| Deployed homepage | HTTP 200. |
| Local chatbot API contract | Homepage 200, invalid JSON 400, same-origin violation 403, valid chat 200, and excess requests 429 with `Retry-After`. |
| Local chatbot with supplied key | Google returns 429 quota errors; the verified portfolio-data fallback returns HTTP 200. |
| Deployed chatbot | Still runs the pre-Phase-0 release until these changes are deployed. |
| External links | All tested destinations resolve except LinkedIn's expected anonymous auth wall; five projects have no destination by design. |
| Résumé visual review | Clean rendering; content/order/typo issues noted above. |
| Responsive visual and keyboard pass | Pending because the in-app visual browser was unavailable. |

## Recommended 10x design direction

Use a `precision systems portfolio` direction:

- Preserve cream/ink and OLED dark themes, Space Mono accents, green status color, and restrained terminal prompts.
- Introduce an editorial sans-serif hierarchy for reading and use monospace only for metadata and controls.
- Lead with credibility: full identity, current focus, availability, location, and quantified proof.
- Turn flagship work into visual case studies with architecture, screenshots, results, and live/source actions.
- Use diagrams and real artifacts from Samuel's projects instead of ambient fake dashboards.
- Treat motion as system feedback: fast entrance choreography, tactile button states, section progress, and optional project demos.
- Make the chatbot a compact, source-backed assistant that can navigate the portfolio.

## Phased implementation plan

### Phase 0: stabilize production

Estimated effort: 1-2 days.

- Patch Next.js/PostCSS and migrate to the current Gemini SDK/model.
- Add chatbot validation, rate limiting, timeout, error statuses, and a structured fallback.
- Fix every lint error and add `lint`, `typecheck`, `test`, and `build` CI gates.
- Add `.env.example` and accurate setup/deployment documentation.

### Phase 1: establish one source of truth

Estimated effort: 1-2 days.

- Expand the portfolio schema with project slug, status, role, dates, outcomes, metrics, images, demo, source, and case-study sections.
- Derive UI and chatbot context from that schema.
- Reconcile résumé, education, awards, project metrics, and employment ordering.
- Remove duplicate/dead content sources and unused starter assets.

### Phase 2: rebuild UI and UX hierarchy

Estimated effort: 3-5 days.

- Redesign the hero, mobile navigation, proof strip, project case studies, experience/education timeline, awards, and contact CTA.
- Replace fake loading modals with accessible dialogs or dedicated routes.
- Add responsive project media and the Music Companion live demo.
- Introduce a tested color/typography/spacing/focus token system.

### Phase 3: rebuild interaction and motion

Estimated effort: 2-3 days.

- Implement reduced motion, visibility-aware animation, bounded canvas rendering, and safe no-JavaScript defaults.
- Add active navigation state, hash/history correctness, keyboard behavior, and polished focus/hover/press states.
- Remove disconnected animation systems or integrate only the few that materially support the story.

### Phase 4: ship the portfolio assistant

Estimated effort: 2-4 days.

- Build source-backed local answers plus model synthesis.
- Add streaming, suggested prompts, history, citations/actions, retry/stop, and accessible announcements.
- Add monitoring for error rate, latency, token use, rate-limit events, and model retirement.
- Add production canary and abuse tests.

### Phase 5: quality, SEO, and launch

Estimated effort: 1-2 days.

- Add component/unit tests plus end-to-end desktop/mobile, keyboard, dialog, theme, links, résumé, and chatbot tests.
- Add metadata, JSON-LD, sitemap, robots policy, security headers, and branded social imagery.
- Run visual regression, Lighthouse, accessibility, reduced-motion, low-end-device, and cross-browser checks.

Total estimated effort: approximately 10-18 focused development days, depending on how many project screenshots, metrics, and case-study details are ready.

## Definition of done

The 10x version should not be considered complete until:

- Production chatbot success is monitored and its known-question canary passes.
- Lint, typecheck, tests, build, and dependency audit pass in CI.
- No project silently uses `#`; every project has an honest status and action.
- All key pages work at 320, 375, 768, 1024, and 1440-pixel widths.
- Keyboard-only navigation, visible focus, dialogs, theme, and chatbot pass accessibility review.
- Normal text meets WCAG AA contrast and reduced-motion users receive a stable experience.
- Core content is visible and useful without client JavaScript.
- Mobile Lighthouse targets are at least 90 for performance, accessibility, best practices, and SEO, with LCP below 2.5 seconds, INP below 200 milliseconds, and CLS below 0.1 under the agreed test profile.
- Every flagship project includes a problem, personal role, implementation, outcome, and evidence.

## Recommended first implementation batch

Start with the highest-leverage vertical slice:

1. Patch dependencies and restore the production chatbot safely.
2. Create the single portfolio content schema and remove AI/context duplication.
3. Rebuild the hero and first two project case studies with mobile navigation.
4. Add the accessible dialog, focus, contrast, and reduced-motion foundation.
5. Establish CI and production smoke tests before continuing the visual rebuild.

This sequence fixes trust and reliability first, then makes the new visual system reusable for the rest of the site.
