"use client";

import React, { useEffect } from 'react';
import { useGamification } from './GamificationProvider';
import { Achievement, LEVEL_NAMES } from '@/lib/gamification';

const AchievementToast: React.FC = () => {
  const { pendingToast, clearToast } = useGamification();
  useEffect(() => {
    if (!pendingToast) return;

    const timer = window.setTimeout(clearToast, 4000);
    return () => window.clearTimeout(timer);
  }, [pendingToast, clearToast]);

  if (!pendingToast) return null;

  const isAchievement = pendingToast.type === 'achievement';
  const achievement = isAchievement ? (pendingToast.data as Achievement) : null;
  const newLevel = !isAchievement ? (pendingToast.data as number) : null;

  return (
    <div className="fixed bottom-6 right-6 z-[9998] pointer-events-none font-mono">
      <div
        className="relative border-2 border-green-500 bg-[var(--retro-card-bg)] p-4 shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-300 min-w-[280px]"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent pointer-events-none" />

        {isAchievement && achievement ? (
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl select-none">{achievement.icon}</span>
              <div className="flex-1">
                <div className="text-xs font-bold text-amber-400 tracking-wider">
                  ACHIEVEMENT_UNLOCKED
                </div>
                <div className="text-sm font-bold text-green-500">
                  {achievement.name}
                </div>
              </div>
            </div>

            <div className="text-xs text-[var(--retro-fg)]/75 mb-2.5 leading-relaxed">
              {achievement.description}
            </div>

            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="text-[var(--terminal-cyan)]">+{achievement.xp} XP</span>
              <div className="flex-1 h-px bg-[var(--retro-border)]" />
              <span className="text-green-500">▸ LOGGED</span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 text-center">
            <div className="text-xs font-bold text-amber-400 tracking-wider mb-1">
              ▲ LEVEL_UP ▲
            </div>
            <div className="text-3xl font-bold text-green-500 mb-1">
              LVL {newLevel}
            </div>
            <div className="text-sm font-bold text-[var(--retro-fg)]/80">
              {LEVEL_NAMES[(newLevel || 1) - 1]}
            </div>
            <div className="mt-2 text-xs font-bold text-[var(--terminal-cyan)]">
              NEW_PRIVILEGES_UNLOCKED
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementToast;
