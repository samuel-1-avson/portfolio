export interface Project {
  slug: string;
  title: string;
  description: string;
  link: string;
  tech: string[];
  status: "open-source" | "prototype" | "concept";
  role: string;
  demo?: string;
  details?: string; // Markdown-like content for rich details
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  degree: string;
  school: string;
  period: string;
  details: string;
}

export interface PortfolioData {
  personal: {
    name: string;
    tagline: string;
    bio: string;
    location: string;
    phone: string;
    email: string;
  };
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  skills: {
    technical: string[];
    tools: string[];
    soft: string[];
    languages: string[];
  };
  education: Education[];
  cv: Experience[];
  projects: Project[];
  awards: string[];
  awardLinks: { award: string; label: string; href: string }[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Samuel Maxwell Obeng Avornyoh",
    tagline: "AI/ML Engineer | Full-Stack Developer | Embedded Systems & Blockchain",
    bio: "AI/ML Engineer with over 4 years of experience building machine learning models, AI systems, reliable data pipelines, and embedded-system design tools. Skilled in bridging the gap between advanced AI agents, full-stack web applications, and secure blockchain technologies.",
    location: "Ghana",
    phone: "+233547244783",
    email: "samuelavson360@gmail.com",
  },
  socials: {
    github: "https://github.com/samuel-1-avson",
    linkedin: "https://www.linkedin.com/in/samuel-maxwell-obeng-avornyoh-b07763252/",
    email: "samuelavson360@gmail.com",
  },
  skills: {
    technical: [
      "Data Engineering",
      "AI Systems",
      "MLOps",
      "Blockchain",
      "Machine Learning",
      "Embedded System Design",
      "Networking",
      "Game Development",
      "Data Visualization"
    ],
    tools: [
      "Python",
      "Rust",
      "JavaScript/TypeScript",
      "SQL",
      "Bash",
      "Solidity",
      "Go",
      "C/C++",
      "FastAPI",
      "Express.js",
      "Axum/Rust",
      "Redis",
      "PostgreSQL/Supabase",
      "Neo4j",
      "RabbitMQ",
      "Firebase",
      "PyTorch",
      "scikit-learn",
      "LangChain",
      "CrewAI",
      "MLflow",
      "RAG",
      "Vector Databases",
      "GCP",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git/GitHub",
      "LLMs",
      "ANNOY",
      "Chroma",
      "Prometheus/Grafana"
    ],
    soft: [
      "Adaptability",
      "Problem-solving",
      "Effective Communication",
      "Collaboration",
      "Leadership",
      "Technical Documentation"
    ],
    languages: ["English", "Asante-Twi"]
  },
  education: [
    {
      degree: "BSc. Computer Science and Engineering",
      school: "University of Mines and Technology, Tarkwa Ghana",
      period: "Nov 2025",
      details: "Academic Standing: Second Upper | CWA: 75.66. Relevant Coursework: Artificial Intelligence, Data Structures and Algorithms, Database Systems, Data Science Fundamentals, Probability and Statistics, Embedded System Design, Linear Algebra, Robotics"
    }
  ],
  cv: [
    {
      role: "Full-Stack Developer",
      company: "TonyCold Store Management System",
      period: "May 2026 - Present",
      description: "• Developed a business management system for a cold store dealing in frozen meat, fish, and related products.\n• Designed modules for product records, inventory tracking, sales/POS operations, stock movement, expense tracking, and business reporting.\n• Improved operational visibility by organizing product categories, pricing, sales summaries, and admin workflows for day-to-day store management."
    },
    {
      role: "National Service Personnel / AI & Data Engineer",
      company: "Really Great Tech",
      period: "Dec. 2025 – Present",
      description: "• Built and maintained an AI/Data training repository covering data analytics, SQL, dashboards, supervised ML, deployment, MLOps, LLM fundamentals, LangChain, RAG, and model evaluation.\n• Designed weekly workflows and milestone projects using Git/GitHub branches, pull requests, Python, Jupyter/VS Code, scikit-learn, SQL, and Google Looker Studio.\n• Developed learning materials and project documentation for business insights, ML microservices, and telecom policy assistant use cases."
    },
    {
      role: "Blockchain / Gaming / AI Project Developer",
      company: "Independent Projects",
      period: "May 2025 – Present",
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Samuel Maxwell Obeng Avornyoh",
    tagline: "AI/ML Engineer | Full-Stack Developer | Embedded Systems & Blockchain",
    bio: "AI/ML Engineer with over 4 years of experience building machine learning models, AI systems, reliable data pipelines, and embedded-system design tools. Skilled in bridging the gap between advanced AI agents, full-stack web applications, and secure blockchain technologies.",
    location: "Ghana",
    phone: "+233547244783",
    email: "samuelavson360@gmail.com",
  },
  socials: {
    github: "https://github.com/samuel-1-avson",
    linkedin: "https://www.linkedin.com/in/samuel-maxwell-obeng-avornyoh-b07763252/",
    email: "samuelavson360@gmail.com",
  },
  skills: {
    technical: [
      "Data Engineering",
      "AI Systems",
      "MLOps",
      "Blockchain",
      "Machine Learning",
      "Embedded System Design",
      "Networking",
      "Game Development",
      "Data Visualization"
    ],
    tools: [
      "Python",
      "Rust",
      "JavaScript/TypeScript",
      "SQL",
      "Bash",
      "Solidity",
      "Go",
      "C/C++",
      "FastAPI",
      "Express.js",
      "Axum/Rust",
      "Redis",
      "PostgreSQL/Supabase",
      "Neo4j",
      "RabbitMQ",
      "Firebase",
      "PyTorch",
      "scikit-learn",
      "LangChain",
      "CrewAI",
      "MLflow",
      "RAG",
      "Vector Databases",
      "GCP",
      "AWS",
      "Docker",
      "Kubernetes",
      "Git/GitHub",
      "LLMs",
      "ANNOY",
      "Chroma",
      "Prometheus/Grafana"
    ],
    soft: [
      "Adaptability",
      "Problem-solving",
      "Effective Communication",
      "Collaboration",
      "Leadership",
      "Technical Documentation"
    ],
    languages: ["English", "Asante-Twi"]
  },
  education: [
    {
      degree: "BSc. Computer Science and Engineering",
      school: "University of Mines and Technology, Tarkwa Ghana",
      period: "Nov 2025",
      details: "Academic Standing: Second Upper | CWA: 75.66. Relevant Coursework: Artificial Intelligence, Data Structures and Algorithms, Database Systems, Data Science Fundamentals, Probability and Statistics, Embedded System Design, Linear Algebra, Robotics"
    }
  ],
  cv: [
    {
      role: "Full-Stack Developer",
      company: "TonyCold Store Management System",
      period: "May 2026 - Present",
      description: "• Developed a business management system for a cold store dealing in frozen meat, fish, and related products.\n• Designed modules for product records, inventory tracking, sales/POS operations, stock movement, expense tracking, and business reporting.\n• Improved operational visibility by organizing product categories, pricing, sales summaries, and admin workflows for day-to-day store management."
    },
    {
      role: "National Service Personnel / AI & Data Engineer",
      company: "Really Great Tech",
      period: "Dec. 2025 – Present",
      description: "• Built and maintained an AI/Data training repository covering data analytics, SQL, dashboards, supervised ML, deployment, MLOps, LLM fundamentals, LangChain, RAG, and model evaluation.\n• Designed weekly workflows and milestone projects using Git/GitHub branches, pull requests, Python, Jupyter/VS Code, scikit-learn, SQL, and Google Looker Studio.\n• Developed learning materials and project documentation for business insights, ML microservices, and telecom policy assistant use cases."
    },
    {
      role: "Blockchain / Gaming / AI Project Developer",
      company: "Independent Projects",
      period: "May 2025 – Present",
      description: "• Built game and blockchain prototypes including arcade-style games, Web3/crypto experiments, and AI-assisted development workflows.\n• Facilitated Web3, forex, and AI learning discussions across WhatsApp and LinkedIn communities.\n• Continued building portfolio projects in AI agents, embedded systems, trading systems, and full-stack web platforms."
    },
    {
      role: "Machine Learning Intern",
      company: "Makersplace",
      period: "Sep. 2023 – Jan. 2024",
      description: "• Created a web-based generative AI assistant to support robotic facilitators in course delivery using a facilitator guidebook as a knowledge source for contextual responses.\n• Built visual charts and graphs to communicate AI-agent activities, performance, and decision insights to non-technical stakeholders.\n• Developed machine-learning models for financial-market forecasting and trading-strategy research using predictive algorithms and market indicators.\n• Integrated AI agents with Telegram and WhatsApp using FastAPI, Telegram libraries, and WhatsApp automation tools."
    }
  ],
  projects: [
    {
      slug: "neurobench",
      title: "FSM Designer / NeuroBench",
      description: "A graphical finite-state-machine editor and professional-grade embedded systems IDE built with Tauri (Rust + SolidJS). Features visual FSM design with cycle-accurate simulation, templates, C/Python code export, AI-assisted debugging, 90+ IPC commands, and real-time performance monitoring.",
      link: "https://github.com/samuel-1-avson/Neurostate",
      demo: "https://neurostate.ai.studio",
      status: "open-source",
      role: "Product and systems developer",
      tech: ["Rust", "Tauri", "SolidJS", "TypeScript", "STM32", "probe-rs"],
      details: `
# NeuroBench System Documentation v2.0

## Executive Summary
NeuroBench is a professional-grade embedded systems development environment built with Tauri (Rust and SolidJS). It provides a complete platform for cycle-accurate simulation, multi-agent AI development, and comprehensive peripheral configuration.

**Key Metrics**
- Backend: Rust (Tauri) with 200+ source files
- Frontend: SolidJS/TypeScript with 150+ components
- Architecture: 30+ modular Rust engines (Simulation, Agents, Canvas)
- Capabilities: 285+ IPC commands supporting STM32, nRF52, ESP32, and RP2040

## System Architecture v2.0
The system operates as a modular OS for embedded development, separating concerns between high-performance backend engines and a reactive frontend.

**Core Backend Modules**
- simulation: Cycle-accurate CPU/Memory/Peripheral state
- agents: Multi-Agent System (Director, Coder, Hardware, Planner)
- canvas: Graph Theory Engine for spatial indexing and auto-layout
- drivers: Extensive library for Wireless, Security, DSP, and RTOS
- jobs: Priority Job Scheduler and Async Build Pipeline

**Frontend Components**
- Core UI: Unified infinite canvas and industrial menu system
- Simulation: Dashboard, WaveformViewer, and RegisterView
- Panels: 25+ configuration panels including Clock, Pin, and Peripherals
- Tools: Terminal, CodeDiff, Git integration, and Performance monitoring

## Feature Inventory

**1. Simulation & Digital Twin**
- Cycle-Accurate Simulation: Run firmware virtually with peripheral injection
- Debug Controls: Step, Pause, Resume, Breakpoints, and Register inspection
- Behavioral Bridge: Link FSM states directly to simulated hardware events

**2. Advanced AI Agents**
- Orchestrator: Director agent delegates tasks to specialized sub-agents
- Roles: CodeAgent (drivers), HardwareAgent (electrical constraints), DocsAgent
- Capabilities: Self-reflection and access to 60+ typed development tools

**3. Expanded Peripherals & Drivers**
- Wireless: WiFi, BLE, LoRa, Thread, Zigbee, LTE-M
- Security: Secure Boot, OTA, TrustZone, Crypto (AES/ECC)
- DSP: FFT, Filters, PID Controllers, TinyML Neural Networks
- RTOS: Generation for FreeRTOS, Zephyr, and ThreadX

**4. Professional Workflow**
- Build Pipeline: Real-time streaming GCC output with error parsing
- Version Control: Integrated Git diff viewer, commit interface, and branching
- Event Sourcing: Infinite undo/redo and time-travel debugging
- Management: Project browser, templates, and manifest versioning

## Job Scheduler
The background scheduler handles parallel execution of AI reasoning, compilation tasks, simulation threads, and device I/O without blocking the user interface.
`
    },
    {
      slug: "music-companion",
      title: "AI-powered Music Companion",
      description: "AI-powered music companion platform with React/TypeScript, Express.js, Supabase, Gemini, Spotify, YouTube/yt-dlp, Telegram Bot integration, and real-time WebSocket features.",
      link: "https://github.com/samuel-1-avson/music-companion",
      demo: "https://music-companion-seven.vercel.app",
      status: "open-source",
      role: "Full-stack and AI developer",
      tech: ["React", "TypeScript", "Express.js", "Supabase", "Gemini AI", "WebSocket", "Telegram Bot"],
    },
    {
      slug: "chain-registry",
      title: "Chain Registry Ecosystem",
      description: "A security-focused Chain Registry Ecosystem project focused on registry integrity, blockchain metadata management, reproducible verification, governance, auditability, and supply-chain security.",
      link: "https://contribute.cregnet.dev/",
      demo: "https://contribute.cregnet.dev/",
      status: "open-source",
      role: "Systems and security researcher",
      tech: ["Solidity", "Rust", "Blockchain", "Metadata", "Security"],
      details: `
# Chain Registry Ecosystem System Specification

## Executive Summary
The Chain Registry Ecosystem is a security-focused decentralization and supply-chain verification protocol. It guarantees registry integrity, immutable metadata provenance, and cryptographic verification of software packages and hardware firmwares across distributed ledgers.

**Key Architecture Highlights**
- Protocol Core: Solidity Smart Contracts with Merkle-Tree verification
- Cryptographic Proofs: Zero-Knowledge & ECDSA state proof validation
- Verification Engine: Rust-based off-chain indexer with deterministic replay
- Governance: Multi-signature access control & decentralized registry voting

## Core System Layers
1. **On-Chain Registry**: ERC-721/1155 compliant metadata anchors on Ethereum/Polygon.
2. **Off-Chain Verification Engine**: Async Rust indexer computing cryptographic hashes for hardware binaries.
3. **Reproducible Build Auditor**: Deterministic build pipeline comparing artifact checksums against published on-chain root commitments.
4. **Supply-Chain Security Guard**: Real-time vulnerability monitoring and automated revocation alerts.
`,
    },
    {
      slug: "proxy-marketplace",
      title: "ProxyHub / Proxy Marketplace",
      description: "Built ProxyHub, a high-performance proxy marketplace and recommendation platform involving networking, proxy routing architecture, usage-based billing, scoring, and real-time proxy analytics.",
      link: "https://proxyhubb.com/",
      demo: "https://proxyhubb.com/",
      status: "open-source",
      role: "Full-stack and systems developer",
      tech: ["Go", "Python", "Networking", "Architecture", "Billing", "React"],
    },
    {
      slug: "web3-arcade",
      title: "Web3 Gaming Arcade Platform",
      description: "Developed an arcade gaming platform featuring Web3 crypto integrations, HTML5 Canvas game mechanics, Firebase real-time state, and interactive play-to-earn/reward workflows.",
      link: "https://arcade-7f03c.web.app/",
      demo: "https://arcade-7f03c.web.app/",
      status: "open-source",
      role: "Blockchain & Game developer",
      tech: ["React", "Firebase", "Web3", "JavaScript", "HTML5 Canvas"],
    },
    {
      slug: "merchant-assistant",
      title: "AI Merchant Assistant",
      description: "Built AI Merchant Assistant, a Rust/Next.js/Supabase platform for voice-based sales recording, receipt OCR, inventory tracking, real-time analytics, forecasting, and smart merchant alerts.",
      link: "#",
      status: "prototype",
      role: "Product and platform developer",
      tech: ["Rust", "Next.js", "Supabase", "OCR", "Analytics", "AI"],
      details: `
# AI Merchant Assistant Architecture & Specs

## Executive Summary
The AI Merchant Assistant is a full-stack platform engineered for retail merchants in emerging markets. It bridges physical point-of-sale activities with AI-driven inventory forecasting, receipt OCR, and voice-assisted transaction logging.

**Key Platform Capabilities**
- Voice Sales Recording: Speech-to-text NLP model parsing natural sales phrases into structured data
- Receipt OCR Engine: Vision pipeline converting printed receipts to structured JSON entries
- Real-Time Analytics: Axum/Rust backend serving inventory forecasting & low-stock alerts
- Database & Sync: Supabase (PostgreSQL + Realtime) with offline-first local storage

## System Workflow & Modules
1. **Voice & Text Sales Logger**: Converts natural merchant utterances into structured transactions.
2. **Smart Inventory Forecasting**: Time-series predictive model anticipating reorder dates based on sales velocity.
3. **Receipt Scanner**: Extracts product names, quantities, and totals from camera/upload images.
`,
    },
    {
      slug: "healthcare-no-show-prediction",
      title: "Healthcare No-Show Prediction",
      description: "Built a healthcare no-show prediction system using FastAPI, React, MLflow, Redis, RabbitMQ, PostgreSQL, and Prometheus/Grafana monitoring.",
      link: "https://github.com/samuel-1-avson/healthcare-appointments",
      status: "open-source",
      role: "ML and platform developer",
      tech: ["FastAPI", "React", "MLflow", "Redis", "RabbitMQ", "PostgreSQL", "Prometheus", "Grafana"],
    },
    {
      slug: "crypto-pos",
      title: "Crypto POS Payment System",
      description: "Designed a Crypto POS payment system concept for merchants to accept crypto payments, support stablecoins and major assets, verify transactions, generate receipts, and manage fiat or crypto settlement workflows.",
      link: "#",
      status: "concept",
      role: "Payments systems designer",
      tech: ["Solidity", "React", "Web3", "Smart Contracts", "Payments"],
    },
    {
      slug: "sports-odds-arbitrage",
      title: "Sports Odds Arbitrage",
      description: "Developed sports odds arbitrage analytics tools with Python scraping, Redis caching, fuzzy/NLP event matching, alerting, rate limiting, and reliability-focused fallback handling.",
      link: "#",
      status: "prototype",
      role: "Data and reliability developer",
      tech: ["Python", "Redis", "Scraping", "NLP", "Fuzzy Matching", "Rate Limiting"],
    },
    {
      slug: "sign-language-detection",
      title: "Sign Language Detection",
      description: "Designed a hybrid CNN-LSTM sign-language detection pipeline using video/image data and pose-based features.",
      link: "https://github.com/samuel-1-avson/Sign-Language-Detection-Hybrid-CNN-LSTM",
      status: "open-source",
      role: "Machine learning developer",
      tech: ["Python", "TensorFlow", "CNN", "LSTM", "OpenCV"],
    }
  ],
  awards: [
    "Google DeepMind - Vibe Code Hackathon Winner (Kaggle/AI Studio: Top 50 Project out of 4,097 submissions)",
    "First Place: CodeAfrique & Art Exhibition Robotics Competition",
    "IT President: Kumasi Anglican Senior High School (Led 70+ students in programming)",
  ],
  awardLinks: [
    {
      award: "Google DeepMind - Vibe Code Hackathon Winner (Kaggle/AI Studio: Top 50 Project out of 4,097 submissions)",
      label: "View Kaggle winners",
      href: "https://www.kaggle.com/competitions/gemini-3/hackathon-winners",
    },
    {
      award: "Google DeepMind - Vibe Code Hackathon Winner (Kaggle/AI Studio: Top 50 Project out of 4,097 submissions)",
      label: "Read Neurostate write-up",
      href: "https://www.kaggle.com/competitions/gemini-3/writeups/neurostate-ai-powered-embedded-systems-ide",
    },
  ]
};
