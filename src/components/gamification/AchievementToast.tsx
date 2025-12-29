"use client";

import React, { useEffect, useState } from 'react';
import { useGamification } from './GamificationProvider';
import { Achievement, LEVEL_NAMES } from '@/lib/gamification';

const AchievementToast: React.FC = () => {
  const { pendingToast, clearToast } = useGamification();
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (pendingToast) {
      setIsVisible(true);
      setIsLeaving(false);

      const timer = setTimeout(() => {
        setIsLeaving(true);
        setTimeout(() => {
          setIsVisible(false);
          clearToast();
        }, 300);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [pendingToast, clearToast]);

  if (!isVisible || !pendingToast) return null;

  const isAchievement = pendingToast.type === 'achievement';
  const achievement = isAchievement ? (pendingToast.data as Achievement) : null;
  const newLevel = !isAchievement ? (pendingToast.data as number) : null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] pointer-events-none">
      <div
        className={`
          bg-[var(--retro-card-bg)] border border-[var(--terminal-green)]/50
          rounded-lg p-4 font-mono shadow-2xl
          transform transition-all duration-300
          ${isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
        `}
        style={{
          boxShadow: '0 0 30px var(--terminal-glow), 0 10px 40px rgba(0,0,0,0.3)',
          minWidth: '280px',
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[var(--terminal-green)]/10 to-transparent pointer-events-none" />
        
        {isAchievement && achievement ? (
          <>
            {/* Achievement unlocked */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <div className="text-[var(--terminal-amber)] text-xs tracking-wider">
                    ACHIEVEMENT_UNLOCKED
                  </div>
                  <div className="text-[var(--terminal-green)] font-bold text-sm">
                    {achievement.name}
                  </div>
                </div>
              </div>
              
              <div className="text-[var(--retro-fg)]/70 text-xs mb-2">
                {achievement.description}
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[var(--terminal-cyan)]">+{achievement.xp} XP</span>
                <div className="flex-1 h-px bg-[var(--retro-border)]" />
                <span className="text-[var(--retro-fg)]/40">▸ LOGGED</span>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Level up */}
            <div className="relative z-10 text-center">
              <div className="text-[var(--terminal-amber)] text-xs tracking-wider mb-1">
                ▲ LEVEL_UP ▲
              </div>
              <div className="text-3xl font-bold text-[var(--terminal-green)] mb-1">
                LVL {newLevel}
              </div>
              <div className="text-[var(--retro-fg)]/70 text-sm">
                {LEVEL_NAMES[(newLevel || 1) - 1]}
              </div>
              <div className="mt-2 text-xs text-[var(--terminal-cyan)]">
                NEW_PRIVILEGES_UNLOCKED
              </div>
            </div>
          </>
        )}
        
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] rounded-lg overflow-hidden"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)',
          }}
        />
      </div>
    </div>
  );
};

export default AchievementToast;
