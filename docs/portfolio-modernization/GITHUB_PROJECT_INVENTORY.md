# GitHub project inventory

Collected 9 November 2026 with the authenticated GitHub CLI (`gh` as `samuel-1-avson`) plus local clones in `C:\Users\samue\OneDrive\Desktop\projects`. For each repository the audit read metadata, languages, the README, the file tree, up to 100 recent commits and the contributor list; for the four priority projects it also read architecture, status and security documents.

**Rules applied**

- A capability is listed only when the README, docs or source show it. "Status" quotes the project's own status wording where it exists.
- Recent commits are not treated as production readiness. Most of these systems explicitly describe themselves as testnet, alpha or local-only, and the portfolio keeps that wording.
- Private repositories are described at product level only. Cloud project IDs, IPs, VM names, image digests, internal hostnames and runbooks are **not** copied into the site, the assistant knowledge base, or this document.
- "Last activity" is the repository `pushed_at` date.

## Accounts scanned

| Account | Repositories | Notes |
| --- | --- | --- |
| `samuel-1-avson` | 83 (72 public, 11 private at scan time; `ProxySocialHub` became private later the same day); 30 are forks | Primary account linked from the portfolio and CV. |
| `Maxware1` (org) | 0 | Empty. |
| `syndicatetech1/POSai` (org, private) | 1 relevant | PosAI. Samuel is the top contributor (73 of 110 commits). |
| `esiavson` | 4 public | Older labs plus the origin of the local `agentic-qa-platform` clone. Treated as a secondary account; only the QA platform is used. |

Forks (e.g. `hermes-agent`, `polar`, `nanochat`, `Scrapling`, game/Three.js examples) are excluded — they are other people's work.

## Priority projects

### 1. BitMomo (repo `crypto-payment-system`, private)

| Field | Verified value |
| --- | --- |
| Description | Crypto payment acceptance for Ghanaian merchants: invoices and QR checkout, independently verified on-chain receipts, merchant ledger, settlement and payouts. |
| Category | Fintech · Blockchain · Backend |
| Stack | Rust (13 crates: Axum API, worker, monitor, Tonic gRPC, blockchain, wallet, rates, security, settlement, verifier, monitoring, shared libs) · Next.js (merchant, customer, admin, marketing portals) · Expo (merchant & customer apps) · PostgreSQL 16 (140+ SQLx migrations) · Redis · GCP (Compute, Cloud SQL, Cloud Run migrator, Secret Manager, load balancer) · Terraform · Docker · nginx/Caddy · Cloudflare |
| Networks | Tron (Nile) USDT is the canonical testnet rail; Solana Devnet enabled (Nov 2026); Base Sepolia ETH/USDC acceptance receiver; eight EVM testnets have source support. Mainnet custody and real GHS/MoMo/bank payouts are explicitly **not** enabled — payouts are simulated. |
| Architecture | Invoice → per-invoice HD deposit address (SLIP-10/BIP-44) → customer wallet attempt → independent receipt and finality verification → state-fenced finalizer → merchant ledger with reservations and transactional outbox → approval-bound payouts. BFF routes hold tokens in HttpOnly cookies with CSRF checks; forced row-level security; least-privilege DB roles; migrations run by a single-task job. |
| Status | "GCP testnet development system". Public marketing/waitlist site live. Authentication release accepted; funded, device and full-recovery acceptance open. |
| Last activity | 2026-11-09 (payout demo phase 3, admin redesign) |
| Contributors | samuel-1-avson 385 commits, one collaborator 22 |
| Links | Live: <https://bitmomo.app> (HTTP 200). Source: private. Dev portals are not linked. |
| Portfolio priority | **Featured** (case study) |

### 2. ProxyHubb (repo `ProxySocialHub`, private since 9 Nov 2026)

> The repository was public (MIT) when the audit started and was switched to **private** at 20:12 UTC on 9 November 2026. The portfolio therefore links only the live marketplace and docs, not the source.

