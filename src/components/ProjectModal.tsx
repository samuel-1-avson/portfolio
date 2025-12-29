"use client";

import { useState, useEffect } from "react";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    link: string;
    tech: string[];
    details?: string;
  } | null;
}

const ProjectModal = ({ isOpen, onClose, project }: ProjectModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setProgress(0);
      
      // Simulate loading animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 300);
            return 100;
          }
          return prev + Math.random() * 25;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  // Extract repo name from GitHub URL
  const repoName = project.link.split('/').slice(-2).join('/');

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--retro-bg)] w-full max-w-2xl mx-4 flex flex-col font-mono animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="bg-[var(--retro-fg)] text-[var(--retro-bg)] px-4 py-2 flex items-center justify-between">
          <span className="text-xs uppercase">{project.title.toUpperCase().replace(/\s+/g, '_')}.REPO</span>
          <button 
            onClick={onClose}
            className="text-xs hover:opacity-70 transition-opacity"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-[var(--retro-fg)] mb-2">
                [ LOADING PROJECT DATA... ]
              </p>
              <p className="text-xs text-green-600 mb-4">
                fetching from github.com
              </p>
              
              {/* Progress bar */}
              <div className="w-64 h-2 border border-[var(--retro-border)] bg-transparent mx-auto mb-4">
                <div 
                  className="h-full bg-green-500 transition-all duration-100"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              
              <p className="text-xs text-[var(--retro-fg)]/50">
                {Math.min(Math.round(progress), 100)}% COMPLETE
              </p>
            </div>
          ) : (
            <div>
              {/* Project Title */}
              <h3 className="text-2xl font-bold text-[var(--retro-fg)] mb-2">
                {project.title}
              </h3>
              
              {/* Repo URL */}
              <p className="text-xs text-green-600 mb-6">
                github.com/{repoName}
              </p>

              {/* Description or Rich Details */}
              <div className="mb-6">
                <p className="text-xs text-[var(--retro-fg)]/50 mb-2">$ cat {project.details ? 'DOCUMENTATION.md' : 'README.md'}</p>
                
                {project.details ? (
                  <div className="text-sm text-[var(--retro-fg)]/80 leading-relaxed h-[40vh] overflow-y-auto pr-2 custom-scrollbar font-mono">
                    {project.details.split('\n').map((line, i) => {
                      // Header 1
                      if (line.startsWith('# ')) {
                        return <h1 key={i} className="text-xl font-bold text-green-500 mt-6 mb-3">{line.replace('# ', '')}</h1>;
                      }
                      // Header 2
                      if (line.startsWith('## ')) {
                        return <h2 key={i} className="text-lg font-bold text-[var(--retro-fg)] mt-5 mb-2 border-b border-[var(--retro-border)] pb-1">{line.replace('## ', '')}</h2>;
                      }
                      // Bold lines (simple check)
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return <p key={i} className="font-bold text-[var(--retro-fg)] mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>;
                      }
                      // List items
                      if (line.trim().startsWith('- ')) {
                        return (
                          <div key={i} className="flex gap-2 mb-1 ml-2">
                            <span className="text-green-600">•</span>
                            <span>{line.replace('- ', '')}</span>
                          </div>
                        );
                      }
                      // Empty lines
                      if (line.trim() === '') {
                        return <div key={i} className="h-2" />;
                      }
                      // Normal text
                      return <p key={i} className="mb-1 opacity-90">{line}</p>;
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--retro-fg)]/80 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <p className="text-xs text-[var(--retro-fg)]/50 mb-2">$ cat package.json | grep dependencies</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span 
                      key={t}
                      className="px-3 py-1 border border-[var(--retro-border)] text-xs text-[var(--retro-fg)]/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-[var(--retro-border)]">
                <a 
                  href={project.link} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                >
                  Open in GitHub →
                </a>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 border border-[var(--retro-border)] text-sm text-[var(--retro-fg)] hover:border-green-500 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
