// Résumé-specific wording. The HTML résumé (/resume) and the PDF
// (public/resume.pdf, printed from that page) are generated from this file plus
// the shared profile and project data, so the CV and the site cannot drift.

export const RESUME_REVISED = "2026-11";

export const resumeSummary = [
  "Software and AI engineer who designs and ships complete systems: Rust and Go services, PostgreSQL data models, on-chain settlement, encrypted storage and retrieval-grounded AI assistants.",
  "Built BitMomo (crypto payments for Ghanaian merchants, on testnet), ProxyHubb (Solana-escrowed proxy marketplace, live), CipherVault (encrypted secrets backup, v1.0.32) and CREG (consensus package registry, public alpha).",
  "Documents architecture, release evidence and limits clearly; comfortable owning a product from design through cloud deployment, alone or in small teams.",
];

/** Projects shown on the résumé, in order, with résumé-length bullets. */
export const resumeProjects: { slug: string; bullets: string[] }[] = [
  {
    slug: "bitmomo",
    bullets: [
      "Designed a payment flow that credits merchants only after independent on-chain receipt and finality verification, with a ledger, reservations, outbox and approval-bound payouts.",
      "Built 13 Rust crates (Axum API, worker, chain monitor, settlement), four Next.js portals and two Expo apps; deployed to Google Cloud with Terraform, Cloud SQL and row-level security.",
    ],
  },
  {
    slug: "proxyhubb",
    bullets: [
      "Built a Go control plane, Rust edge gateway and provider daemon (QUIC/Yamux, SOCKS5/CONNECT) and Anchor escrow programs that settle metered sessions on Solana devnet.",
      "Shipped a Next.js marketplace, Chrome extension, Node/Python/Go SDKs and a streaming account assistant with an evaluation gate.",
    ],
  },
  {
    slug: "ciphervault",
    bullets: [
      "Wrote a Rust workspace for client-side encrypted backups: XChaCha20-Poly1305, HKDF-keyed FastCDC chunking, Ed25519-signed snapshots and M-of-N guardian recovery.",
      "Added safe secret injection for processes and AI agents with exact output scrubbing and a hash-chained audit log; released v1.0.32.",
    ],
  },
  {
    slug: "creg",
    bullets: [
      "Built a validator node in Rust (libp2p, PBFT, RocksDB), a static/sandbox/deep-scan package pipeline and Sepolia staking, registry and governance contracts.",
      "Shipped a fail-closed creg CLI with npm/pip/cargo shims, SBOM generation and signed v0.4.8-testnet binaries.",
    ],
  },
  {
    slug: "neurobench",
    bullets: ["Tauri IDE (Rust + SolidJS) for FSM design and embedded code generation; one of 50 winners of Google DeepMind's Gemini 3 hackathon."],
  },
  {
    slug: "posai",
    bullets: ["Lead backend contributor (team project): tenant-isolated TypeScript services, capability registry, deterministic compiler and leased job workers."],
  },
  {
    slug: "sms-ai-ghana",
    bullets: ["Go service delivering grounded AI answers over SMS/USSD with signed webhooks, idempotency and multipart coalescing; MVP tested against mock gateways."],
  },
];
