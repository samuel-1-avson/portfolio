"use client";

import { portfolioData } from "@/data/portfolio";

const ExperienceSection = () => {
  return (
    <section id="experience" className="py-24 bg-transparent">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-sm text-green-600 mb-3 block">
            $ CAT EXPERIENCE.LOG
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-mono text-[var(--retro-fg)] mb-6">
            PROFESSIONAL<br />EXPERIENCE
          </h2>
          <p className="font-mono text-base text-[var(--retro-fg)]/60 max-w-xl mx-auto leading-relaxed">
            A track record of delivering impactful AI solutions, building <span className="underline">robust</span> embedded systems, and deploying decentralized applications.
          </p>
        </div>

        {/* Experience Cards - Terminal Style */}
        <div className="space-y-4">
          {portfolioData.cv.map((exp, idx) => (
            <div key={idx} className="font-mono border border-[var(--retro-border)] bg-[var(--retro-bg)]">
              {/* Terminal Header - Minimal */}
              <div className="px-4 py-2 border-b border-[var(--retro-border)] flex items-center gap-2">
                <span className="text-green-600 text-xs">$</span>
                <span className="text-xs text-[var(--retro-fg)]/60">
                  cat {exp.company.toLowerCase().replace(/\s+/g, '_')}.log
                </span>
              </div>
              
              {/* Card Body */}
              <div className="p-6">
                {/* Role */}
                <h3 className="font-bold text-lg text-[var(--retro-fg)] mb-1">
                  {exp.role}
                </h3>
                
                {/* Company & Period */}
                <p className="text-sm text-[var(--retro-fg)]/50 mb-4">
                  {exp.company} · {exp.period}
                </p>
                
                {/* Description */}
                <p className="text-sm text-[var(--retro-fg)]/70 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
