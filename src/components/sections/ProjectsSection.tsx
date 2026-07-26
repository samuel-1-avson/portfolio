"use client";

import { useState } from "react";
import { portfolioData, type Project } from "@/data/portfolio";
import ProjectModal from "@/components/ProjectModal";
import { ExternalLinkIcon } from "@/components/icons/ExternalLinkIcon";
import { useOptionalGamification } from "@/components/gamification/GamificationProvider";

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gamification = useOptionalGamification();

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    gamification?.addXP(25);
    gamification?.trackProjectView(project.slug);
  };

  // Split projects: Featured (has live demo) vs Other Explorations
  const featuredProjects = portfolioData.projects.filter((p) => Boolean(p.demo));
  const otherProjects = portfolioData.projects.filter((p) => !p.demo);

  return (
    <>
      <section id="projects" className="py-24 bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <span className="font-mono text-sm text-green-600 mb-3 block">
              $ LS -LA ./FEATURED_PROJECTS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-[var(--retro-fg)] mb-6">
              FEATURED PROJECTS & LIVE DEMOS
            </h2>
            <p className="font-mono text-base text-[var(--retro-fg)]/60 max-w-xl mx-auto leading-relaxed">
              Production systems, live web deployments, and AI/Blockchain platforms.
            </p>
          </div>

          {/* Featured Projects Grid (Sharp Square Corners) */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {featuredProjects.map((project, idx) => (
              <div
                key={project.slug}
                className="font-mono border-2 border-green-500 bg-[var(--retro-bg)] relative overflow-hidden h-full flex flex-col"
              >
                {/* Featured Badge (Square) */}
                <div className="absolute top-0 right-0 bg-green-500 px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-white">
                  FEATURED / 0{idx + 1}
                </div>

                {/* Terminal Header */}
                <div className="px-4 py-2 border-b border-green-500/30 flex items-center gap-2 bg-green-500/5">
                  <span className="text-green-500 text-xs font-bold">$</span>
                  <span className="text-xs text-green-600 font-mono">
                    cat {project.slug.replace(/-/g, "_")}.py
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  {/* Title */}
                  <h3 className="font-bold text-xl md:text-2xl text-[var(--retro-fg)] mb-4">
                    <span className="text-green-500 mr-2">→</span>
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-[var(--retro-fg)]/70 leading-relaxed mb-5 flex-1">
                    {project.description}
                  </p>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 border border-green-500/40 text-xs text-green-600 bg-green-500/5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Metadata */}
                  <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-subtle)]">
                    <span className="text-green-500 font-bold">{project.status.replace("-", " ")}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--terminal-green)]" />
                    <span>{project.role}</span>
                  </div>

                  {/* Action Buttons (Square) */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openProject(project)}
                      className="bg-green-500 px-4 py-2 text-sm text-white font-bold transition-colors hover:bg-green-600"
                    >
                      View case study
                    </button>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-green-500 bg-green-500/10 px-3 py-2 text-xs font-bold text-green-600 transition hover:bg-green-500 hover:text-white"
                      >
                        <span>Live demo</span>
                        <ExternalLinkIcon />
                      </a>
                    )}
                    {project.link && project.link !== "#" && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 border border-[var(--retro-border)] px-3 py-2 text-xs text-[var(--retro-fg)] transition hover:border-[var(--terminal-green)] hover:text-[var(--terminal-green)]"
                      >
                        <span>Source</span>
                        <ExternalLinkIcon />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Other Systems Section Header */}
          {otherProjects.length > 0 && (
            <>
              <div className="mb-8 text-center pt-8 border-t border-[var(--retro-border)]">
                <span className="font-mono text-sm text-[var(--text-subtle)] mb-2 block">
                  $ LS ./OTHER_EXPLORATIONS
                </span>
                <h3 className="text-2xl font-bold font-mono text-[var(--retro-fg)]">
                  ADDITIONAL SYSTEM EXPLORATIONS & PROTOTYPES
                </h3>
              </div>

              {/* Other Projects Grid (Sharp Square Corners) */}
              <div className="grid md:grid-cols-2 gap-4">
                {otherProjects.map((project) => (
                  <div key={project.slug} className="font-mono border border-[var(--retro-border)] bg-[var(--retro-bg)]">
                    {/* Terminal Header */}
                    <div className="px-4 py-2 border-b border-[var(--retro-border)] flex items-center gap-2">
                      <span className="text-green-600 text-xs">$</span>
                      <span className="text-xs text-[var(--retro-fg)]/60">
                        cat {project.slug.replace(/-/g, "_")}.py
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="font-bold text-lg text-[var(--retro-fg)] mb-3">
                        <span className="text-green-600 mr-2">→</span>
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-[var(--retro-fg)]/70 leading-relaxed mb-4">
                        {project.description}
                      </p>

                      {/* Tech Tags */}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                        {project.tech.map((t, i) => (
                          <span key={t} className="text-xs text-[var(--retro-fg)]/50">
                            {t}{i < project.tech.length - 1 && <span className="text-green-600 ml-3">·</span>}
                          </span>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => openProject(project)}
                          className="text-sm text-green-600 font-bold transition-colors hover:text-green-500"
                        >
                          View case study
                        </button>
                        {project.link && project.link !== "#" && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] transition hover:text-[var(--terminal-green)]"
                          >
                            <span>Source</span>
                            <ExternalLinkIcon className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
      />
    </>
  );
};

export default ProjectsSection;
