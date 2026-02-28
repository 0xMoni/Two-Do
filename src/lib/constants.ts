import { Category } from '../types';

// ─── XP Thresholds ───────────────────────────────────────────────────────────
export const LEVEL_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 1750,
  7: 3000,
  8: 5000,
  9: 8000,
  10: 12000,
};

export const MAX_LEVEL = 10;

export const PRIORITY_XP: Record<string, number> = {
  easy: 10,
  medium: 25,
  hard: 50,
};

export const LATE_XP_MULTIPLIER = 0.5;
export const MISSED_XP_PENALTY = 5;

// ─── RPG Colors ──────────────────────────────────────────────────────────────
export const RPG_COLORS = {
  background: '#0d0b1a',
  card: '#1a1535',
  cardBorder: '#2d2655',
  accent: '#b84dff',
  gold: '#ffcc00',
  success: '#44d9a8',
  text: '#f0eef5',
  textSecondary: '#b8b0d0',
  textMuted: '#7a7298',
  danger: '#ff4d6a',
  inputBg: '#1a1535',
  inputBorder: '#3d3570',
  overlay: 'rgba(8, 6, 20, 0.8)',
};

// ─── Default Categories ──────────────────────────────────────────────────────
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', name: 'All', icon: '📋', isDefault: true },
  { id: 'daily', name: 'Daily', icon: '☀️', isDefault: true },
  { id: 'errands', name: 'Errands', icon: '🏃', isDefault: true },
  { id: 'self-care', name: 'Self-Care', icon: '🧘', isDefault: true },
  { id: 'date-night', name: 'Date Night', icon: '💕', isDefault: true },
  { id: 'fitness', name: 'Fitness', icon: '💪', isDefault: true },
  { id: 'learning', name: 'Learning', icon: '📚', isDefault: true },
  { id: 'chores', name: 'Chores', icon: '🧹', isDefault: true },
];

// ─── Avatars ─────────────────────────────────────────────────────────────────
export const AVATAR_IDS = [
  'warrior', 'mage', 'rogue', 'healer',
  'ranger', 'knight', 'witch', 'bard',
  'paladin', 'monk', 'druid', 'necro',
];

export const AVATAR_EMOJIS: Record<string, string> = {
  warrior: '⚔️',
  mage: '🧙',
  rogue: '🗡️',
  healer: '💚',
  ranger: '🏹',
  knight: '🛡️',
  witch: '🔮',
  bard: '🎵',
  paladin: '✨',
  monk: '👊',
  druid: '🌿',
  necro: '💀',
};
