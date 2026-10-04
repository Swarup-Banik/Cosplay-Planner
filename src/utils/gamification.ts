/**
 * Cosplay Gamification & XP System
 * Persists XP, levels, and badges in localStorage.
 */

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
  category: 'Wig' | 'Prop' | 'Garment' | 'General';
  unlockedAt?: string;
}

export interface UserGamificationState {
  xp: number;
  level: number;
  unlockedBadgeIds: string[];
}

export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'first_cosplay',
    title: 'First Step',
    description: 'Began your first anime cosplay project',
    icon: '✨',
    category: 'General'
  },
  {
    id: 'wig_master',
    title: 'Wig Master',
    description: 'Completed styling or acquiring a wig item',
    icon: '💇',
    category: 'Wig'
  },
  {
    id: 'prop_smith',
    title: 'Prop Smith',
    description: 'Crafted or acquired a weapon or prop item',
    icon: '⚔️',
    category: 'Prop'
  },
  {
    id: 'seamstress',
    title: 'Thread Weaver',
    description: 'Tailored or finished a garment costume piece',
    icon: '🧵',
    category: 'Garment'
  },
  {
    id: 'con_ready',
    title: 'Convention Ready',
    description: 'Finished 100% of a character checklist',
    icon: '🏆',
    category: 'General'
  }
];

const STORAGE_KEY = 'cosplay_gamification_v1';

export function getGamificationState(): UserGamificationState {
  if (typeof window === 'undefined') {
    return { xp: 0, level: 1, unlockedBadgeIds: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { xp: 0, level: 1, unlockedBadgeIds: [] };
}

export function saveGamificationState(state: UserGamificationState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

export function awardItemCompletion(category: string): {
  newXp: number;
  newLevel: number;
  newBadges: Badge[];
} {
  const state = getGamificationState();
  const addedXp = 35;
  const newXp = state.xp + addedXp;
  const newLevel = Math.floor(newXp / 100) + 1;

  const newlyUnlocked: Badge[] = [];
  const currentBadgeIds = new Set(state.unlockedBadgeIds);

  // Check badge conditions
  if (!currentBadgeIds.has('first_cosplay')) {
    newlyUnlocked.push(AVAILABLE_BADGES.find(b => b.id === 'first_cosplay')!);
    currentBadgeIds.add('first_cosplay');
  }

  if (category === 'Wig' && !currentBadgeIds.has('wig_master')) {
    newlyUnlocked.push(AVAILABLE_BADGES.find(b => b.id === 'wig_master')!);
    currentBadgeIds.add('wig_master');
  }

  if (category === 'Prop' && !currentBadgeIds.has('prop_smith')) {
    newlyUnlocked.push(AVAILABLE_BADGES.find(b => b.id === 'prop_smith')!);
    currentBadgeIds.add('prop_smith');
  }

  if (category === 'Garment' && !currentBadgeIds.has('seamstress')) {
    newlyUnlocked.push(AVAILABLE_BADGES.find(b => b.id === 'seamstress')!);
    currentBadgeIds.add('seamstress');
  }

  const updatedState: UserGamificationState = {
    xp: newXp,
    level: newLevel,
    unlockedBadgeIds: Array.from(currentBadgeIds)
  };

  saveGamificationState(updatedState);

  return {
    newXp,
    newLevel,
    newBadges: newlyUnlocked
  };
}

export function awardProjectCompletion(): Badge | null {
  const state = getGamificationState();
  const currentBadgeIds = new Set(state.unlockedBadgeIds);

  if (!currentBadgeIds.has('con_ready')) {
    currentBadgeIds.add('con_ready');
    const badge = AVAILABLE_BADGES.find(b => b.id === 'con_ready')!;
    saveGamificationState({
      ...state,
      xp: state.xp + 100,
      level: Math.floor((state.xp + 100) / 100) + 1,
      unlockedBadgeIds: Array.from(currentBadgeIds)
    });
    return badge;
  }
  return null;
}
