import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { Quest } from '../types';

export function useQuests(duoId: string | null) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!duoId) {
      setQuests([]);
      setLoading(false);
      return;
    }

    const db = getFirebaseDb();
    const q = query(
      collection(db, 'duos', duoId, 'quests'),
      where('status', 'in', ['active', 'completed'])
    );

    const unsub = onSnapshot(q, (snap) => {
      const items: Quest[] = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Quest[];
      // Sort client-side: newest first
      items.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });
      setQuests(items);
      setLoading(false);
    }, (err) => {
      console.error('Quests listener error:', err);
      setLoading(false);
    });

    return () => unsub();
  }, [duoId]);

  return { quests, loading };
}
