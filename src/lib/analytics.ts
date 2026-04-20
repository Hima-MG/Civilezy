import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SubjectStats {
  total: number;
  correct: number;
}

export interface GameSessionInput {
  uid: string;
  domain: string;
  subjects: string[];
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  xpEarned: number;
  subjectBreakdown: Record<string, SubjectStats>;
  date: string; // YYYY-MM-DD
}

export interface GameSession extends GameSessionInput {
  id: string;
  playedAt: { toDate: () => Date } | null;
}

export interface SubjectPerformance {
  subject: string;
  total: number;
  correct: number;
  accuracy: number;
  isWeak: boolean;
}

export interface DayTrend {
  date: string;
  label: string;
  accuracy: number;
  xp: number;
}

export interface UserAnalytics {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  gamesPlayed: number;
  subjectStats: SubjectPerformance[];
  weakestSubject: string | null;
  dailyTrend: DayTrend[];
}

export interface UserReportStats {
  total: number;
  resolved: number;
  pending: number;
}

// ─── Attempt (per-question) ───────────────────────────────────────────────────

export interface AttemptInput {
  uid: string;
  questionId: string;
  subject: string;
  domain: string;
  difficulty: string;
  isCorrect: boolean;
  date: string; // YYYY-MM-DD
}

export async function saveAttempt(data: AttemptInput): Promise<void> {
  await addDoc(collection(db, "user_attempts"), {
    ...data,
    attemptedAt: serverTimestamp(),
  });
}

export interface WeakSubjectResult {
  subject: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface WeakSubjectsData {
  subjects: WeakSubjectResult[];
  weakest: WeakSubjectResult | null;
}

/** Minimum attempts before a subject is considered for weak detection. */
const MIN_ATTEMPTS = 3;

/**
 * Reads user_attempts, groups by subject in a single pass,
 * and returns subjects sorted by accuracy ascending (weakest first).
 */
export async function fetchWeakSubjects(uid: string): Promise<WeakSubjectsData> {
  if (!uid) return { subjects: [], weakest: null };

  const snap = await getDocs(
    query(
      collection(db, "user_attempts"),
      where("uid", "==", uid),
      orderBy("attemptedAt", "desc"),
      limit(500),
    ),
  );

  // Single-pass group by subject
  const map = new Map<string, { attempted: number; correct: number }>();
  for (const doc of snap.docs) {
    const { subject, isCorrect } = doc.data() as { subject: string; isCorrect: boolean };
    if (!subject) continue;
    const prev = map.get(subject) ?? { attempted: 0, correct: 0 };
    map.set(subject, {
      attempted: prev.attempted + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
    });
  }

  if (map.size === 0) return { subjects: [], weakest: null };

  const subjects: WeakSubjectResult[] = Array.from(map.entries())
    .map(([subject, s]) => ({
      subject,
      attempted: s.attempted,
      correct: s.correct,
      accuracy: Math.round((s.correct / s.attempted) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy); // weakest first

  // Weakest = lowest accuracy among subjects with enough data
  const weakest =
    subjects.find(s => s.attempted >= MIN_ATTEMPTS) ??
    (subjects.length > 0 ? subjects[0] : null);

  return { subjects, weakest };
}

// ─── Save Session ─────────────────────────────────────────────────────────────

export async function saveGameSession(data: GameSessionInput): Promise<void> {
  await addDoc(collection(db, "userGameSessions"), {
    ...data,
    playedAt: serverTimestamp(),
  });
}

// ─── Fetch Analytics ──────────────────────────────────────────────────────────

export async function fetchUserAnalytics(uid: string): Promise<UserAnalytics> {
  const snap = await getDocs(
    query(
      collection(db, "userGameSessions"),
      where("uid", "==", uid),
      orderBy("playedAt", "desc"),
      limit(100),
    ),
  );

  const sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }) as GameSession);

  let totalQuestions = 0;
  let correctAnswers = 0;
  const subjectMap = new Map<string, { total: number; correct: number }>();

  for (const s of sessions) {
    totalQuestions += s.totalQuestions ?? 0;
    correctAnswers += s.correctAnswers ?? 0;
    for (const [subject, stats] of Object.entries(s.subjectBreakdown ?? {})) {
      const prev = subjectMap.get(subject) ?? { total: 0, correct: 0 };
      subjectMap.set(subject, {
        total: prev.total + (stats.total ?? 0),
        correct: prev.correct + (stats.correct ?? 0),
      });
    }
  }

  const subjectStats: SubjectPerformance[] = Array.from(subjectMap.entries())
    .map(([subject, stats]) => ({
      subject,
      total: stats.total,
      correct: stats.correct,
      accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      isWeak: stats.total > 0 && stats.correct / stats.total < 0.5,
    }))
    .sort((a, b) => b.total - a.total);

  const weakestSubject =
    subjectStats
      .filter(s => s.total >= 3)
      .reduce<SubjectPerformance | null>(
        (acc, s) => (!acc || s.accuracy < acc.accuracy ? s : acc),
        null,
      )?.subject ?? null;

  // 7-day trend
  const today = new Date();
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dailyTrend: DayTrend[] = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const daySessions = sessions.filter(s => s.date === dateStr);
    const dayTotal = daySessions.reduce((sum, s) => sum + (s.totalQuestions ?? 0), 0);
    const dayCorrect = daySessions.reduce((sum, s) => sum + (s.correctAnswers ?? 0), 0);
    const dayXp = daySessions.reduce((sum, s) => sum + (s.xpEarned ?? 0), 0);
    return {
      date: dateStr,
      label: DAY_LABELS[d.getDay()],
      accuracy: dayTotal > 0 ? Math.round((dayCorrect / dayTotal) * 100) : 0,
      xp: dayXp,
    };
  });

  return {
    totalQuestions,
    correctAnswers,
    accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
    gamesPlayed: sessions.length,
    subjectStats,
    weakestSubject,
    dailyTrend,
  };
}

// ─── Fetch User Reports ───────────────────────────────────────────────────────

export async function fetchUserReports(uid: string): Promise<UserReportStats> {
  const snap = await getDocs(
    query(
      collection(db, "game_arena_reports"),
      where("userId", "==", uid),
      limit(200),
    ),
  );
  const docs = snap.docs.map(d => d.data());
  const total = docs.length;
  const resolved = docs.filter(d => d.status === "resolved").length;
  return { total, resolved, pending: total - resolved };
}

// ─── Fetch User Rank ──────────────────────────────────────────────────────────

export async function fetchUserRank(uid: string): Promise<number> {
  const snap = await getDocs(
    query(
      collection(db, "leaderboard"),
      orderBy("totalScore", "desc"),
      limit(200),
    ),
  );
  const idx = snap.docs.findIndex(d => d.id === uid);
  return idx === -1 ? 0 : idx + 1;
}
