"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import ProjectModal from "@/components/ProjectModal";

const ProjectsSection = () => {
  const [selectedProject, setSelectedProject] = useState<typeof portfolioData.projects[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openProject = (project: typeof portfolioData.projects[0]) => {
    if (project.link !== '#') {
      setSelectedProject(project);
      setIsModalOpen(true);
    }
  };

  // First two projects are featured
  const featuredProjects = portfolioData.projects.slice(0, 2);
  const otherProjects = portfolioData.projects.slice(2);

  return (
    <>
      <section id="projects" className="py-24 bg-transparent">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <span className="font-mono text-sm text-green-600 mb-3 block">
              $ LS -LA ./PROJECTS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold font-mono text-[var(--retro-fg)] mb-6">
              FEATURED PROJECTS
            </h2>
            <p className="font-mono text-base text-[var(--retro-fg)]/60 max-w-xl mx-auto leading-relaxed">
              Explorations in AI, Embedded Systems, and Blockchain.
            </p>
          </div>

          {/* Featured Projects Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {featuredProjects.map((project, idx) => (
              <div key={idx} className="font-mono border-2 border-green-500 bg-[var(--retro-bg)] relative overflow-hidden h-full flex flex-col">
                {/* Featured Badge */}
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-3 py-1 font-bold">
                  ★ FEATURED
                </div>
                
                {/* Terminal Header */}
                <div className="px-4 py-2 border-b border-green-500/30 flex items-center gap-2 bg-green-500/5">
                  <span className="text-green-500 text-xs font-bold">$</span>
                  <span className="text-xs text-green-600">
                    cat {project.title.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')}.py
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
                  
                  {/* Link */}
                  {project.link !== '#' && (
                    <button 
                      onClick={() => openProject(project)}
                      className="px-4 py-2 bg-green-500 text-white text-sm hover:bg-green-600 transition-colors w-full md:w-auto text-center"
                    >
                      View Project →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Other Projects Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {otherProjects.map((project, idx) => (
              <div key={idx} className="font-mono border border-[var(--retro-border)] bg-[var(--retro-bg)]">
                {/* Terminal Header - Minimal */}
                <div className="px-4 py-2 border-b border-[var(--retro-border)] flex items-center gap-2">
                  <span className="text-green-600 text-xs">$</span>
                  <span className="text-xs text-[var(--retro-fg)]/60">
                    cat {project.title.toLowerCase().replace(/\s+/g, '_').replace(/[()]/g, '')}.py
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
                  
                  {/* Tech Tags - Plain text style */}
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
                    {project.tech.map((t, i) => (
                      <span 
                        key={t}
                        className="text-xs text-[var(--retro-fg)]/50"
                      >
                        {t}{i < project.tech.length - 1 && <span className="text-green-600 ml-3">·</span>}
                      </span>
                    ))}
                  </div>
                  
                  {/* Link */}
                  {project.link !== '#' && (
                    <button 
                      onClick={() => openProject(project)}
                      className="text-sm text-green-600 hover:text-green-500"
                    >
                      View Source →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
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
