import { LEVEL_THRESHOLDS, MAX_LEVEL, PRIORITY_XP, LATE_XP_MULTIPLIER, MISSED_XP_PENALTY } from './constants';
import { QuestPriority } from '../types';

export function getBaseXp(priority: QuestPriority): number {
  return PRIORITY_XP[priority] ?? 10;
}

export function calculateEarnedXp(priority: QuestPriority, isLate: boolean): number {
  const base = getBaseXp(priority);
  return isLate ? Math.floor(base * LATE_XP_MULTIPLIER) : base;
}

export function getMissedPenalty(): number {
  return MISSED_XP_PENALTY;
}

export function calculateLevel(xp: number): number {
  let level = 1;
  for (let i = MAX_LEVEL; i >= 1; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i;
      break;
    }
  }
  return level;
}

export function getXpForCurrentLevel(xp: number): { current: number; needed: number; level: number } {
  const level = calculateLevel(xp);
  const currentThreshold = LEVEL_THRESHOLDS[level];
  const nextThreshold = level < MAX_LEVEL ? LEVEL_THRESHOLDS[level + 1] : LEVEL_THRESHOLDS[MAX_LEVEL];

  if (level >= MAX_LEVEL) {
    return { current: xp - currentThreshold, needed: 1, level };
  }

  return {
    current: xp - currentThreshold,
    needed: nextThreshold - currentThreshold,
    level,
  };
}