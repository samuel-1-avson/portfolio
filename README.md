# Samuel Avornyoh — Portfolio

A personal portfolio for Samuel Maxwell Obeng Avornyoh, built with Next.js, React, TypeScript, and Tailwind CSS.

## Requirements

- Node.js 20.9 or later
- npm 10 or later

## Local development

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

The chatbot works with a structured portfolio-data fallback by default. To enable Gemini synthesis, add a Gemini API key to `.env.local`:

```dotenv
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
```

`GEMINI_MODEL`, `CHAT_RATE_LIMIT_PER_MINUTE`, and `CHAT_DAILY_LIMIT` are optional operational controls documented in [`.env.example`](.env.example). Do not expose `GEMINI_API_KEY` to the browser or commit it to source control.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

The test suite verifies the chatbot input contract and its portfolio-data fallback. GitHub Actions runs all four checks for every push and pull request.

## Deployment

Deploy to Vercel or another Node.js-compatible Next.js host. Add the same environment variables in the host's project settings. The `/api/chat` route uses an in-memory, per-instance request limit as a baseline safeguard; use a shared rate-limit store before a high-traffic launch.

## Project structure

- `src/app` — application routes, global styles, and the chat API
- `src/components` — portfolio sections, dialogs, layout, and visual effects
- `src/data/portfolio.ts` — current portfolio facts used by the UI and fallback assistant
- `src/lib/portfolio-chat.ts` — chatbot validation, context, and fallback responses
