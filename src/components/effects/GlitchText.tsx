"use client";

import React, { useState, useRef, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
  glitchOnHover?: boolean;
  autoGlitch?: boolean;
  autoGlitchInterval?: number;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className = '',
  as: Component = 'span',
  glitchOnHover = true,
  autoGlitch = false,
  autoGlitchInterval = 5000,
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoGlitch) {
      const triggerGlitch = () => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 300);
      };

      const interval = setInterval(triggerGlitch, autoGlitchInterval);
      return () => clearInterval(interval);
    }
  }, [autoGlitch, autoGlitchInterval]);

  const handleMouseEnter = () => {
    if (glitchOnHover && !isGlitching) {
      setIsGlitching(true);
      glitchTimeoutRef.current = setTimeout(() => {
        setIsGlitching(false);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (glitchTimeoutRef.current) {
      clearTimeout(glitchTimeoutRef.current);
    }
  };

  return (
    <Component
      className={`
        relative inline-block
        ${className}
        ${isGlitching ? 'animate-glitch' : ''}
      `}
      data-text={text}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
      }}
    >
      {text}
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 text-[var(--terminal-cyan)]"
            style={{
              left: '2px',
              textShadow: '-2px 0 var(--terminal-red)',
              animation: 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
              clipPath: 'inset(10% 0 60% 0)',
            }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute inset-0 text-[var(--terminal-red)]"
            style={{
              left: '-2px',
              textShadow: '2px 0 var(--terminal-cyan)',
              animation: 'glitch 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both',
              clipPath: 'inset(50% 0 20% 0)',
            }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </Component>
  );
};

export default GlitchText;