| Field | Verified value |
| --- | --- |
| Description | Decentralized residential proxy marketplace: buyers fund a Solana escrow and route traffic through an edge network; providers run a daemon that shares spare bandwidth and is paid per metered session. |
| Category | Networking · Blockchain · Backend · AI |
| Stack | Go control plane (`services/control-api`) · Rust edge gateway and provider daemon (Yamux/QUIC tunnels, HTTP CONNECT/SOCKS5, HMAC credentials) · Anchor/Solana programs (escrow, registry, gateway bond, reputation) · Next.js web app · Chrome MV3 extension · SDKs for Node.js, Python, Go · PostgreSQL (326 migration files) · Redis · Prometheus/Grafana/OpenTelemetry · MCP server · "Hubbie" assistant on the Meta model API |
| Status | Marketplace live at proxyhubb.com; escrow on Solana **devnet**; 15+ ADRs; extensive audits. |
| Last activity | 2026-11-04 |
| Contributors | samuel-1-avson 957 commits, one collaborator 16 |
| Links | Live <https://proxyhubb.com>, docs <https://docs.proxyhubb.com> (both 200). Source: private (not linked). |
| Predecessor | `smart-proxy-system` (Go, Nov 2025, public) |
| Portfolio priority | **Featured** (case study) |

### 3. CipherVault (public, MIT OR Apache-2.0)

| Field | Verified value |
| --- | --- |
| Description | Client-side encrypted backup, version control and clean-machine disaster recovery for the confidential files Git leaves behind (`.env`, keys, certificates). |
| Category | Security · Developer tools · Distributed systems |
| Stack | Rust workspace (crates: crypto, snapshot, storage, chain, recovery, redact, local-store, format, file-lock) · CLI + TUI · operator, account and maintenance services · Python Hermes Agent plugin · Docker, systemd, Kubernetes, GCP deploy targets · package-manager manifests |
| Key techniques | XChaCha20-Poly1305 AEAD, HKDF-SHA256 domain separation, FastCDC content-defined chunking (chunk protocol v2), Ed25519 signing, M-of-N guardian recovery, replication across storage operators with signed possession challenges, "CipherChain" anchoring of vault heads, exact output scrubbing for `ciphervault run`, hash-chained agent audit log, YubiKey PIV support. |
| Honest limits (from the repo) | The storage challenge proves possession at challenge time, not storage over time; the account plane is single-writer SQLite; no independent cryptographic certification. |
| Status | Released CLI **v1.0.32** (9 Nov 2026) with release evidence; hosted vault inspector live. |
| Last activity | 2026-11-09 |
| Links | Live <https://vault.cipherv.online> (200); source <https://github.com/samuel-1-avson/CipherVault> |
| Portfolio priority | **Featured** (case study) |

### 4. CREG — Chain Registry

Repositories: `chain-registry-blockchain-CREG-` (public, canonical), `chain-registry-core` (public snapshot, Jun 2026), `CREG-Contribution-Arena` (private), `Creg-waitlist` (private), `chain-registry-ops` (private).

