import { collection, query, where, getDocs } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { Quest } from '../types';
import { isDueDatePast } from './utils';
import { expireQuest } from './questService';

export async function checkExpiredQuests(duoId: string): Promise<number> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, 'duos', duoId, 'quests'),
    where('status', '==', 'active')
  );

  const snap = await getDocs(q);
  let expiredCount = 0;

  for (const docSnap of snap.docs) {
    const quest = { id: docSnap.id, ...docSnap.data() } as Quest;
    if (quest.dueDate && isDueDatePast(quest.dueDate)) {
      try {
        await expireQuest(duoId, quest.id, quest.assignedTo);
        expiredCount++;
      } catch {
        // Skip individual failures
      }
    }
  }

  return expiredCount;
}
