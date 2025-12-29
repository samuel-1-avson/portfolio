"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  GamificationState,
  loadGamificationState,
  saveGamificationState,
  addXP as addXPHelper,
  unlockAchievement as unlockAchievementHelper,
  getLevelFromXP,
  getXPProgress,
  LEVEL_NAMES,
  Achievement,
} from '@/lib/gamification';

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
}

const GamificationContext = createContext<GamificationContextType | null>(null);

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }
  return context;
};

interface GamificationProviderProps {
  children: ReactNode;
}

export const GamificationProvider: React.FC<GamificationProviderProps> = ({ children }) => {
  const [state, setState] = useState<GamificationState>(() => loadGamificationState());
  const [pendingToast, setPendingToast] = useState<{ type: 'achievement' | 'levelup'; data: Achievement | number } | null>(null);

  // Initialize and check for first visit / return visitor
  useEffect(() => {
    const currentState = loadGamificationState();
    const now = new Date();
    
    // Increment visit count
    const newVisitCount = currentState.visitCount + 1;
    currentState.visitCount = newVisitCount;
    
    // Check for first visit achievement
    if (newVisitCount === 1) {
      const result = unlockAchievementHelper(currentState, 'first_visit');
      if (result.achievement) {
        setState(result.newState);
        setPendingToast({ type: 'achievement', data: result.achievement });
        saveGamificationState(result.newState);
        return;
      }
    }
    
    // Check for return visitor
    if (currentState.lastVisit && newVisitCount > 1) {
      const lastVisit = new Date(currentState.lastVisit);
      const hoursSinceLastVisit = (now.getTime() - lastVisit.getTime()) / (1000 * 60 * 60);
      
      if (hoursSinceLastVisit > 24) {
        const result = unlockAchievementHelper(currentState, 'return_visitor');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          currentState.xp = result.newState.xp;
          currentState.level = result.newState.level;
          currentState.achievements = result.newState.achievements;
        }
      }
    }
    
    // Check for night owl
    const hour = now.getHours();
    if (hour >= 0 && hour < 4) {
      const result = unlockAchievementHelper(currentState, 'night_owl');
      if (result.achievement) {
        setPendingToast({ type: 'achievement', data: result.achievement });
        currentState.xp = result.newState.xp;
        currentState.level = result.newState.level;
        currentState.achievements = result.newState.achievements;
      }
    }
    
    currentState.lastVisit = now;
    saveGamificationState(currentState);
    setState(currentState);
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
      
      const newState = { ...prev, commandsUsed: newCommands };
      
      // Check for first command achievement
      if (newCommands.length === 1) {
        const result = unlockAchievementHelper(newState, 'first_command');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          return result.newState;
        }
      }
      
      // Check for help command
      if (command.toLowerCase() === 'help') {
        const result = unlockAchievementHelper(newState, 'help_command');
        if (result.achievement) {
          setPendingToast({ type: 'achievement', data: result.achievement });
          return result.newState;
        }
      }
      
      saveGamificationState(newState);
      return newState;
    });
  }, []);

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
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationProvider;
