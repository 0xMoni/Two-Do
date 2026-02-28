import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getFirebaseDb } from '../lib/firebase';
import { getUserDocument, updateUserDocument } from '../lib/firestore';
import { useAuthContext } from './AuthContext';
import { Duo, UserProfile, Achievement, AchievementData } from '../types';
import { calculateLevel } from '../lib/xpSystem';
import { checkNewAchievements } from '../lib/achievements';
import { differenceInDays } from 'date-fns';

interface DuoContextValue {
  userProfile: UserProfile | null;
  duo: Duo | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  levelUpLevel: number | null;
  dismissLevelUp: () => void;
  newAchievement: Achievement | null;
  dismissAchievement: () => void;
}

const DuoContext = createContext<DuoContextValue>({
  userProfile: null,
  duo: null,
  loading: true,
  refreshProfile: async () => {},
  levelUpLevel: null,
  dismissLevelUp: () => {},
  newAchievement: null,
  dismissAchievement: () => {},
});

export function DuoProvider({ children }: { children: ReactNode }) {
  const { user } = useAuthContext();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [duo, setDuo] = useState<Duo | null>(null);
  const [loading, setLoading] = useState(true);
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const achievementQueue = useRef<Achievement[]>([]);

  const refreshProfile = async () => {
    if (!user) return;
    const profile = await getUserDocument(user.uid);
    setUserProfile(profile);
  };

  const dismissLevelUp = useCallback(() => setLevelUpLevel(null), []);

  const dismissAchievement = useCallback(() => {
    setNewAchievement(null);
    if (achievementQueue.current.length > 0) {
      setTimeout(() => {
        const next = achievementQueue.current.shift();
        if (next) setNewAchievement(next);
      }, 300);
    }
  }, []);

  // Listen to user profile
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      setDuo(null);
      setLoading(false);
      return;
    }

    const db = getFirebaseDb();
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      if (snap.exists()) {
        setUserProfile(snap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    });

    return () => unsub();
  }, [user]);

  // Listen to duo document when profile has duoId
  useEffect(() => {
    if (!userProfile?.duoId) {
      setDuo(null);
      setLoading(false);
      return;
    }

    const db = getFirebaseDb();
    const unsub = onSnapshot(doc(db, 'duos', userProfile.duoId), (snap) => {
      if (snap.exists()) {
        setDuo({ id: snap.id, ...snap.data() } as Duo);
      } else {
        setDuo(null);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [userProfile?.duoId]);

  // Set loading false if no duo
  useEffect(() => {
    if (userProfile && !userProfile.duoId) {
      setLoading(false);
    }
  }, [userProfile]);

  // Sync level when XP changes + detect level-up
  const prevLevelRef = useRef<number | null>(null);
  const prevXpRef = useRef<number | null>(null);
  useEffect(() => {
    if (!userProfile || !user) return;
    const currentXp = userProfile.xp ?? 0;
    const correctLevel = calculateLevel(currentXp);

    // Detect level-up
    if (prevLevelRef.current !== null && correctLevel > prevLevelRef.current) {
      setLevelUpLevel(correctLevel);
    }
    prevLevelRef.current = correctLevel;

    if (prevXpRef.current !== currentXp && userProfile.level !== correctLevel) {
      updateUserDocument(user.uid, { level: correctLevel }).catch(() => {});
      if (duo) {
        const db = getFirebaseDb();
        updateDoc(doc(db, 'duos', duo.id), {
          [`memberProfiles.${user.uid}.level`]: correctLevel,
        }).catch(() => {});
      }
    }
    prevXpRef.current = currentXp;
  }, [userProfile?.xp]);

  // Check achievements when duo data changes
  const prevAchievementCountRef = useRef<number | null>(null);
  useEffect(() => {
    if (!duo || !userProfile || !user) return;

    const myProfile = duo.memberProfiles[user.uid];
    if (!myProfile) return;

    const unlocked = duo.unlockedAchievements ?? [];

    // Skip on initial load
    if (prevAchievementCountRef.current === null) {
      prevAchievementCountRef.current = unlocked.length;
      return;
    }

    let daysTogether = 0;
    if (duo.relationshipStartDate) {
      daysTogether = differenceInDays(new Date(), duo.relationshipStartDate.toDate());
    }

    const data: AchievementData = {
      questsCompleted: myProfile.questsCompleted,
      xp: myProfile.xp,
      level: myProfile.level,
      affectionCount: duo.affectionCount,
      currentStreak: duo.currentStreak ?? 0,
      bestStreak: duo.bestStreak ?? 0,
      daysTogetherCount: daysTogether,
    };

    const newOnes = checkNewAchievements(data, unlocked);
    if (newOnes.length > 0) {
      const db = getFirebaseDb();
      updateDoc(doc(db, 'duos', duo.id), {
        unlockedAchievements: arrayUnion(...newOnes.map((a) => a.id)),
      }).catch(() => {});

      achievementQueue.current.push(...newOnes);
      if (!newAchievement) {
        const first = achievementQueue.current.shift();
        if (first) setNewAchievement(first);
      }
    }

    prevAchievementCountRef.current = unlocked.length;
  }, [duo?.affectionCount, userProfile?.xp, duo?.currentStreak, duo?.bestStreak, duo?.relationshipStartDate, duo?.memberProfiles]);

  return (
    <DuoContext.Provider value={{
      userProfile,
      duo,
      loading,
      refreshProfile,
      levelUpLevel,
      dismissLevelUp,
      newAchievement,
      dismissAchievement,
    }}>
      {children}
    </DuoContext.Provider>
  );
}

export function useDuoContext() {
  return useContext(DuoContext);
}
