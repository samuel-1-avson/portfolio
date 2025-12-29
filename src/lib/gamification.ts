// Gamification State Management
export interface Achievement {
  id: string;
  name: string;
  description: string;
  xp: number;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface GamificationState {
  xp: number;
  level: number;
  achievements: Achievement[];
  commandsUsed: string[];
  visitCount: number;
  scrollDepth: number;
  lastVisit: Date | null;
}

// XP thresholds for each level
export const LEVEL_THRESHOLDS = [
  0,      // Level 1
  100,    // Level 2
  300,    // Level 3
  600,    // Level 4
  1000,   // Level 5
  1500,   // Level 6
  2100,   // Level 7
  2800,   // Level 8
  3600,   // Level 9
  4500,   // Level 10: SYSTEM_ADMIN
];

export const LEVEL_NAMES = [
  'VISITOR',
  'CURIOUS',
  'EXPLORER',
  'RESEARCHER',
  'ANALYST',
  'SPECIALIST',
  'EXPERT',
  'MASTER',
  'ARCHITECT',
  'SYSTEM_ADMIN',
];

// Available achievements
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_visit',
    name: 'BOOT_SEQUENCE',
    description: 'First system boot completed',
    xp: 10,
    icon: '🚀',
    unlocked: false,
  },
  {
    id: 'scroll_complete',
    name: 'DEEP_DIVE',
    description: 'Scrolled through entire portfolio',
    xp: 25,
    icon: '📜',
    unlocked: false,
  },
  {
    id: 'first_command',
    name: 'TERMINAL_OPERATOR',
    description: 'Used first terminal command',
    xp: 15,
    icon: '⌨️',
    unlocked: false,
  },
  {
    id: 'help_command',
    name: 'RTFM',
    description: 'Read the friendly manual',
    xp: 10,
    icon: '📖',
    unlocked: false,
  },
  {
    id: 'secret_command',
    name: 'HACKER',
    description: 'Discovered a secret command',
    xp: 50,
    icon: '🔓',
    unlocked: false,
  },
  {
    id: 'all_projects',
    name: 'PORTFOLIO_REVIEWER',
    description: 'Viewed all projects',
    xp: 30,
    icon: '👁️',
    unlocked: false,
  },
  {
    id: 'konami_code',
    name: 'RETRO_GAMER',
    description: 'Entered the Konami code',
    xp: 100,
    icon: '🎮',
    unlocked: false,
  },
  {
    id: 'night_owl',
    name: 'NIGHT_OWL',
    description: 'Visited between midnight and 4 AM',
    xp: 25,
    icon: '🦉',
    unlocked: false,
  },
  {
    id: 'return_visitor',
    name: 'REGULAR',
    description: 'Returned for another visit',
    xp: 20,
    icon: '🔄',
    unlocked: false,
  },
  {
    id: 'speed_typer',
    name: 'SPEED_DAEMON',
    description: 'Typed over 60 WPM in typing game',
    xp: 75,
    icon: '⚡',
    unlocked: false,
  },
];

const STORAGE_KEY = 'samuel_portfolio_gamification';

// Get state from localStorage
export const loadGamificationState = (): GamificationState => {
  if (typeof window === 'undefined') {
    return getDefaultState();
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...getDefaultState(),
        ...parsed,
        achievements: ACHIEVEMENTS.map(a => ({
          ...a,
          unlocked: parsed.achievements?.find((pa: Achievement) => pa.id === a.id)?.unlocked || false,
          unlockedAt: parsed.achievements?.find((pa: Achievement) => pa.id === a.id)?.unlockedAt,
        })),
        lastVisit: parsed.lastVisit ? new Date(parsed.lastVisit) : null,
      };
    }
  } catch (e) {
    console.error('Failed to load gamification state:', e);
  }
  
  return getDefaultState();
};

// Save state to localStorage
export const saveGamificationState = (state: GamificationState): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save gamification state:', e);
  }
};

// Get default state
export const getDefaultState = (): GamificationState => ({
  xp: 0,
  level: 1,
  achievements: ACHIEVEMENTS.map(a => ({ ...a })),
  commandsUsed: [],
  visitCount: 0,
  scrollDepth: 0,
  lastVisit: null,
});

// Calculate level from XP
export const getLevelFromXP = (xp: number): number => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

// Get XP progress to next level
export const getXPProgress = (xp: number): { current: number; max: number; percentage: number } => {
  const level = getLevelFromXP(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] || 0;
  const nextThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
  
  const current = xp - currentThreshold;
  const max = nextThreshold - currentThreshold;
  const percentage = Math.min((current / max) * 100, 100);
  
  return { current, max, percentage };
};

// Add XP and check for level up
export const addXP = (
  state: GamificationState, 
  amount: number
): { newState: GamificationState; leveledUp: boolean; newLevel?: number } => {
  const oldLevel = state.level;
  const newXP = state.xp + amount;
  const newLevel = getLevelFromXP(newXP);
  
  const newState = {
    ...state,
    xp: newXP,
    level: newLevel,
  };
  
  saveGamificationState(newState);
  
  return {
    newState,
    leveledUp: newLevel > oldLevel,
    newLevel: newLevel > oldLevel ? newLevel : undefined,
  };
};

// Unlock achievement
export const unlockAchievement = (
  state: GamificationState,
  achievementId: string
): { newState: GamificationState; achievement: Achievement | null; xpGained: number } => {
  const achievement = state.achievements.find(a => a.id === achievementId);
  
  if (!achievement || achievement.unlocked) {
    return { newState: state, achievement: null, xpGained: 0 };
  }
  
  const updatedAchievements = state.achievements.map(a =>
    a.id === achievementId
      ? { ...a, unlocked: true, unlockedAt: new Date() }
      : a
  );
  
  const { newState } = addXP(
    { ...state, achievements: updatedAchievements },
    achievement.xp
  );
  
  return {
    newState,
    achievement: { ...achievement, unlocked: true },
    xpGained: achievement.xp,
  };
};
