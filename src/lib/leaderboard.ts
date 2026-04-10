import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

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
  name: string;
  score: number;
  totalScore: number;
  streak: number;
}

export async function saveScore(params: SaveScoreParams): Promise<void> {
  const trimmed = params.name.trim();
  if (!trimmed) throw new Error("Name is required");

  const level = getLevel(params.totalScore);
  await addDoc(collection(db, COL), {
    name: trimmed,
    score: params.score,
    totalScore: params.totalScore,
    level: `${level.icon} ${level.label}`,
    streak: params.streak,
    createdAt: serverTimestamp(),
  });
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  totalScore?: number;
  level?: string;
  streak?: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  const q = query(
    collection(db, COL),
    orderBy("totalScore", "desc"),
    limit(10)
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => {
    const d = doc.data();
    return {
      name: d.name,
      score: d.score,
      totalScore: d.totalScore,
      level: d.level,
      streak: d.streak,
    };
  });
}
