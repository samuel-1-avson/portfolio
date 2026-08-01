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

        {/* Education and Recognition Section */}
        <div className="mt-20 border-t border-[var(--retro-border)] pt-16 font-mono">
          <div className="mb-10 text-center">
            <span className="font-mono text-sm text-green-600 mb-3 block">
              $ CAT ./EDUCATION_AND_HONORS.TXT
            </span>
            <h3 className="text-2xl md:text-3xl font-bold font-mono text-[var(--retro-fg)] uppercase tracking-tight">
              ACADEMIC & RECOGNITION HIGHLIGHTS
            </h3>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Education Card */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                  EDUCATION & ACADEMICS
                </span>
                <span className="text-[10px] text-[var(--text-subtle)] border border-[var(--retro-border)] px-2 py-0.5 rounded">
                  LOG: DEGREE
                </span>
              </div>
              {portfolioData.education.map((education) => (
                <div 
                  key={education.degree} 
                  className="border border-[var(--retro-border)] bg-[var(--retro-bg)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden"
                >
                  <div className="px-4 py-2 border-b border-[var(--retro-border)] flex items-center justify-between bg-[var(--retro-card-bg)]">
                    <div className="flex items-center gap-2">
                      <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs text-[var(--retro-fg)] font-semibold">$ cat degree_info.edu</span>
                    </div>
                    <span className="text-[10px] text-green-600 font-bold">{education.period}</span>
                  </div>

                  <div className="p-6">
                    <h4 className="text-lg font-bold text-[var(--retro-fg)] mb-1">
                      {education.degree}
                    </h4>
                    <p className="text-xs text-green-600 font-semibold mb-4">
                      {education.school}
                    </p>

                    {/* Academic Standing Badge */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      <span className="px-2.5 py-1 text-xs border border-green-500/40 text-green-600 bg-green-500/10 font-bold">
                        Standing: Second Upper
                      </span>
                    </div>

                    {/* Coursework Tags */}
                    <div>
                      <p className="text-[11px] text-[var(--text-subtle)] uppercase tracking-wider mb-2 font-bold">
                        Relevant Coursework:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Artificial Intelligence', 'Data Structures & Algorithms', 'Database Systems', 'Data Science', 'Probability & Statistics', 'Embedded Systems', 'Linear Algebra', 'Robotics'].map((course) => (
                          <span 
                            key={course} 
                            className="px-2.5 py-1 text-xs border border-[var(--retro-border)] text-[var(--retro-fg)]/90 bg-[var(--retro-card-bg)]"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recognition & Leadership Card */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                  RECOGNITION & LEADERSHIP
                </span>
                <span className="text-[10px] text-[var(--text-subtle)] border border-[var(--retro-border)] px-2 py-0.5 rounded">
                  LOG: AWARDS
                </span>
              </div>

              <div className="border border-[var(--retro-border)] bg-[var(--retro-bg)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden h-full flex flex-col">
                <div className="px-4 py-2 border-b border-[var(--retro-border)] flex items-center gap-2 bg-[var(--retro-card-bg)]">
                  <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs text-[var(--retro-fg)] font-semibold">$ cat achievements.json</span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <ul className="space-y-4">
                    {portfolioData.awards.map((award) => {
                      const links = portfolioData.awardLinks.filter((item) => item.award === award);

                      return (
                        <li key={award} className="border-b border-[var(--retro-border)]/60 pb-4 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-2.5">
                            <span className="text-green-500 font-bold text-base leading-none">✦</span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-[var(--retro-fg)] leading-relaxed">
                                {award}
                              </p>
                              {links.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {links.map((link) => (
                                    <a
                                      key={link.href}
                                      href={link.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 rounded border border-green-500/40 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 transition hover:bg-green-500 hover:text-white"
                                    >
                                      <span>{link.label}</span>
                                      <ExternalLinkIcon className="h-3 w-3" />
                                    </a>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