| Field | Verified value |
| --- | --- |
| Description | Decentralized package registry that replaces single-maintainer trust (npm, PyPI, Cargo) with validator consensus: packages are content-addressed on IPFS, analysed by a static → sandbox → deep-scan pipeline, and finalized by a PBFT quorum. |
| Category | Blockchain · Security · Supply chain · Developer tools |
| Stack | Rust validator runtime (libp2p, axum, RocksDB), PBFT with Ed25519, IPFS, Solidity contracts on Sepolia (staking, registry, governance, ZK verifier), Groth16/Circom circuits (rollup checkpoint retired), `creg` CLI with npm/pip/cargo shims, SBOM (SPDX/CycloneDX), YARA rules, explorer and hub web apps |
| Status | "Public alpha." Signed `creg`/`creg-node` binaries `v0.4.8-testnet` for Windows/Linux/macOS. The repo states plainly: **no live public network** (API serves an empty chain), **not BFT** in deployment, not mainnet. |
| Related products | Contribution Arena (<https://contribute.cregnet.dev>, live) — learning, feedback and contribution workflow with wallet sign-in; waitlist (<https://waitlist.cregnet.dev>, live). |
| Last activity | Protocol 2026-10-02; Arena 2026-09-21; waitlist 2026-10-23 |
| Contributors | samuel-1-avson (sole contributor, 153 commits in canonical repo) |
| Portfolio priority | **Featured** (case study) |

## Other significant projects

| Project (repo) | Visibility | Category | Verified stack and scope | Status | Last activity | Links | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **NeuroBench / NeuroState** (`Neurostate`) | public | Embedded · AI · Dev tools | Tauri desktop IDE: Rust backend (234 files, **294** `#[tauri::command]` handlers; modules for simulation, agents, canvas, drivers, HAL, MCU registry, toolchain, jobs) + SolidJS frontend; visual FSM editor, multi-language code generation, Gemini assistance | Prototype; top-50 winner of Google DeepMind "Vibe Code with Gemini 3 Pro" hackathon (Kaggle) | 2026-03-26 | AI Studio demo <https://neurostate.ai.studio> (200); Kaggle write-up | **Featured** |
| **PosAI** (`syndicatetech1/POSai`) | private (org) | AI · Backend · Fintech | pnpm/TypeScript monorepo: control & runtime APIs, workers, Python AI service, capability registry, deterministic compiler, kernel, auth core (self-hosted Keycloak evaluation), PostgreSQL with RLS | Backend build tickets B001–B013 implemented locally with recorded evidence; **nothing deployed**, merchant UI deferred | 2026-11-02 | — | Standard |
| **SMS AI Ghana** (`sms-ai`) | public | AI · Backend | Go modular monolith on PostgreSQL 16: signed SMS/USSD webhooks (HMAC), idempotent ingestion, debounce/coalescing, grounded answers via DeepInfra, provider adapters (mNotify selected; MTN, Hubtel, Arkesel dormant) | MVP weeks 1–4 built and tested against mock gateways; no live provider account yet | 2026-10-20 | source | Standard |
| **Agentic QA Platform** (`agentic-qa-platform`) | private | Dev tools · Testing | TypeScript + Playwright: scope-checked targets, bounded discovery, keyword-driven checks, evidence-first reports, Slack alerts, GitHub Actions | Phases 1–2 implemented; AI analysis planned (Phase 5) | 2026-10-26 | — | Standard |
| **Generator Sound Health Monitor** (`Sound-Anomaly-Detection-SAD-`) | public, MIT | AI · IoT | Python: log-Mel features, Isolation Forest/OC-SVM baseline, convolutional autoencoder, real-time monitor, PyQt GUI, Raspberry Pi deployment path | Phases 0–7 complete; on-device soak pending | 2026-07-25 | source | Standard |
| **TonyCon Cold Store Management** (`TonyCon-Coldstore-Management-System`) | private | Full-stack · Business | TypeScript, tRPC, Drizzle/PostgreSQL, Vercel; inventory batches, POS/sales register, wholesale vs retail profit, mobile-money references, reports | Deployed for a cold-store business (matches CV role) | 2026-05-31 | not linked (business system) | Standard |
| **MarketWise** (`MarketWise`) | public, MIT | Web · Education | Next.js SSG, six interactive concept labs, 24-slide presenter deck, Playwright tests | Complete educational site | 2026-10-31 | <https://market-wise-livid.vercel.app> (200) | Standard |
| **AI Merchant Assistant** (`ai-merchant-assistant`) | public | AI · Fintech | Rust/Axum backend, Next.js frontend, Supabase, WebSockets, voice and OCR pipeline design | Prototype (25 commits, Mar 2026); superseded by BitMomo/PosAI work | 2026-03-30 | source | Standard |
| **RGT AI/Data Training Program** (`RGT-NSS`) | public | AI · Education | 8-week data/ML curriculum, notebooks, LLM learning platform (Next.js) with model governance pages | Delivered during national service at Really Great Tech | 2026-03-10 | <https://llm-learning-platform.vercel.app> (200) | Standard |
| **Healthcare No-Show Prediction** (`healthcare-appointments`) | public | AI · MLOps | FastAPI, React, MLflow, Redis, RabbitMQ, PostgreSQL, Prometheus/Grafana, Streamlit dashboard, Terraform | Portfolio ML system (Dec 2025) | 2025-12-12 | source | Standard |
| **Music Companion** (`music-companion`) | public | AI · Full-stack | React/TS, Express, Supabase, Gemini, Spotify, YouTube streams, WebSockets | Live demo | 2025-12-29 | <https://music-companion-seven.vercel.app> (200) | Standard |
| **Sports odds arbitrage** (`Betting-arbitrage-system`) | private | Data · Backend | Python scrapers, real-time arbitrage detection, PostgreSQL, TS dashboard | Prototype; Vercel homepage now 404 | 2026-02-04 | — | Archive |
| **Arcade Gaming Hub** (`Arcade`) | private | Web · Web3 | Next.js, Firebase, Solana wallet sign-in (Phantom signature verification) | Live at arcade-7f03c.web.app; Vercel URL 404 | 2026-06-23 | <https://arcade-7f03c.web.app> | Archive |
| **FSM Designer (PyQt)** (`FSM-Graphical-Editor`) | public | Embedded · Dev tools | PyQt5 FSM editor, hierarchical states, Python simulation, code export, AI assistant — academic project and NeuroBench predecessor | Archived predecessor | 2025-08-20 | source | Archive |
| **Sign Language Detection** | public | AI · Vision | Hybrid CNN-LSTM, MediaPipe keypoints, OpenCV GUI | Research prototype | 2025-07-23 | source | Archive |
| **VF-Digital video fingerprinting** | public | AI · Vision | Python fingerprinting pipeline based on a published paper; web UI | Prototype | 2025-12-29 | source | Archive |
| **Smart Proxy System** | public | Networking | Go + TypeScript | ProxyHubb predecessor | 2025-11-10 | source | Archive |
| **Nex Miner** | public | Game · AI | Python roguelike with generative-AI characters (contest entry) | Contest entry | 2025-06-20 | source | Not shown |
| **Facilitator GenAI guide** (`Generative_ai_text_Guide_for_facilitators`) | public | AI | Guidebook-grounded assistant (Makersplace internship work) | Archived | 2025-05-14 | source | Not shown (internship context only) |
| **Telegram bots** (`Music_Companion_Bot-telegrambot-`, `youtubemusicdownloader_telegram_bot`, `teleframe_bot`) | public | Automation | Python Telegram bots | Archived | 2023–2025 | source | Not shown |

## Excluded

| Repository | Reason |
| --- | --- |
| `echoing-grace-web`, `Pensa-UMaT`, `Pensa_website` | Lovable/v0-generated church websites; not representative engineering work. |
| `halldean-portfolio` | Another person's portfolio stream. |
| `blazor_application`, `spotify-bot`, `Spotify-bot-in-progress`, `discord-bot`, `Algo-programming`, `ml_forex` | Empty or minimal 2023 experiments. |
| `portfolio` | This site. |
| All forks | Not Samuel's work. |
| `AI-Powered-POS-Business-Management-Builder` | Local clone exists (255 commits) but the GitHub repository returns 404; treated as the predecessor of PosAI and not linked. |

## Requested areas with no evidence found

| Requested area | Result |
| --- | --- |
| Mining technology and fleet management | No repository, README or local project found on either account. **Not represented.** Needs owner input if such work exists (e.g. private, under another account, or offline). |
| Decentralized package distribution and validation | Found — this is CREG. |
| IoT and embedded | NeuroBench, FSM Designer, Generator Sound Health Monitor (Raspberry Pi path). |
| Fintech and payment infrastructure | BitMomo, PosAI, ProxyHubb escrow, TonyCon. |

## Repository dependencies

- `smart-proxy-system` → `ProxySocialHub` (rebuild).
- `FSM-Graphical-Editor` → `Neurostate` (Tauri rewrite).
- `chain-registry-core` is a June 2026 public snapshot of the protocol; `chain-registry-blockchain-CREG-` is canonical; `Creg-waitlist` and the Arena consume it; `chain-registry-ops` holds private hosting.
- `ai-merchant-assistant` and the local POS builder precede PosAI.

## Portfolio inclusion summary

- **Featured with case studies (5):** BitMomo, ProxyHubb, CipherVault, CREG, NeuroBench.
- **Standard (10):** PosAI, SMS AI, Agentic QA Platform, Generator Sound Health Monitor, TonyCon, MarketWise, AI Merchant Assistant, RGT program, Healthcare No-Show, Music Companion.
- **Archive (6 shown):** Sports odds arbitrage, Arcade, FSM Designer, Sign Language Detection, VF-Digital, Smart Proxy System.

The source of truth for what the site shows is `src/content/projects.ts`; public-repo metadata is refreshed into `src/content/generated/github.json` by `npm run github:sync` (see [PORTFOLIO_ARCHITECTURE.md](PORTFOLIO_ARCHITECTURE.md)).
