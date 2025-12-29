"use client";

import { useState, useEffect } from "react";

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: {
    title: string;
    date: string;
    description: string;
    tags: string[];
    url: string;
    githubUrl?: string;
  } | null;
}

const BlogModal = ({ isOpen, onClose, post }: BlogModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setProgress(0);
      
      // Fast loading animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 200);
            return 100;
          }
          return prev + 25;
        });
      }, 60);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen || !post) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--retro-bg)] border border-[var(--retro-border)] w-full max-w-2xl mx-4 flex flex-col font-mono animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="bg-[var(--retro-fg)] text-[var(--retro-bg)] px-4 py-2 flex items-center justify-between">
          <span className="text-xs uppercase">{post.title.toUpperCase().replace(/\s+/g, '_')}.MD</span>
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
            <div className="py-8 text-center">
              <p className="text-sm text-[var(--retro-fg)] mb-2">
                [ FETCHING ARTICLE... ]
              </p>
              <p className="text-xs text-green-600 mb-4">
                loading post data
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
              {/* Date */}
              <p className="text-xs text-green-600 mb-2">
                DATE: {post.date}
              </p>

              {/* Title */}
              <h3 className="text-2xl font-bold text-[var(--retro-fg)] mb-4">
                {post.title}
              </h3>

              {/* Description */}
              <div className="mb-6">
                <p className="text-xs text-[var(--retro-fg)]/50 mb-2">$ cat summary.txt</p>
                <p className="text-sm text-[var(--retro-fg)]/80 leading-relaxed">
                  {post.description}
                </p>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <p className="text-xs text-[var(--retro-fg)]/50 mb-2">$ cat tags.json</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-3 py-1 border border-[var(--retro-border)] text-xs text-[var(--retro-fg)]/80"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--retro-border)]">
                <a 
                  href={post.url} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-green-500 text-white text-sm hover:bg-green-600 transition-colors"
                >
                  Read Full Article
                </a>
                {post.githubUrl && (
                  <a 
                    href={post.githubUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-[var(--retro-border)] text-sm text-[var(--retro-fg)] hover:border-green-500 hover:text-green-600 transition-colors flex items-center gap-2"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    View Implementation
                  </a>
                )}
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

export default BlogModal;
