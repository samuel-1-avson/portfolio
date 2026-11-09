# Samuel Avornyoh — Portfolio

Personal site of Samuel Maxwell Obeng Avornyoh, software and AI engineer. Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS 4, with a black-and-white design system, case studies built from verified GitHub evidence, a generated résumé, and a streaming portfolio assistant.

Modernization documents live in [`docs/portfolio-modernization/`](docs/portfolio-modernization/) — start with [FINAL_MODERNIZATION_REPORT.md](docs/portfolio-modernization/FINAL_MODERNIZATION_REPORT.md).

## Requirements

- Node.js 20.9 or later (CI uses Node 24)
- npm 10 or later

## Local development

```bash
npm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. On Windows PowerShell, use `npm.cmd` if script execution is disabled.

No environment variables are required. Without AI credentials the assistant answers directly from portfolio data. To enable Gemini answers, set `GEMINI_API_KEY` (or `VERTEX_AI_API_KEY`) in `.env.local`; see [`.env.example`](.env.example) for all options. Keys are read only on the server.

## Editing content

All facts live in [`src/content`](src/content):

| File | What it holds |
| --- | --- |
| `profile.ts` | Profile, about text, experience, education, skills, recognition, timeline |
| `projects.ts` | Every project, its status wording, links and (for featured work) the case study |
| `resume.ts` | Résumé summary and project bullets |
| `generated/github.ts` | Public repository snapshot — regenerate, don't edit |

`npm test` validates the content (slugs, dates, links, private-repo rules, and a scan for internal identifiers). Pages, the résumé, the sitemap and the assistant's knowledge all update from these files.

## Commands

```bash
npm run lint          # ESLint (src, scripts, config)
npm run typecheck     # TypeScript
npm run test          # content + assistant unit tests (node:test)
npm run build         # production build (webpack)
npm run check         # all four
npm run github:sync   # refresh public repo metadata (optional GITHUB_TOKEN)
npm run resume:pdf    # print /resume to public/resume.pdf (needs a running server and Edge/Chrome)
npm run rag:sync      # optional: sync the knowledge base to Vertex AI Vector Search
```

To regenerate the PDF résumé:

```bash
npm run build
npm run start
npm run resume:pdf -- http://localhost:3000
```

## Project structure

- `src/app` — routes (`/`, `/work`, `/work/[slug]`, `/about`, `/resume`), metadata, OG images, `api/chat`
- `src/components` — site chrome, UI primitives, work list/explorer/diagram, assistant panel
- `src/content` — the typed content model (single source of truth)
- `src/lib/assistant` — retrieval, answers, prompt, streaming orchestration, rate limiting
- `scripts` — GitHub sync, résumé PDF, Vector Search sync/verify
- `docs/portfolio-modernization` — audit, inventory, design system, architecture, assistant, CV report, roadmap, final report

## Deployment

Deploy to Vercel or any Node.js host. Set `NEXT_PUBLIC_SITE_URL` to the canonical domain and, optionally, the Gemini variables. CI runs lint, typecheck, tests and build on every push; a weekly workflow opens a pull request when public repository metadata changes.

The `/api/chat` rate limits are in-memory per server instance; use a shared store before high-traffic use.
