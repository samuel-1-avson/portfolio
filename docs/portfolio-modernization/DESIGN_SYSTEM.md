# Design system — monochrome

The portfolio uses a strict black-and-white identity. Hierarchy comes from type scale, weight, spacing, hairlines and inversion — never from colour. Source of truth: [`src/app/globals.css`](../../src/app/globals.css) and [`src/components/ui/primitives.tsx`](../../src/components/ui/primitives.tsx).

## Principles

1. **Evidence first.** Layouts make the work and its status easy to scan; nothing decorative competes with it.
2. **Black and white only.** White page, black ink, black bands with white ink. Neutral greys are used for secondary text and hairlines only — never for surfaces or fills.
3. **One accent: inversion.** Emphasis is a filled black button, a black band, or an underline. No green, gradients, glow, glass or neon.
4. **Content is visible without JavaScript or motion.** Animation only enhances; the page is complete with every animation disabled.
5. **Monospace is metadata.** Geist Mono marks labels, indices, dates and status — never paragraphs.

## Tokens

Tokens are CSS custom properties exposed to Tailwind through `@theme inline`, so utilities such as `bg-bg`, `text-muted` and `border-line` adapt automatically.

| Token | Light | Dark | Use | Contrast (on its background) |
| --- | --- | --- | --- | --- |
| `--bg` | `#FFFFFF` | `#000000` | Page background | — |
| `--fg` | `#000000` | `#FFFFFF` | Primary text, filled buttons, strong rules | 21:1 |
| `--muted` | `#525252` | `#B3B3B3` | Body copy in long passages, secondary text | 7.8:1 / 10:1 |
| `--subtle` | `#6B6B6B` | `#8F8F8F` | Labels, metadata, captions | 5.3:1 / 6.5:1 |
| `--line` | `#E5E5E5` | `#262626` | Hairline separators | decorative |
| `--line-strong` | `#000000` | `#FFFFFF` | Section rules, outlined buttons, diagram frames | — |

All text tokens pass WCAG 2.2 AA for normal-size text in both themes.

**Inverted bands.** Adding `.inverted` to any element flips every token inside it (black background, white text). Components need no special variants. In dark mode, inverted bands become white.

**Themes.** Light is the default. A visitor can switch to dark with the header toggle; the choice is stored in `localStorage` and applied by a tiny pre-paint script to avoid a flash. The site does not auto-switch on `prefers-color-scheme`, by design (light-first).

## Typography

| Role | Family | Size | Notes |
| --- | --- | --- | --- |
| Display (`text-display`) | Geist Sans 600 | `clamp(2.6rem, 1.4rem + 5.2vw, 5.5rem)` | line-height 1.02, tracking −0.04em, `text-wrap: balance` |
| Title (`text-title`) | Geist Sans 600 | `clamp(1.9rem, 1.3rem + 2.4vw, 3.1rem)` | section titles |
| Lede (`text-lede`) | Geist Sans 400 | `clamp(1.15rem, …, 1.4rem)` | introductions |
| Body | Geist Sans 400 | 17px / 1.65 | `text-wrap: pretty`, max ~68ch (`.prose-body`) |
| Label (`.label`) | Geist Mono 400 | 12px, uppercase, 0.08em | eyebrows, metadata, indices |
| Tag | Geist Mono 400 | 11.5px | technologies |

Fonts are self-hosted through the `geist` package (`next/font/local`), so builds do not depend on Google Fonts and there is no third-party font request.

## Layout and spacing

- Container: `max-w-6xl` with a 16px gutter on phones, 24px on tablets, 32px on desktop.
- Grid: 12 columns on large screens. Case studies use a 3/9 split (section label / content); project rows use 1/7/4.
- Vertical rhythm: sections are separated by `py-20` (80px) on mobile and `py-28` (112px) on desktop.
- Every section opens with a **numbered rule**: a 1px black rule, a monospace index (`01`), an uppercase label and a large title.
- Touch targets are at least 44×44px (`min-h-11`, `size-11`).

## Components

| Component | File | Notes |
| --- | --- | --- |
| `Container`, `SectionHeading`, `Eyebrow` | `ui/primitives.tsx` | Layout and numbered headings |
| `ButtonLink` / `buttonClasses` | `ui/primitives.tsx` | `primary` (filled), `secondary` (outlined, inverts on hover), `ghost` |
| `Tag`, `TagList` | `ui/primitives.tsx` | Technology chips; `max` collapses the rest into `+n` |
| `StatusLabel` | `ui/primitives.tsx` | Square marker: filled for live/released, outlined for everything else; status text is always present |
| `ExternalLink`, arrows | `ui/primitives.tsx` | External links announce "(opens in a new tab)" |
| `FeaturedProjectRow`, `ProjectRow` | `work/ProjectList.tsx` | Editorial rows for case studies and compact rows for the index |
| `ProjectExplorer` | `work/ProjectExplorer.tsx` | Category toggle buttons (`aria-pressed`), search, archive disclosure |
| `ArchitectureDiagram`, `FlowSteps` | `work/ArchitectureDiagram.tsx` | Diagrams as semantic HTML lists — readable by screen readers and printable |
| `SiteHeader` | `site/SiteHeader.tsx` | Sticky, translucent header; active-route underline; mobile disclosure menu |
| `SiteFooter` | `site/SiteFooter.tsx` | Inverted contact band on every page (`#contact`) |
| `AssistantPanel` | `assistant/AssistantPanel.tsx` | Native modal `<dialog>` side sheet |

## Motion

| Interaction | Implementation | Duration |
| --- | --- | --- |
| Page entrance | `app/template.tsx` + `.page-enter` (transform only, so LCP is not delayed) | 520ms, expo-out |
| Section reveals | `.reveal` via CSS scroll-driven animations, only where `animation-timeline` is supported | entry 0–32% |
| Link underline | `.link` background-size wipe | 300ms |
| Card hover | Arrow nudges 4px; featured titles draw a 2px underline | 300–500ms |
| Nav indicator | Active route underline scales in | 300ms |
| Assistant | Sheet slides 24px in; streaming caret blinks | 360ms |

All motion sits inside `@media (prefers-reduced-motion: no-preference)`. With reduced motion — or in browsers without scroll-driven animations — content appears immediately and nothing is hidden.

## Accessibility rules

- Visible 2px focus outline in the current ink colour on every interactive element.
- Skip link to `#main`; landmarks: header, nav (labelled), main, footer.
- Headings are sequential on every page (verified by Lighthouse).
- Status is conveyed in text, never by marker shape alone.
- The assistant is a native modal dialog (focus containment, Escape, inert background) with an `aria-live` announcement when an answer completes — not on every streamed token.

## Responsiveness

Verified at 375px (phone) and ~1024px (desktop pane) with no horizontal scroll. Breakpoints: `sm` 640px, `md` 768px (desktop navigation appears), `lg` 1024px (12-column layouts).

## Print

`@media print` forces black-on-white, hides navigation and interactive controls (`.no-print`), and sets A4 margins. `public/resume.pdf` is printed from `/resume` with these rules.
