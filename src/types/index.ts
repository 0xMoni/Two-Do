import { Timestamp } from 'firebase/firestore';

// ─── User ────────────────────────────────────────────────────────────────────
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  avatarId: string;
  pairingCode: string;
  duoId: string | null;
  xp: number;
  level: number;
  questsCompleted: number;
  theme: 'dark' | 'light';
  onboardingComplete: boolean;
  createdAt: Timestamp;
}

// ─── Pairing ─────────────────────────────────────────────────────────────────
export interface PairingCode {
  uid: string;
  createdAt: Timestamp;
  used: boolean;
}

// ─── Duo ─────────────────────────────────────────────────────────────────────
export type RelationshipType = 'couple' | 'friends' | 'ld';

export interface MemberProfile {
  displayName: string;
  nickname: string;
  avatarId: string;
  xp: number;
  level: number;
  questsCompleted: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
}

export interface Duo {
  id: string;
  memberIds: [string, string];
  memberProfiles: Record<string, MemberProfile>;
  relationshipType: RelationshipType;
  affectionCount: number;
  lastAffectionSentBy: string | null;
  lastAffectionAt: Timestamp | null;
  customCategories: Category[];
  createdAt: Timestamp;
  // Streak
  currentStreak: number;
  bestStreak: number;
  lastStreakDate: string | null; // 'YYYY-MM-DD'
  // Anniversary (couples only)
  relationshipStartDate: Timestamp | null;
  // Achievements
  unlockedAchievements: string[];
}

// ─── Achievements ─────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (data: AchievementData) => boolean;
}

export interface AchievementData {
  questsCompleted: number;
  xp: number;
  level: number;
  affectionCount: number;
  currentStreak: number;
  bestStreak: number;
  daysTogetherCount: number;
}

// ─── Quest ───────────────────────────────────────────────────────────────────
export type QuestPriority = 'easy' | 'medium' | 'hard';
export type QuestStatus = 'active' | 'completed' | 'expired' | 'deleted';
export type RecurringType = 'daily' | 'weekly' | 'custom';

export interface QuestRecurring {
  type: RecurringType;
  customDays?: number[]; // 0=Sun, 1=Mon, ...
  nextOccurrence: Timestamp;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  createdBy: string;
  assignedTo: string;
  dueDate: Timestamp | null;
  createdAt: Timestamp;
  completedAt: Timestamp | null;
  priority: QuestPriority;
  baseXp: number;
  earnedXp: number;
  status: QuestStatus;
  recurring: QuestRecurring | null;
}

// ─── Navigation ──────────────────────────────────────────────────────────────
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Pairing: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  QuestsExplain: undefined;
  SwipeExplain: undefined;
  DuoExplain: undefined;
  HeartsExplain: undefined;
};

export type MainTabParamList = {
  QuestLog: undefined;
  Character: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
  AddQuest: undefined;
  EditQuest: { questId: string };
};
