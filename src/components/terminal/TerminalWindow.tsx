"use client";

import React, { ReactNode } from 'react';

interface TerminalWindowProps {
  title?: string;
  children: ReactNode;
  className?: string;
  showControls?: boolean;
  variant?: 'default' | 'minimal' | 'glow';
  statusText?: string;
  isActive?: boolean;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  title = 'terminal.exe',
  children,
  className = '',
  showControls = true,
  variant = 'default',
  statusText,
  isActive = true,
}) => {
  const variants = {
    default: 'border-[var(--terminal-green)]/30',
    minimal: 'border-[var(--retro-border)]',
    glow: 'border-[var(--terminal-green)]/50 animate-terminal-glow',
  };

  return (
    <div
      className={`
        relative bg-[var(--retro-card-bg)] border rounded-lg overflow-hidden font-mono
        ${variants[variant]}
        ${className}
      `}
      style={{
        boxShadow: variant === 'glow' 
          ? '0 0 30px var(--terminal-glow), inset 0 0 60px rgba(0, 0, 0, 0.3)'
          : '0 0 20px var(--terminal-glow), inset 0 0 40px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Scanline Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
        }}
      />

      {/* Terminal Header */}
      <div className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-[var(--terminal-green)]/20 bg-[var(--retro-bg)]/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {showControls && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:bg-[#ff5f57]/80 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:bg-[#febc2e]/80 transition-colors cursor-pointer" />
              <div className="w-3 h-3 rounded-full bg-[#28c840] hover:bg-[#28c840]/80 transition-colors cursor-pointer" />
            </div>
          )}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[var(--terminal-green)] animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-[var(--terminal-green)] font-bold tracking-wider text-sm uppercase">
              {title}
            </span>
          </div>
        </div>
        
        {statusText && (
          <div className="text-[var(--retro-fg)]/50 text-xs tracking-wide">
            {statusText}
          </div>
        )}
      </div>

      {/* Terminal Body */}
      <div className="relative z-20 p-4 overflow-auto terminal-scrollbar">
        {children}
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[var(--terminal-green)]/40 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[var(--terminal-green)]/40 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[var(--terminal-green)]/40 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--terminal-green)]/40 rounded-br-lg pointer-events-none" />

      {/* Subtle Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: 'linear-gradient(var(--terminal-green) 1px, transparent 1px), linear-gradient(90deg, var(--terminal-green) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      />
    </div>
  );
};

export default TerminalWindow;
