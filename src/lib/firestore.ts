import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { getFirebaseDb } from './firebase';
import { UserProfile } from '../types';
import { generatePairingCode } from './utils';

export async function createUserDocument(uid: string, email: string, displayName: string): Promise<void> {
  const db = getFirebaseDb();
  const pairingCode = generatePairingCode();

  const userData: Omit<UserProfile, 'createdAt'> & { createdAt: ReturnType<typeof serverTimestamp> } = {
    uid,
    email,
    displayName,
    avatarId: 'warrior',
    pairingCode,
    duoId: null,
    xp: 0,
    level: 1,
    questsCompleted: 0,
    theme: 'dark',
    onboardingComplete: false,
    createdAt: serverTimestamp() as any,
  };

  await setDoc(doc(db, 'users', uid), userData);

  // Create pairing code document for O(1) lookup
  await setDoc(doc(db, 'pairingCodes', pairingCode), {
    uid,
    createdAt: serverTimestamp(),
    used: false,
  });
}

export async function getUserDocument(uid: string): Promise<UserProfile | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

export async function updateUserDocument(uid: string, data: Partial<UserProfile>): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, 'users', uid), data as any);
}
