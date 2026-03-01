import { useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from './firebase';
import { createUserDocument } from './firestore';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    return cred.user;
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
    await createUserDocument(cred.user.uid, email, displayName);
    return cred.user;
  }, []);

  const logout = useCallback(async () => {
    await signOut(getFirebaseAuth());
  }, []);

  const deleteAccount = useCallback(async () => {
    const currentUser = getFirebaseAuth().currentUser;
    if (currentUser) {
      await deleteUser(currentUser);
    }
  }, []);

  return { user, loading, login, signUp, logout, deleteAccount };
}
