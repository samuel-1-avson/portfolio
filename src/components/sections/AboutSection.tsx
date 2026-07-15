"use client";

import { portfolioData } from "@/data/portfolio";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";

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
    title: 'TECHNICAL SKILLS',
    skills: portfolioData.skills.technical,
  },
  {
    title: 'PROGRAMMING LANGUAGES',
    skills: portfolioData.skills.tools.slice(0, 8),
  },
  {
    title: 'AI/ML FRAMEWORKS',
    skills: portfolioData.skills.tools.filter((skill) => ['PyTorch', 'scikit-learn', 'LangChain', 'CrewAI', 'MLflow', 'RAG', 'Vector Databases'].includes(skill)),
  },
  {
    title: 'TOOLS & TECHNOLOGIES',
    skills: portfolioData.skills.tools.filter((skill) => ['GCP', 'AWS', 'Docker', 'Kubernetes', 'Git/GitHub', 'LLMs', 'ANNOY', 'Chroma', 'Prometheus/Grafana'].includes(skill)),
  },
  {
    title: 'BACKEND SERVICES & DATABASES',
    skills: portfolioData.skills.tools.filter((skill) => ['FastAPI', 'Express.js', 'Axum/Rust', 'Redis', 'PostgreSQL/Supabase', 'Neo4j', 'RabbitMQ', 'Firebase'].includes(skill)),
  },
  {
    title: 'SOFT SKILLS',
    skills: portfolioData.skills.soft,
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

        <div className="mt-16 grid gap-6 border-t border-[var(--retro-border)] pt-12 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="font-mono text-xs font-bold tracking-wider text-green-600">EDUCATION</p>
            {portfolioData.education.map((education) => <div key={education.degree} className="mt-4 rounded-lg border border-[var(--retro-border)] bg-[var(--retro-card-bg)] p-5">
              <h3 className="font-semibold text-[var(--retro-fg)]">{education.degree}</h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{education.school} · {education.period}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{education.details}</p>
            </div>)}
          </div>
          <div>
            <p className="font-mono text-xs font-bold tracking-wider text-green-600">RECOGNITION & LEADERSHIP</p>
            <ul className="mt-4 space-y-3">
              {portfolioData.awards.map((award) => {
                const links = portfolioData.awardLinks.filter((item) => item.award === award);

                return (
                  <li key={award} className="rounded-lg border border-[var(--retro-border)] bg-[var(--retro-card-bg)] p-4 text-sm leading-6 text-[var(--text-muted)]">
                    <div>
                      <span className="mr-2 text-green-600">✦</span>
                      <span>{award}</span>
                    </div>
                    {links.length > 0 && (
                      <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 pl-5">
                        {links.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-green-600 underline-offset-2 hover:underline"
                          >
                            <span>{link.label}</span>
                            <ExternalLinkIcon className="h-3.5 w-3.5" />
                          </a>
                        ))}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
