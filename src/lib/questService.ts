import {
  collection,
  doc,
  addDoc,
  updateDoc,
  writeBatch,
  Timestamp,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { Quest, QuestPriority, QuestRecurring } from '../types';
import { getBaseXp, calculateEarnedXp, getMissedPenalty } from './xpSystem';
import { isDueDatePast } from './utils';
import { updateStreak } from './streakService';

interface CreateQuestInput {
  title: string;
  description: string;
  categoryId: string;
  assignedTo: string;
  createdBy: string;
  dueDate: Date | null;
  priority: QuestPriority;
  recurring: QuestRecurring | null;
}

export async function createQuest(duoId: string, input: CreateQuestInput): Promise<string> {
  const db = getFirebaseDb();
  const questRef = collection(db, 'duos', duoId, 'quests');

  const questData = {
    title: input.title,
    description: input.description,
    categoryId: input.categoryId,
    createdBy: input.createdBy,
    assignedTo: input.assignedTo,
    dueDate: input.dueDate ? Timestamp.fromDate(input.dueDate) : null,
    createdAt: serverTimestamp(),
    completedAt: null,
    priority: input.priority,
    baseXp: getBaseXp(input.priority),
    earnedXp: 0,
    status: 'active',
    recurring: input.recurring,
  };

  const docRef = await addDoc(questRef, questData);
  return docRef.id;
}

export async function updateQuest(
  duoId: string,
  questId: string,
  data: Partial<Omit<Quest, 'id'>>
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'duos', duoId, 'quests', questId), data as any);
}

export async function completeQuest(
  duoId: string,
  questId: string,
  quest: Quest,
  userId: string
): Promise<{ earnedXp: number }> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  const isLate = isDueDatePast(quest.dueDate);
  const earnedXp = calculateEarnedXp(quest.priority, isLate);

  // Update quest
  batch.update(doc(db, 'duos', duoId, 'quests', questId), {
    status: 'completed',
    completedAt: serverTimestamp(),
    earnedXp,
  });

  // Update user XP + questsCompleted
  batch.update(doc(db, 'users', userId), {
    xp: increment(earnedXp),
    questsCompleted: increment(1),
  });

  // Update duo member profile
  batch.update(doc(db, 'duos', duoId), {
    [`memberProfiles.${userId}.xp`]: increment(earnedXp),
    [`memberProfiles.${userId}.questsCompleted`]: increment(1),
  });

  await batch.commit();

  return { earnedXp };
}

export async function completeQuestWithStreak(
  duoId: string,
  questId: string,
  quest: Quest,
  userId: string,
  currentStreak: number,
  bestStreak: number,
  lastStreakDate: string | null,
): Promise<{ earnedXp: number; newStreak: number }> {
  const result = await completeQuest(duoId, questId, quest, userId);
  const { newStreak } = await updateStreak(duoId, currentStreak, bestStreak, lastStreakDate);
  return { earnedXp: result.earnedXp, newStreak };
}

export async function uncompleteQuest(
  duoId: string,
  questId: string,
  userId: string,
  earnedXp: number
): Promise<void> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  // Revert quest status
  batch.update(doc(db, 'duos', duoId, 'quests', questId), {
    status: 'active',
    completedAt: null,
    earnedXp: 0,
  });

  // Revert user XP + questsCompleted
  batch.update(doc(db, 'users', userId), {
    xp: increment(-earnedXp),
    questsCompleted: increment(-1),
  });

  // Revert duo member profile
  batch.update(doc(db, 'duos', duoId), {
    [`memberProfiles.${userId}.xp`]: increment(-earnedXp),
    [`memberProfiles.${userId}.questsCompleted`]: increment(-1),
  });

  await batch.commit();
}

export async function expireQuest(
  duoId: string,
  questId: string,
  assignedTo: string
): Promise<void> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);
  const penalty = getMissedPenalty();

  batch.update(doc(db, 'duos', duoId, 'quests', questId), {
    status: 'expired',
  });

  batch.update(doc(db, 'users', assignedTo), {
    xp: increment(-penalty),
  });

  batch.update(doc(db, 'duos', duoId), {
    [`memberProfiles.${assignedTo}.xp`]: increment(-penalty),
  });

  await batch.commit();
}

export async function softDeleteQuest(duoId: string, questId: string): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'duos', duoId, 'quests', questId), {
    status: 'deleted',
  });
}
