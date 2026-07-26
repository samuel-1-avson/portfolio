"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  GamificationState,
  loadGamificationState,
  saveGamificationState,
  addXP as addXPHelper,
  unlockAchievement as unlockAchievementHelper,
  getXPProgress,
  LEVEL_NAMES,
  Achievement,
} from '@/lib/gamification';
import { portfolioData } from '@/data/portfolio';

interface GamificationContextType {
  state: GamificationState;
  addXP: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  levelName: string;
  xpProgress: { current: number; max: number; percentage: number };
  pendingToast: { type: 'achievement' | 'levelup'; data: Achievement | number } | null;
  clearToast: () => void;
  trackCommand: (command: string) => void;
  trackScroll: (depth: number) => void;
  trackProjectView: (slug: string) => void;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

export const useOptionalGamification = () => useContext(GamificationContext);

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [state, setState] = useState<GamificationState>(() => loadGamificationState());
  const [pendingToast, setPendingToast] = useState<{ type: 'achievement' | 'levelup'; data: Achievement | number } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  // Initialize and check for first visit / return visitor
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const currentState = loadGamificationState();
      const now = new Date();
      const newVisitCount = currentState.visitCount + 1;
      currentState.visitCount = newVisitCount;

      if (newVisitCount === 1) {
        const result = unlockAchievementHelper(currentState, 'first_visit');
        if (result.achievement) {
          setState(result.newState);
          setPendingToast({ type: 'achievement', data: result.achievement });
          saveGamificationState(result.newState);
          return;
        }
      }

      if (currentState.lastVisit && newVisitCount > 1) {
        const lastVisit = new Date(currentState.lastVisit);
        const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60);
        if (hoursSinceLastVisit > 24) {
          const result = unlockAchievementHelper(currentState, 'return_visitor');
          if (result.achievement) {
            setPendingToast({ type: 'achievement', data: result.achievement });
            Object.assign(currentState, result.newState);
          }
        }
      }

      if (now.getHours() >= 0 && now.getHours() < 4) {
        const result = unlockAchievementHelper(currentState, 'night_owl');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          Object.assign(currentState, result.newState);
        }
      }

      currentState.lastVisit = now;
      saveGamificationState(currentState);
      setState(currentState);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  // Global Konami Code Listener (↑ ↑ ↓ ↓ ← → ← → B A)
  useEffect(() => {
    const konamiSequence = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
      "b", "a"
    ];
    let sequenceIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = konamiSequence[sequenceIndex].length === 1
        ? konamiSequence[sequenceIndex].toLowerCase()
        : konamiSequence[sequenceIndex];

      if (key === expectedKey) {
        sequenceIndex++;
        if (sequenceIndex === konamiSequence.length) {
          sequenceIndex = 0;
          setState((prev) => {
            const result = unlockAchievementHelper(prev, "konami_code");
            if (result.achievement) {
              setPendingToast({ type: "achievement", data: result.achievement });
              saveGamificationState(result.newState);
              return result.newState;
            }
            return prev;
          });
        }
      } else {
        sequenceIndex = 0;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const addXP = useCallback((amount: number) => {
    setState(prev => {
      const result = addXPHelper(prev, amount);
      if (result.leveledUp && result.newLevel) {
        setPendingToast({ type: 'levelup', data: result.newLevel });
      }
      return result.newState;
    });
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setState(prev => {
      const result = unlockAchievementHelper(prev, id);
      if (result.achievement) {
        setPendingToast({ type: 'achievement', data: result.achievement });
      }
      return result.newState;
    });
  }, []);

  const clearToast = useCallback(() => {
    setPendingToast(null);
  }, []);

  const trackCommand = useCallback((command: string) => {
    setState(prev => {
      const newCommands = prev.commandsUsed.includes(command)
        ? prev.commandsUsed
        : [...prev.commandsUsed, command];
      
      let newState = { ...prev, commandsUsed: newCommands };
      
      // Check for first command achievement
      if (newCommands.length === 1) {
        const result = unlockAchievementHelper(newState, 'first_command');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          newState = result.newState;
        }
      }
      
      // Check for help command
      if (command.toLowerCase() === 'help') {
        const result = unlockAchievementHelper(newState, 'help_command');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          newState = result.newState;
        }
      }

      // Check for status or achievements command
      if (['status', 'achievements', 'rank', 'profile'].includes(command.toLowerCase())) {
        openModal();
      }
      
      saveGamificationState(newState);
      return newState;
    });
  }, [openModal]);

  const trackScroll = useCallback((depth: number) => {
    setState(prev => {
      if (depth <= prev.scrollDepth) return prev;
      
      const newState = { ...prev, scrollDepth: depth };
      
      // Check for scroll complete achievement at 95%
      if (depth >= 95 && !prev.achievements.find(a => a.id === 'scroll_complete')?.unlocked) {
        const result = unlockAchievementHelper(newState, 'scroll_complete');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          return result.newState;
        }
      }
      
      saveGamificationState(newState);
      return newState;
    });
  }, []);

  const trackProjectView = useCallback((slug: string) => {
    setState((prev) => {
      const currentViewed = prev.projectsViewed || [];
      if (currentViewed.includes(slug)) return prev;

      const newViewed = [...currentViewed, slug];
      let newState = { ...prev, projectsViewed: newViewed };

      // Check if all portfolio projects have been viewed
      if (newViewed.length >= portfolioData.projects.length) {
        const result = unlockAchievementHelper(newState, "all_projects");
        if (result.achievement) {
          setPendingToast({ type: "achievement", data: result.achievement });
          newState = result.newState;
        }
      }

      saveGamificationState(newState);
      return newState;
    });
  }, []);

  const value: GamificationContextType = {
    state,
    addXP,
    unlockAchievement,
    levelName: LEVEL_NAMES[state.level - 1] || 'VISITOR',
    xpProgress: getXPProgress(state.xp),
    pendingToast,
    clearToast,
    trackCommand,
    trackScroll,
    trackProjectView,
    isModalOpen,
    openModal,
    closeModal,
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationProvider;
