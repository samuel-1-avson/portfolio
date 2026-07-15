"use client";

import { useEffect, useRef, useState } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ResumeModal = ({ isOpen, onClose }: ResumeModalProps) => {
  const [hasError, setHasError] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeButton.current?.focus(), 0);
    return () => { document.removeEventListener("keydown", onKeyDown); document.body.style.overflow = ""; previous?.focus(); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="resume-dialog-title"
        className="bg-[var(--retro-bg)] border border-[var(--retro-border)] w-full max-w-4xl h-[85vh] mx-4 flex flex-col font-mono animate-fadeIn"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <div className="bg-[var(--retro-fg)] text-[var(--retro-bg)] px-4 py-2 flex items-center justify-between shrink-0">
          <span id="resume-dialog-title" className="text-xs uppercase">RESUME_PREVIEW.PDF</span>
          <button 
            ref={closeButton}
            onClick={onClose}
            className="text-xs hover:opacity-70 transition-opacity"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          {hasError ? (
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
      </section>
    </div>
  );
};

export default ResumeModal;
