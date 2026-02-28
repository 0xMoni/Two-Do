import { Achievement, AchievementData } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_quest',
    name: 'First Steps',
    description: 'Complete your first quest',
    icon: '🎯',
    condition: (d) => d.questsCompleted >= 1,
  },
  {
    id: 'quest_10',
    name: 'Adventurer',
    description: 'Complete 10 quests',
    icon: '⚔️',
    condition: (d) => d.questsCompleted >= 10,
  },
  {
    id: 'quest_50',
    name: 'Veteran',
    description: 'Complete 50 quests',
    icon: '🏆',
    condition: (d) => d.questsCompleted >= 50,
  },
  {
    id: 'quest_100',
    name: 'Legend',
    description: 'Complete 100 quests',
    icon: '👑',
    condition: (d) => d.questsCompleted >= 100,
  },
  {
    id: 'level_3',
    name: 'Rising Star',
    description: 'Reach level 3',
    icon: '⭐',
    condition: (d) => d.level >= 3,
  },
  {
    id: 'level_5',
    name: 'Elite',
    description: 'Reach level 5',
    icon: '🌟',
    condition: (d) => d.level >= 5,
  },
  {
    id: 'level_10',
    name: 'Max Power',
    description: 'Reach level 10',
    icon: '💫',
    condition: (d) => d.level >= 10,
  },
  {
    id: 'affection_10',
    name: 'Warmhearted',
    description: 'Send 10 affections',
    icon: '💗',
    condition: (d) => d.affectionCount >= 10,
  },
  {
    id: 'affection_100',
    name: 'Devoted',
    description: 'Send 100 affections',
    icon: '💖',
    condition: (d) => d.affectionCount >= 100,
  },
  {
    id: 'streak_3',
    name: 'On a Roll',
    description: '3-day quest streak',
    icon: '🔥',
    condition: (d) => d.bestStreak >= 3,
  },
  {
    id: 'streak_7',
    name: 'Unstoppable',
    description: '7-day quest streak',
    icon: '🔥',
    condition: (d) => d.bestStreak >= 7,
  },
  {
    id: 'streak_30',
    name: 'Legendary Streak',
    description: '30-day quest streak',
    icon: '🔥',
    condition: (d) => d.bestStreak >= 30,
  },
  {
    id: 'xp_1000',
    name: 'XP Hoarder',
    description: 'Earn 1,000 XP',
    icon: '✨',
    condition: (d) => d.xp >= 1000,
  },
  {
    id: 'together_30',
    name: 'One Month',
    description: 'Together for 30 days',
    icon: '📅',
    condition: (d) => d.daysTogetherCount >= 30,
  },
  {
    id: 'together_365',
    name: 'Anniversary',
    description: 'Together for 1 year',
    icon: '🎂',
    condition: (d) => d.daysTogetherCount >= 365,
  },
];

export function checkNewAchievements(data: AchievementData, alreadyUnlocked: string[]): Achievement[] {
  return ACHIEVEMENTS.filter((a) => !alreadyUnlocked.includes(a.id) && a.condition(data));
}
