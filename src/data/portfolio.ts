export interface Project {
  title: string;
  description: string;
  link: string;
  tech: string[];
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
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Samuel Maxwell Obeng Avornyoh",
    tagline: "AI Engineer | Blockchain Dev | Embedded Systems",
    bio: "I specialize in building intelligent agents, architecting embedded systems, and developing secure blockchain solutions. My work bridges the gap between advanced AI research, hardware design, and decentralized technologies.",
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
    technical: ["Data Engineering", "Prompt Engineering", "Blockchain", "Machine Learning", "Automation", "IoT Engineering", "Game Dev"],
    tools: ["Python", "SQL", "GCP", "Docker", "LLMs", "Solidity", "ANNOY Vector DB", "Bash"],
    soft: ["Adaptability", "Problem-solving", "Leadership", "Communication"],
    languages: ["English", "Asante-Twi"]
  },
  education: [
    {
      degree: "BSc. Computer Science and Engineering",
      school: "University of Mines and Technology",
      period: "Expected Nov 2025",
      details: "Second Upper Class. Courses: AI, Data Science, Robotics, Linear Algebra."
    }
  ],
  cv: [
    {
      role: "AI/ML Engineer NSP",
      company: "Really Great Tech",
      period: "Nov 2025 - Present",
      description: "Serving as an AI/Machine Learning Engineer for National Service, contributing to advanced tech solutions.",
    },
    {
      role: "Blockchain Game Developer",
      company: "Nexus Playground / Community",
      period: "May 2025 - Present", 
      description: "Created an action-packed vertical-scrolling roguelike game for the Nexus Playground Contest. Active Web3/Forex facilitator on LinkedIn and community groups.",
    },
    {
      role: "Machine Learning Intern",
      company: "Makersplace",
      period: "Sep 2023 - Jan 2024",
      description: "Created a generative AI model for robotic facilitators and trained it on guidebooks. Integrated AI agents with Telegram/WhatsApp using FastAPI. Developed ML models for financial forecasting and created visual dashboards for agent analytics.",
    }
  ],
  projects: [
    {
      title: "NeuroBench IDE",
      description: "Professional-grade embedded systems IDE built with Tauri (Rust + SolidJS). Features visual FSM design with drag-and-drop, automated multi-language code generation (C, C++, Rust, Ada, Assembly), 90+ IPC commands, advanced terminal with 30+ embedded commands, real-time performance monitoring, and AI-assisted development with Gemini integration.",
      link: "https://github.com/samuel-1-avson/Neurostate",
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
      title: "Music Companion",
      description: "AI-powered music platform with Gemini AI discovery, multi-provider search (YouTube, Spotify, Last.fm), real-time WebSocket collaboration, and offline capabilities.",
      link: "https://github.com/samuel-1-avson/music-companion",
      tech: ["TypeScript", "React", "Gemini AI", "WebSocket", "Supabase"],
    },
    {
      title: "Sign Language Detection",
      description: "Real-time sign language recognition using a Hybrid CNN/LSTM architecture for accurate gesture classification and translation.",
      link: "https://github.com/samuel-1-avson/Sign-Language-Detection-Hybrid-CNN-LSTM",
      tech: ["Python", "TensorFlow", "CNN", "LSTM", "OpenCV"],
    },
    {
      title: "Sound Anomaly Detection",
      description: "Audio anomaly detection system for industrial applications. Identifies unusual sounds in machinery for predictive maintenance.",
      link: "https://github.com/samuel-1-avson/Sound-Anomaly-Detection-SAD-",
      tech: ["Python", "Deep Learning", "Audio Processing", "Django"],
    },
    {
      title: "Healthcare No-Show Prediction",
      description: "ML system predicting patient appointment no-shows to reduce healthcare losses. Features hyperparameter tuning, Streamlit dashboard, and comprehensive data pipelines.",
      link: "https://github.com/samuel-1-avson/healthcare-appointments",
      tech: ["Python", "Scikit-learn", "Streamlit", "Jupyter", "Nginx"],
    },
    {
      title: "Industrial Fault Detection",
      description: "IoT system using Raspberry Pi, Arduino, and tilt sensors to analyze machinery data in real-time for anomaly detection.",
      link: "#",
      tech: ["Raspberry Pi", "Arduino", "Python", "Sensors"],
    },
  ],
  awards: [
    "First Place: CodeAfrique & Art Exhibition Robotics Competition",
    "IT President: Kumasi Anglican Senior High School (Led 70+ students in programming)",
  ]
};
