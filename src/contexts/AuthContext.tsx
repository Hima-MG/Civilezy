"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  totalXp: number;
  gamesPlayed: number;
  totalScore: number;
  streak: number;
  lastPlayed: string;
  createdAt: unknown;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch Firestore user profile
  const fetchProfile = async (u: User): Promise<UserProfile | null> => {
    const snap = await getDoc(doc(db, "users", u.uid));
    if (snap.exists()) return snap.data() as UserProfile;
    return null;
  };

  // Listen to auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await fetchProfile(u);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Signup
  const signup = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });

    const userDoc: UserProfile = {
      uid: cred.user.uid,
      displayName,
      email,
      totalXp: 0,
      gamesPlayed: 0,
      totalScore: 0,
      streak: 0,
      lastPlayed: "",
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "users", cred.user.uid), userDoc);
    setProfile(userDoc);
  };

  // Login
  const login = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const p = await fetchProfile(cred.user);
    setProfile(p);
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  // Refresh profile from Firestore
  const refreshProfile = async () => {
    if (!user) return;
    const p = await fetchProfile(user);
    setProfile(p);
  };

  // Update partial profile fields
  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    await setDoc(doc(db, "users", user.uid), data, { merge: true });
    const p = await fetchProfile(user);
    setProfile(p);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, signup, login, logout, refreshProfile, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
