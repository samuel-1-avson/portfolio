"use client";

import { useState, useEffect } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setProgress(0);
      setHasError(false);
      
      // Faster loading animation
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setIsLoading(false), 200);
            return 100;
          }
          return prev + 20;
        });
      }, 80);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--retro-bg)] border border-[var(--retro-border)] w-full max-w-4xl h-[85vh] mx-4 flex flex-col font-mono animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="bg-[var(--retro-fg)] text-[var(--retro-bg)] px-4 py-2 flex items-center justify-between shrink-0">
          <span className="text-xs uppercase">RESUME_PREVIEW.PDF</span>
          <button 
            onClick={onClose}
            className="text-xs hover:opacity-70 transition-opacity"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="text-center p-8">
              <p className="text-sm text-[var(--retro-fg)] mb-2">
                [ LOADING RESUME DATA... ]
              </p>
              <p className="text-xs text-green-600 mb-4">
                processing_file.pdf
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
          ) : hasError ? (
            <div className="text-center p-8">
              <p className="text-sm text-red-500 mb-4">
                [ ERROR: resume.pdf not found ]
              </p>
              <p className="text-xs text-[var(--retro-fg)]/60 mb-6">
                Please add resume.pdf to the public folder
              </p>
              <a 
                href="/resume.pdf" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 border border-[var(--retro-border)] text-sm hover:border-green-500"
              >
                Try Opening Directly →
              </a>
            </div>
          ) : (
            <iframe 
              src="/resume.pdf"
              className="w-full h-full"
              title="Resume PDF"
              onError={() => setHasError(true)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[var(--retro-border)] flex justify-between items-center text-xs text-[var(--retro-fg)]/50 shrink-0">
          <span>$ cat resume.pdf</span>
          <div className="flex gap-4">
            <a 
              href="/resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-500"
            >
              [OPEN NEW TAB]
            </a>
            <a 
              href="/resume.pdf" 
              download 
              className="text-green-600 hover:text-green-500"
            >
              [DOWNLOAD]
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;
