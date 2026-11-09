# CV update report

Revised: November 2026. Source CV: `Samuel Maxwell Obeng Avornyoh CV (3).pdf` (repository root; byte-identical to the previous `public/resume.pdf`). The original file is kept unchanged for reference.

## How the new CV is produced

- The HTML résumé at **`/resume`** is generated from `src/content/profile.ts` (profile, experience, skills, education, recognition), `src/content/projects.ts` and `src/content/resume.ts` (summary and résumé-length project bullets).
- **`public/resume.pdf`** is printed from that page by `npm run resume:pdf` (headless Edge/Chrome, A4, print stylesheet). It is two pages, uses real text (ATS-readable), single-column, with standard section names.
- Because both come from the same data as the website and the AI assistant, the CV and the portfolio cannot drift apart.

To regenerate after editing content:

```bash
npm run build
npm run start
npm run resume:pdf -- http://localhost:3000
```

## What changed, and the evidence

| Section | Change | Evidence |
| --- | --- | --- |
| Headline | "Software & AI Engineer" (was implicit "AI/ML Engineer") | Reflects verified work spanning Rust/Go backends, payments, security and AI |
| Summary | Rewritten as three lines naming the four strongest systems with their honest status | Repositories `crypto-payment-system`, `ProxySocialHub`, `CipherVault`, `chain-registry-blockchain-CREG-` |
| Experience — order | Now reverse-chronological by start date within current/past roles | The old CV listed the 2023 internship between 2026 roles |
| Experience — Independent projects | Bullets now describe BitMomo, ProxyHubb, CipherVault and CREG; kept the community-facilitation bullet | Repository READMEs, commit histories (385, 957, 35+, 153 commits) |
| Experience — Cold store | Added a verified bullet on batch-costed profit reporting | `TonyCon-Coldstore-Management-System` commits (31 May 2026) |
| Projects | Replaced "Crypto POS payment system **concept**" with **BitMomo — testnet**; added CipherVault, CREG (accurate description), PosAI, SMS AI Ghana; corrected ProxyHubb; NeuroBench numbers corrected | See [GITHUB_PROJECT_INVENTORY.md](GITHUB_PROJECT_INVENTORY.md) |
| Skills | Regrouped into seven areas; added verified tools (Axum, Tonic, Anchor, Tron, PBFT/libp2p, XChaCha20/HKDF/Ed25519, Terraform, Expo, Playwright, OpenTelemetry); kept Chroma (used in `healthcare-appointments`); dropped Neo4j and CrewAI (GitHub code search finds them only in old portfolio copy or docs, not in code) and ANNOY (only in a 2025 bot's history file) | Source trees, dependency files and `gh search code` across the account |
| Education | Added completion date (Nov 2025) from the earlier site data; kept Second Class Upper and coursework | Owner's CV and site data |
| Recognition | Fixed "ACHEIVEMENTS" → "Recognition" and "Hackation" typo; one verified award with links | Kaggle winners page and write-up (both HTTP 200) |
| Links | Email, LinkedIn, GitHub, portfolio, project live sites | Checked 9 Nov 2026 |
| Revision date | "Revised Nov 2026" printed at the end | — |

## Removed or withheld (pending confirmation)

| Item | Reason |
| --- | --- |
| CWA 75.66 | Present on the CV but deliberately removed from the website on 1 Aug 2026 (commit `c412501`). Omitted for consistency. **Confirm whether you want it on the CV.** |
| "First Place — CodeAfrique & Art Exhibition Robotics Competition" | In old site data only; not on the CV; no evidence link. Stored with `verified: false`, not shown. |
| "IT President — Kumasi Anglican SHS (led 70+ students)" | Same as above. |
| "Top 50 out of 4,097 submissions" | The "50 winners" fact is verified on Kaggle; the submission count could not be verified, so it was dropped. |
| Neo4j, ANNOY, CrewAI | Listed on the old CV; GitHub code search finds no real use (only old portfolio copy, documentation mentions, or an old history file). Re-add if used in work not on GitHub. |
| Crypto POS "concept" | Superseded by BitMomo. |

## Fields requiring owner confirmation

1. **Cold-store role:** the CV says "TonyCold Store Management System, May 2026 – Present", but the repository is named `TonyCon-Coldstore-Management-System` and has no commits after 31 May 2026. Confirm the business name spelling and whether the role is ongoing.
2. **Independent projects title:** "Blockchain / Gaming / AI Project Developer" was kept verbatim. A clearer option would be "Independent Software Engineer" — only change it if you are comfortable with that title.
3. **National service dates:** Really Great Tech (Dec 2025 – Mar 2026) then Sefwiman Community Bank (Mar 2026 – Sep 2026). Confirm these are both part of the same service year and that "Sep 2026" is the end month.
4. **Phone number:** kept on the PDF/HTML résumé because it is on your published CV. It is not shown elsewhere on the site and is excluded from the AI assistant. Remove it from `profile.phone` if you prefer email-only.
5. **PosAI:** described as a team project in the `syndicatetech1` organisation with you as lead backend contributor (73 of 110 commits). Confirm you are happy for it to be named publicly and whether a role title applies.
6. **ProxyHubb visibility:** the repository was made private on 9 Nov 2026; the CV links only `proxyhubb.com`. Confirm that is intended.
7. **Mining technology / fleet management:** requested in the brief but no evidence was found on GitHub. If this work exists, provide details or a repository and it can be added.

## ATS notes

- Single column, real text, standard headings (Summary, Experience, Selected projects, Skills, Education, Recognition).
- Dates right-aligned in a consistent `Mon YYYY – Mon YYYY` format.
- No tables, text boxes, icons or images.
- Keywords appear in context (bullets) and in the Skills section.
