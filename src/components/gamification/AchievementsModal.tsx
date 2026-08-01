"use client";

import { useEffect, useRef } from "react";
import { useGamification } from "./GamificationProvider";
import AchievementIcon from "@/components/icons/AchievementIcons";

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const { state, levelName, xpProgress } = useGamification();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const unlockedCount = state.achievements.filter((a) => a.unlocked).length;

  return (
    <div
      className="fixed inset-0 z-[70] grid place-items-center bg-black/80 p-4 backdrop-blur-md font-mono"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="achievements-dialog-title"
        className="terminal-scrollbar max-h-[88vh] w-full max-w-2xl overflow-y-auto border-2 border-green-500 bg-[var(--retro-bg)] shadow-[0_0_50px_rgba(34,197,94,0.25)]"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Terminal Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-green-500/40 bg-[var(--retro-card-bg)] px-5 py-3 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="font-mono text-xs font-bold tracking-wider text-[var(--retro-fg)]">
              SYSTEM_STATUS // PLAYER_PROFILE
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="border border-[var(--retro-border)] px-3 py-1 text-xs font-mono text-[var(--retro-fg)] transition-colors hover:border-green-500 hover:text-green-500"
          >
            [X] CLOSE
          </button>
        </header>

        {/* Modal Content */}
        <div className="p-6">
          {/* Level Summary Banner */}
          <div className="mb-6 border border-green-500/40 bg-green-500/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div>
                <span className="text-xs font-bold text-green-600 block mb-1">
                  CURRENT RANK & PRIVILEGES
                </span>
                <h2 id="achievements-dialog-title" className="text-2xl font-bold text-[var(--retro-fg)]">
                  LVL {state.level} — <span className="text-green-500">{levelName}</span>
                </h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-[var(--text-subtle)] font-bold block mb-1">TOTAL EXPERIENCE</span>
                <span className="text-xl font-bold text-green-500">{state.xp} XP</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-3 w-full bg-[var(--retro-border)] overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${xpProgress.percentage}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-[var(--retro-fg)]/60">
              <span>Progress to next rank: {Math.round(xpProgress.percentage)}%</span>
              <span>{xpProgress.current} / {xpProgress.max} XP needed</span>
            </div>
          </div>

          {/* Badges Progress Header */}
          <div className="mb-4 flex items-center justify-between border-b border-[var(--retro-border)] pb-2">
            <span className="text-xs font-bold text-green-600">$ CAT ./ACHIEVEMENTS.LOG</span>
            <span className="text-xs font-bold text-[var(--retro-fg)]/80">
              UNLOCKED: <span className="text-green-500">{unlockedCount}</span> / {state.achievements.length}
            </span>
          </div>

          {/* Achievements Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {state.achievements.map((ach) => (
              <div
                key={ach.id}
                className={`border p-4 transition-colors ${
                  ach.unlocked
                    ? "border-green-500/60 bg-green-500/10 text-[var(--retro-fg)]"
                    : "border-[var(--retro-border)] bg-[var(--retro-card-bg)]/40 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 border ${ach.unlocked ? "border-green-500/50 bg-green-500/20 text-green-500" : "border-[var(--retro-border)] text-[var(--retro-fg)]/40"}`}>
                      <AchievementIcon id={ach.id} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${ach.unlocked ? "text-green-500" : "text-[var(--retro-fg)]"}`}>
                        {ach.name}
                      </h3>
                      <span className="text-[10px] text-green-600 font-bold">+{ach.xp} XP</span>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                      ach.unlocked
                        ? "bg-green-500 text-white"
                        : "border border-[var(--retro-border)] text-[var(--text-subtle)]"
                    }`}
                  >
                    {ach.unlocked ? "UNLOCKED ✓" : "LOCKED"}
                  </span>
                </div>
                <p className="text-xs text-[var(--retro-fg)]/70 leading-relaxed">
                  {ach.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
