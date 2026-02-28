import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { RelationshipType, MemberProfile } from '../types';

export async function lookupPairingCode(code: string): Promise<{ uid: string } | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, 'pairingCodes', code.toUpperCase()));
  if (!snap.exists() || snap.data().used) return null;
  return { uid: snap.data().uid };
}

export async function createDuo(
  currentUid: string,
  partnerUid: string,
  currentPairingCode: string,
  partnerPairingCode: string,
  relationshipType: RelationshipType
): Promise<string> {
  const db = getFirebaseDb();
  const batch = writeBatch(db);

  // Fetch both user profiles
  const [currentSnap, partnerSnap] = await Promise.all([
    getDoc(doc(db, 'users', currentUid)),
    getDoc(doc(db, 'users', partnerUid)),
  ]);

  const currentData = currentSnap.data()!;
  const partnerData = partnerSnap.data()!;

  // Create duo document
  const duoRef = doc(db, 'duos', `${currentUid}_${partnerUid}`);
  const duoId = duoRef.id;

  const memberProfiles: Record<string, MemberProfile> = {
    [currentUid]: {
      displayName: currentData.displayName,
      nickname: '',
      avatarId: currentData.avatarId,
      xp: currentData.xp ?? 0,
      level: currentData.level ?? 1,
      questsCompleted: currentData.questsCompleted ?? 0,
    },
    [partnerUid]: {
      displayName: partnerData.displayName,
      nickname: '',
      avatarId: partnerData.avatarId,
      xp: partnerData.xp ?? 0,
      level: partnerData.level ?? 1,
      questsCompleted: partnerData.questsCompleted ?? 0,
    },
  };

  batch.set(duoRef, {
    memberIds: [currentUid, partnerUid],
    memberProfiles,
    relationshipType,
    affectionCount: 0,
    lastAffectionSentBy: null,
    lastAffectionAt: null,
    customCategories: [],
    currentStreak: 0,
    bestStreak: 0,
    lastStreakDate: null,
    relationshipStartDate: null,
    unlockedAchievements: [],
    createdAt: serverTimestamp(),
  });

  // Update both users with duoId
  batch.update(doc(db, 'users', currentUid), { duoId });
  batch.update(doc(db, 'users', partnerUid), { duoId });

  // Mark both pairing codes as used
  batch.update(doc(db, 'pairingCodes', currentPairingCode), { used: true });
  batch.update(doc(db, 'pairingCodes', partnerPairingCode), { used: true });

  await batch.commit();
  return duoId;
}
