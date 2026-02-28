import { doc, updateDoc } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';

export async function updateStreak(duoId: string, currentStreak: number, bestStreak: number, lastStreakDate: string | null): Promise<{ newStreak: number; newBest: number }> {
  const today = format(new Date(), 'yyyy-MM-dd');

  if (lastStreakDate === today) {
    return { newStreak: currentStreak, newBest: bestStreak };
  }

  let newStreak: number;
  if (lastStreakDate) {
    const daysDiff = differenceInCalendarDays(new Date(), parseISO(lastStreakDate));
    newStreak = daysDiff === 1 ? currentStreak + 1 : 1;
  } else {
    newStreak = 1;
  }

  const newBest = Math.max(bestStreak, newStreak);

  const db = getFirebaseDb();
  await updateDoc(doc(db, 'duos', duoId), {
    currentStreak: newStreak,
    bestStreak: newBest,
    lastStreakDate: today,
  });

  return { newStreak, newBest };
}
