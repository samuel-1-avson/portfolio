"use client";

import { portfolioData } from "@/data/portfolio";

const expertiseCards = [
  {
    title: 'AI & Machine Learning',
    description: 'Expertise in building LLM-based systems, prompt engineering, and autonomous agents that reason about their environment.',
  },
  {
    title: 'Embedded Systems Design', 
    description: 'Designing high-performance firmware, real-time operating systems (RTOS), and hardware-in-the-loop simulations.',
  },
  {
    title: 'Blockchain Development',
    description: 'Developing secure smart contracts, decentralized applications (dApps), and integrating Web3 identities.',
  },
  {
    title: 'Cloud & System Architecture',
    description: 'Expertise in designing scalable, secure system architectures and deploying AI models to the edge and cloud.',
  },
];

const skillCategories = [
  {
    title: 'CORE COMPETENCIES',
    skills: ['Machine Learning', 'Data Engineering', 'LLOps', 'Agentic AI Systems', 'Robotics'],
  },
  {
    title: 'LANGUAGES',
    skills: ['Python', 'C++', 'SQL', 'TypeScript', 'JavaScript', 'Solidity', 'Bash'],
  },
  {
    title: 'AI & ML FRAMEWORKS',
    skills: ['PyTorch', 'LangChain', 'CrewAI', 'MLflow', 'DVC', 'Weights & Biases'],
  },
  {
    title: 'CLOUD & INFRASTRUCTURE',
    skills: ['AWS', 'Google Cloud Platform (GCP)', 'Kubernetes', 'Docker'],
  },
  {
    title: 'BACKEND & DATABASES',
    skills: ['FastAPI', 'Express.js', 'Next.js', 'Redis', 'Vector Databases (Chroma)'],
  },
  {
    title: 'SOFT SKILLS',
    skills: ['Problem-Solving', 'Adaptability', 'Effective Communication', 'Collaboration', 'Leadership'],
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-sm text-green-600 mb-3 block">
            $ CAT ABOUT.TXT
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-[var(--retro-fg)] mb-6">
            ABOUT ME
          </h2>
          <p className="font-mono text-base text-[var(--retro-fg)]/70 max-w-2xl mx-auto leading-relaxed">
            I&apos;m an AI Engineer and Embedded Systems Designer. 
            I build intelligent agents that can reason, plan, and execute tasks, while also designing the rugged hardware and firmware that brings them to life.
          </p>
        </div>

        {/* Expertise Cards - 2x2 Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {expertiseCards.map((card) => (
            <div 
              key={card.title}
              className="border border-[var(--retro-border)] p-6 bg-[var(--retro-bg)] hover:border-green-500/50 transition-colors"
            >
              <h3 className="font-mono font-bold text-base text-[var(--retro-fg)] mb-2">
                {card.title}
              </h3>
              <p className="font-mono text-sm text-[var(--retro-fg)]/60 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>

        {/* Skills Section */}
        <div className="border-t border-[var(--retro-border)] pt-16">
          <div className="mb-8 text-center">
            <span className="font-mono text-sm text-green-600 mb-3 block">
              $ LS SKILLS/
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-mono text-[var(--retro-fg)]">
              TECHNICAL EXPERTISE
            </h3>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skillCategories.map((category) => (
              <div 
                key={category.title}
                className="p-6 border border-[var(--retro-border)] bg-[var(--retro-bg)] hover:border-green-500/50 transition-colors"
              >
                <h4 className="font-mono font-bold text-xs text-green-600 mb-4 uppercase tracking-wider">
                  {category.title}
                </h4>
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  {category.skills.map((skill, idx) => (
                    <span 
                      key={skill}
                      className="text-sm font-mono text-[var(--retro-fg)]/80"
                    >
                      {skill}{idx < category.skills.length - 1 && <span className="text-green-600 ml-4">·</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
