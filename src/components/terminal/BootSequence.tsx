"use client";

import React, { useState, useEffect, useCallback } from 'react';

interface BootSequenceProps {
  onComplete?: () => void;
  skipDelay?: number;
  showSkip?: boolean;
}

const bootMessages = [
  { text: 'BIOS v2.0.4 - INITIALIZING...', delay: 0 },
  { text: 'PERFORMING MEMORY CHECK...', delay: 400 },
  { text: 'RAM: 16384 MB OK', delay: 800, color: 'green' },
  { text: 'CPU: NEURAL_CORE x8 @ 4.2GHz', delay: 1000, color: 'cyan' },
  { text: 'GPU: AI_ACCELERATOR DETECTED', delay: 1200, color: 'cyan' },
  { text: '', delay: 1400 },
  { text: 'LOADING KERNEL MODULES...', delay: 1500 },
  { text: '  ├─ pytorch.ko [OK]', delay: 1700, color: 'green', indent: true },
  { text: '  ├─ tensorflow.ko [OK]', delay: 1850, color: 'green', indent: true },
  { text: '  ├─ blockchain.ko [OK]', delay: 2000, color: 'green', indent: true },
  { text: '  └─ creativity.ko [OK]', delay: 2150, color: 'green', indent: true },
  { text: '', delay: 2300 },
  { text: 'MOUNTING NEURAL NETWORKS...', delay: 2400 },
  { text: 'ESTABLISHING DATA PIPELINES...', delay: 2700 },
  { text: 'LOADING USER PROFILE: SAMUEL_AVORNYOH', delay: 3000, color: 'amber' },
  { text: '', delay: 3200 },
  { text: '╔══════════════════════════════════════════╗', delay: 3400, color: 'green' },
  { text: '║     SYSTEM BOOT COMPLETE                 ║', delay: 3500, color: 'green' },
  { text: '║     STATUS: ALL SYSTEMS OPERATIONAL      ║', delay: 3600, color: 'green' },
  { text: '╚══════════════════════════════════════════╝', delay: 3700, color: 'green' },
  { text: '', delay: 3900 },
  { text: '> WELCOME TO SAMUEL_OS', delay: 4000, color: 'green', glow: true },
  { text: '> LOADING INTERFACE...', delay: 4300 },
];

const BootSequence: React.FC<BootSequenceProps> = ({
  onComplete,
  skipDelay = 1000,
  showSkip = true,
}) => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [canSkip, setCanSkip] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleComplete = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsComplete(true);
      onComplete?.();
    }, 500);
  }, [onComplete]);

  const handleSkip = useCallback(() => {
    if (canSkip) {
      handleComplete();
    }
  }, [canSkip, handleComplete]);

  useEffect(() => {
    // Enable skip after delay
    const skipTimer = setTimeout(() => setCanSkip(true), skipDelay);

    // Show boot messages progressively
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
        setProgress(((index + 1) / bootMessages.length) * 100);
      }, msg.delay);
    });

    // Complete boot sequence
    const completeTimer = setTimeout(() => {
      handleComplete();
    }, bootMessages[bootMessages.length - 1].delay + 800);

    return () => {
      clearTimeout(skipTimer);
      clearTimeout(completeTimer);
    };
  }, [skipDelay, handleComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSkip]);

  if (isComplete) return null;

  const getColorClass = (color?: string, glow?: boolean) => {
    const baseColors: Record<string, string> = {
      green: 'text-[var(--terminal-green)]',
      cyan: 'text-[var(--terminal-cyan)]',
      amber: 'text-[var(--terminal-amber)]',
      red: 'text-[var(--terminal-red)]',
    };
    
    let className = color ? baseColors[color] : 'text-[var(--retro-fg)]/80';
    if (glow) className += ' text-glow';
    return className;
  };

  return (
    <div
      className={`
        fixed inset-0 z-[9999] bg-[var(--retro-bg)] flex flex-col
        transition-opacity duration-500
        ${isExiting ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* CRT Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none crt-effect" />
      
      {/* Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.15) 2px, rgba(0, 0, 0, 0.15) 4px)',
        }}
      />

      {/* Boot Content */}
      <div className="flex-1 overflow-hidden p-8 md:p-16 font-mono text-sm">
        <div className="max-w-3xl">
          {bootMessages.map((msg, index) => (
            <div
              key={index}
              className={`
                ${getColorClass(msg.color, msg.glow)}
                ${msg.indent ? 'ml-4' : ''}
                transition-all duration-300
                ${visibleLines.includes(index) 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-4'}
              `}
              style={{
                transitionDelay: `${index * 20}ms`,
                minHeight: msg.text ? 'auto' : '1.5em',
              }}
            >
              {msg.text || '\u00A0'}
            </div>
          ))}
          
          {/* Cursor */}
          {!isExiting && (
            <span className="inline-block w-2.5 h-5 bg-[var(--terminal-green)] animate-cursor-blink mt-2" />
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-8 md:px-16 pb-4">
        <div className="max-w-3xl">
          <div className="h-1 bg-[var(--retro-border)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[var(--terminal-green)] transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Skip Button */}
      {showSkip && canSkip && !isExiting && (
        <div className="absolute bottom-8 right-8 md:right-16">
          <button
            onClick={handleSkip}
            className="text-[var(--retro-fg)]/50 hover:text-[var(--terminal-green)] text-xs font-mono transition-colors flex items-center gap-2"
          >
            <span>PRESS ENTER TO SKIP</span>
            <span className="inline-block animate-pulse">→</span>
          </button>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 text-[var(--terminal-green)]/30 font-mono text-xs">
        BOOT_SEQ v2.0.4
      </div>
    </div>
  );
};

export default BootSequence;
