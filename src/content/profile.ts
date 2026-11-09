import type { Education, Experience, Milestone, Profile, Recognition, SkillGroup } from "./types.ts";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://samuel-seven-gamma.vercel.app").replace(/\/$/, "");

export const profile: Profile = {
  name: "Samuel Maxwell Obeng Avornyoh",
  shortName: "Samuel Avornyoh",
  role: "Software & AI Engineer",
  headline: "Engineering trustworthy systems for payments, security and AI.",
  intro:
    "I build backend-heavy products end to end — Rust and Go services, on-chain settlement, encrypted storage and AI assistants grounded in real data. Recent work includes a crypto payment platform for Ghanaian merchants, a Solana-settled proxy marketplace and a client-side encrypted secrets vault.",
  about: [
    "I studied Computer Science and Engineering at the University of Mines and Technology in Tarkwa, graduating in November 2025 with Second Class Upper standing. Most of my work since has been building complete systems — usually alone or in very small teams — where correctness matters more than polish: moving money, protecting secrets and deciding which software can be trusted.",
    "BitMomo, my current focus, is a crypto payment platform for Ghanaian merchants with Rust services, four web portals and a cloud testnet deployment. Alongside it I built ProxyHubb, a residential proxy marketplace settled through Solana escrow; CipherVault, an encrypted backup and recovery tool for developer secrets; and CREG, a package registry where publishing is decided by validator consensus.",
    "On the AI side I have built retrieval-grounded assistants, ML pipelines for forecasting, healthcare and acoustic anomaly detection, and NeuroState — an embedded-systems IDE that was one of 50 winners of Google DeepMind's Gemini 3 hackathon on Kaggle. During national service I designed an AI and data training programme at Really Great Tech and supported network and security operations at Sefwiman Community Bank.",
    "I care about evidence. My repositories record release proofs, threat models and explicit limits, and I describe projects by what they do today: testnet is testnet and a prototype is a prototype.",
  ],
  location: "Ghana",
  availability: "Open to engineering roles and collaborations",
  email: "samuelavson360@gmail.com",
  phone: "+233 547 244 783",
  siteUrl: SITE_URL,
  socials: [
    { label: "GitHub", href: "https://github.com/samuel-1-avson" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/samuel-maxwell-obeng-avornyoh-b07763252/" },
  ],
  specializations: [
    {
      title: "Payments & blockchain infrastructure",
      description: "Ledgers, escrow and verified on-chain settlement across Tron, Solana and EVM networks.",
    },
    {
      title: "Backend & distributed systems",
      description: "Rust and Go services, consensus, background workers and PostgreSQL designs with enforced boundaries.",
    },
    {
      title: "Security engineering",
      description: "Client-side encryption, key recovery, supply-chain verification and fail-closed defaults.",
    },
    {
      title: "Applied AI",
      description: "Grounded assistants, retrieval, evaluation gates and ML pipelines that admit what they don't know.",
    },
  ],
  languages: ["English", "Asante Twi"],
};

export const experience: Experience[] = [
  {
    id: "independent",
    role: "Blockchain / Gaming / AI Project Developer",
    organization: "Independent projects",
    start: "2025-05",
    periodLabel: "May 2025 – Present",
    summary: "Designing, building and operating my own products end to end.",
    highlights: [
      "Building BitMomo, a crypto payment platform for Ghanaian merchants — 13 Rust crates, four Next.js portals and a GCP testnet deployment with release evidence.",
      "Built ProxyHubb, a proxy marketplace with a Go control plane, Rust edge network and Solana escrow; marketplace and docs are live.",
      "Released CipherVault v1.0.32, a Rust tool for client-side encrypted backup and recovery of developer secrets.",
      "Built CREG, a validator-consensus package registry (public alpha) with PBFT, IPFS and Sepolia contracts.",
      "Facilitated Web3, forex and AI learning discussions across WhatsApp and LinkedIn communities.",
    ],
    relatedProjects: ["bitmomo", "proxyhubb", "ciphervault", "creg"],
  },
  {
    id: "tonycon",
    role: "Full-Stack Developer",
    organization: "TonyCold Store Management System",
    start: "2026-05",
    periodLabel: "May 2026 – Present",
    highlights: [
      "Developed a business management system for a cold store dealing in frozen meat, fish and related products.",
      "Designed modules for product records, inventory batches, sales/POS operations, stock movement, expense tracking and reporting.",
      "Improved operational visibility by organizing product categories, pricing, sales summaries and admin workflows.",
      "Made profit reporting accurate by costing sales from inventory batches and separating wholesale profit from retail revenue.",
    ],
    relatedProjects: ["tonycon-cold-store"],
  },
  {
    id: "sefwiman",
    role: "National Service Personnel / IT Technician",
    organization: "Sefwiman Community Bank",
    start: "2026-03",
    end: "2026-09",
    periodLabel: "Mar 2026 – Sep 2026",
    highlights: [
      "Maintained networking systems and handled troubleshooting.",
      "Supported bank operations and cybersecurity.",
    ],
  },
  {
    id: "really-great-tech",
    role: "National Service Personnel / AI & Data Engineer",
    organization: "Really Great Tech",
    start: "2025-12",
    end: "2026-03",
    periodLabel: "Dec 2025 – Mar 2026",
    highlights: [
      "Built and maintained an AI/data training repository covering analytics, SQL, dashboards, supervised ML, deployment, MLOps, LLM fundamentals, LangChain, RAG and model evaluation.",
      "Designed weekly workflows and milestone projects using Git branches and pull requests, Python, Jupyter, scikit-learn, SQL and Looker Studio.",
      "Developed learning materials and documentation for business-insight, ML-microservice and telecom-policy-assistant use cases.",
    ],
    relatedProjects: ["rgt-training-program"],
  },
  {
    id: "makersplace",
    role: "Machine Learning Intern",
    organization: "Makersplace",
    start: "2023-09",
    end: "2024-01",
    periodLabel: "Sep 2023 – Jan 2024",
    highlights: [
      "Created a web-based generative AI assistant that supports robotic facilitators in course delivery, grounded in a facilitator guidebook.",
      "Built charts that communicate AI-agent activity, performance and decisions to non-technical stakeholders.",
      "Developed machine-learning models for financial-market forecasting and trading-strategy research.",
      "Integrated AI agents with Telegram and WhatsApp using FastAPI and messaging libraries.",
    ],
  },
];

export const education: Education[] = [
  {
    degree: "BSc Computer Science and Engineering",
    institution: "University of Mines and Technology",
    location: "Tarkwa, Ghana",
    completed: "2025-11",
    standing: "Second Class Upper",
    coursework: [
      "Artificial Intelligence",
      "Data Structures and Algorithms",
      "Database Systems",
      "Data Science Fundamentals",
      "Probability and Statistics",
      "Embedded System Design",
      "Linear Algebra",
      "Robotics",
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    description: "Used in shipped or released projects.",
    skills: ["Rust", "TypeScript", "Go", "Python", "SQL", "Solidity", "C/C++", "Bash"],
  },
  {
    name: "Backend & systems",
    description: "Services, workers and data stores.",
    skills: ["Axum / Tokio", "Tonic gRPC", "FastAPI", "Express", "tRPC", "PostgreSQL", "Redis", "RabbitMQ", "SQLite", "libp2p"],
  },
  {
    name: "Blockchain & payments",
    description: "Settlement, custody boundaries and consensus.",
    skills: ["Solana / Anchor", "EVM / Sepolia / Base", "Tron USDT", "HD wallets (BIP-44 / SLIP-10)", "PBFT consensus", "IPFS", "Groth16 / Circom", "Ledger & payout design"],
  },
  {
    name: "Security",
    description: "Cryptography and defensive engineering.",
    skills: ["XChaCha20-Poly1305", "HKDF / Ed25519", "M-of-N recovery", "Row-level security", "Supply-chain checks (SBOM)", "Secret scanning", "Threat modelling"],
  },
  {
    name: "AI & machine learning",
    description: "From models to grounded products.",
    skills: ["LLM applications (Gemini, Llama)", "Retrieval-augmented generation", "Chroma", "PyTorch", "TensorFlow", "scikit-learn", "MLflow", "LangChain", "Evaluation gates"],
  },
  {
    name: "Frontend & apps",
    description: "Interfaces for the systems above.",
    skills: ["React", "Next.js", "SolidJS", "Tauri", "Expo / React Native", "Tailwind CSS", "Playwright"],
  },
  {
    name: "Cloud & operations",
    description: "Deploying and observing what I build.",
    skills: ["Google Cloud", "Terraform", "Docker", "Kubernetes", "nginx / Caddy", "Cloudflare", "GitHub Actions", "Prometheus / Grafana / OpenTelemetry"],
  },
];

export const recognition: Recognition[] = [
  {
    title: "Winner — Vibe Code with Gemini 3 Pro in AI Studio",
    issuer: "Google DeepMind · Kaggle",
    detail: "One of 50 winning projects, for NeuroState, an AI-powered embedded systems IDE.",
    verified: true,
    links: [
      { label: "Winners", href: "https://www.kaggle.com/competitions/gemini-3/hackathon-winners" },
      { label: "NeuroState write-up", href: "https://www.kaggle.com/competitions/gemini-3/writeups/neurostate-ai-powered-embedded-systems-ide" },
    ],
  },
  {
    title: "First Place — CodeAfrique & Art Exhibition Robotics Competition",
    issuer: "CodeAfrique",
    detail: "Listed in earlier site data; not on the CV and no evidence link. Awaiting owner confirmation.",
    verified: false,
    links: [],
  },
  {
    title: "IT President — Kumasi Anglican Senior High School",
    issuer: "Kumasi Anglican SHS",
    detail: "Listed in earlier site data; not on the CV. Awaiting owner confirmation.",
    verified: false,
    links: [],
  },
];

export const milestones: Milestone[] = [
  { date: "2026-11", title: "CipherVault v1.0.32", detail: "Hash-chained agent audit log and release evidence published.", href: "/work/ciphervault" },
  { date: "2026-11", title: "BitMomo payout demo on testnet", detail: "Solana Devnet enabled and a simulated MoMo/bank payout flow added.", href: "/work/bitmomo" },
  { date: "2026-10", title: "PosAI backend build", detail: "Team backend for an AI-assisted POS builder; tickets B001–B013 implemented locally.", href: "/work/posai" },
  { date: "2026-10", title: "SMS AI Ghana MVP", detail: "Conversational AI over SMS/USSD for basic phones, tested against mock gateways.", href: "/work/sms-ai-ghana" },
  { date: "2026-09", title: "CREG public alpha binaries", detail: "Signed creg / creg-node v0.4.8-testnet for Windows, Linux and macOS.", href: "/work/creg" },
  { date: "2026-09", title: "Started CipherVault", detail: "Rust workspace for client-side encrypted secret backup and recovery.", href: "/work/ciphervault" },
  { date: "2026-05", title: "Cold-store management system", detail: "Inventory, POS and reporting system built for a frozen-food business.", href: "/work/tonycon-cold-store" },
  { date: "2026-03", title: "Started CREG", detail: "Validator-consensus package registry: Rust, PBFT, IPFS, Sepolia.", href: "/work/creg" },
  { date: "2026-02", title: "Started BitMomo", detail: "Crypto payment acceptance for Ghanaian merchants.", href: "/work/bitmomo" },
  { date: "2026-01", title: "Started ProxyHubb", detail: "Rebuilt an earlier Go proxy prototype into a Solana-settled marketplace.", href: "/work/proxyhubb" },
  { date: "2025-12", title: "NeuroState for the Gemini 3 hackathon", detail: "Embedded-systems IDE later named one of 50 winners.", href: "/work/neurobench" },
  { date: "2025-11", title: "BSc Computer Science and Engineering", detail: "University of Mines and Technology, Second Class Upper." },
  { date: "2023-09", title: "Machine Learning Intern, Makersplace", detail: "First production AI work: a guidebook-grounded assistant and forecasting models." },
];
