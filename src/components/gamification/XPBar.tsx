"use client";

import React from 'react';
import { useGamification } from './GamificationProvider';
import { LEVEL_NAMES } from '@/lib/gamification';

interface XPBarProps {
  className?: string;
  showLevel?: boolean;
  compact?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ 
  className = '', 
  showLevel = true,
  compact = false,
}) => {
  const { state, levelName, xpProgress } = useGamification();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 font-mono text-xs ${className}`}>
        <span className="text-[var(--terminal-green)]">LVL {state.level}</span>
        <div className="w-20 h-1.5 bg-[var(--retro-border)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--terminal-green)] transition-all duration-500"
            style={{ width: `${xpProgress.percentage}%` }}
          />
        </div>
        <span className="text-[var(--retro-fg)]/50">{state.xp} XP</span>
      </div>
    );
  }

  return (
    <div className={`font-mono ${className}`}>
      {showLevel && (
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[var(--terminal-green)] text-sm font-bold">
              LVL {state.level}
            </span>
            <span className="text-[var(--retro-fg)]/70 text-xs">
              {levelName}
            </span>
          </div>
          <span className="text-[var(--retro-fg)]/50 text-xs">
            {state.xp} / {xpProgress.current + xpProgress.max} XP
          </span>
        </div>
      )}
      
      <div className="relative h-3 bg-[var(--retro-border)] rounded overflow-hidden">
        {/* Progress bar */}
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--terminal-green)] to-[var(--terminal-cyan)] transition-all duration-500 ease-out"
          style={{ width: `${xpProgress.percentage}%` }}
        />
        
        {/* Animated shine */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
            animation: 'data-flow 2s linear infinite',
            backgroundSize: '200% 100%',
          }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10%, rgba(0,0,0,0.2) 10%, rgba(0,0,0,0.2) 10.5%)',
          }}
        />
      </div>
      
      {/* Next level preview */}
      {state.level < LEVEL_NAMES.length && (
        <div className="mt-1 flex items-center justify-between text-[10px] text-[var(--retro-fg)]/40">
          <span>{xpProgress.current} / {xpProgress.max}</span>
          <span>→ {LEVEL_NAMES[state.level]}</span>
        </div>
      )}
    </div>
  );
};

export default XPBar;
