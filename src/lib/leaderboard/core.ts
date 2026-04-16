import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const COL = "leaderboard";

// ─── Level system ───────────────────────────────────────────────────────────
export interface Level {
  label: string;
  icon: string;
  color: string;        // Tailwind text color
  glowColor: string;    // Tailwind shadow color
  bgColor: string;      // Tailwind bg color
  borderColor: string;  // Tailwind border color
  threshold: number;    // min score for this level
}

const LEVELS: Level[] = [
  { label: "Rookie",  icon: "🟢", color: "text-emerald-400", glowColor: "shadow-emerald-500/30", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/25", threshold: 0    },
  { label: "Scholar", icon: "🔵", color: "text-sky-400",     glowColor: "shadow-sky-500/30",     bgColor: "bg-sky-500/10",     borderColor: "border-sky-500/25",     threshold: 500  },
  { label: "Expert",  icon: "🟣", color: "text-purple-400",  glowColor: "shadow-purple-500/30",  bgColor: "bg-purple-500/10",  borderColor: "border-purple-500/25",  threshold: 2000 },
  { label: "Master",  icon: "🟠", color: "text-orange-400",  glowColor: "shadow-orange-500/30",  bgColor: "bg-orange-500/10",  borderColor: "border-orange-500/25",  threshold: 5000 },
];

export function getLevel(score: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (score >= LEVELS[i].threshold) return LEVELS[i];
  }
  return LEVELS[0];
}

export function getNextLevel(score: number): Level | null {
  const current = getLevel(score);
  const idx = LEVELS.indexOf(current);
  return idx < LEVELS.length - 1 ? LEVELS[idx + 1] : null;
}

// ─── Firestore operations ───────────────────────────────────────────────────
export interface SaveScoreParams {
  uid: string;
  displayName: string;
  score: number;
  totalScore: number;
  streak: number;
}

/**
 * Upserts a player's score document.
 * Uses the Firebase Auth uid as the document ID so each
 * player has exactly ONE document that is updated every game.
 */
export async function saveScore(params: SaveScoreParams): Promise<void> {
  if (!params.uid) throw new Error("User ID is required");

  const level = getLevel(params.totalScore);
  await setDoc(doc(db, COL, params.uid), {
    name: params.displayName,
    score: params.score,
    totalScore: params.totalScore,
    level: `${level.icon} ${level.label}`,
    streak: params.streak,
    updatedAt: serverTimestamp(),
  });
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  totalScore?: number;
  level?: string;
  streak?: number;
}

/**
 * Fetches the top 20 players sorted by totalScore descending.
 * New saves use setDoc (one doc per player), but legacy addDoc entries
 * may still exist. We deduplicate by name, keeping the highest totalScore.
 */
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, COL),
    orderBy("totalScore", "desc"),
    limit(50)            // fetch extra to account for legacy duplicates
  );
  const snap = await getDocs(q);

  // Deduplicate: keep only the highest-scoring doc per player name
  const seen = new Map<string, LeaderboardEntry>();
  for (const d of snap.docs) {
    const data = d.data();
    const key = (data.name as string).toLowerCase().trim();
    if (!seen.has(key)) {
      seen.set(key, {
        name: data.name,
        score: data.score,
        totalScore: data.totalScore,
        level: data.level,
        streak: data.streak,
      });
    }
  }

  // Already sorted desc from Firestore; dedupe preserves order; take top 20
  return Array.from(seen.values()).slice(0, 20);
}
