"use client";

import { portfolioData } from "@/data/portfolio";

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

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 bg-[var(--retro-bg)] border-y border-[var(--retro-border)]">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-sm text-green-600 mb-3 block">
            $ LS SKILLS/
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-[var(--retro-fg)] mb-6 tracking-wide">
            TECHNICAL EXPERTISE
          </h2>
          <p className="font-mono text-base text-[var(--retro-fg)]/60 max-w-xl mx-auto leading-relaxed">
            A comprehensive skill set built through hands-on experience in data engineering, AI/ML development, 
            scalable backend services and cloud systems.
          </p>
        </div>

        {/* Skills Grid - 3x2 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category) => (
            <div 
              key={category.title}
              className="p-6 border border-[var(--retro-border)] bg-[var(--retro-bg)] hover:border-green-500/50 transition-colors"
            >
              <h3 className="font-mono font-bold text-xs text-green-600 mb-4 uppercase tracking-wider">
                {category.title}
              </h3>
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
    </section>
  );
};

export default SkillsSection;
