// ---------------------------------------------------------------------------
// Shared types for the time-based leaderboard system
// ---------------------------------------------------------------------------

/** Supported leaderboard periods */
export type LeaderboardPeriod = "daily" | "weekly" | "monthly";

/** Shape of a single leaderboard document in Firestore */
export interface LeaderboardDoc {
  userId: string;
  displayName: string;
  score: number;
  xp: number;
  gamesPlayed: number;
  bestStreak: number;
  leaderboardMetric: number;
  playedAt: import("firebase/firestore").FieldValue | import("firebase/firestore").Timestamp | null;
  updatedAt: import("firebase/firestore").FieldValue | import("firebase/firestore").Timestamp | null;
  /** ISO date key that identifies the current period window (e.g. "2026-04-14") */
  periodKey: string;
}

/** Client-side entry returned from queries (no FieldValue) */
export interface PeriodLeaderboardEntry {
  userId: string;
  displayName: string;
  score: number;
  xp: number;
  gamesPlayed: number;
  bestStreak: number;
  leaderboardMetric: number;
}

/** Data needed to update a user's period leaderboard */
export interface UpdatePeriodInput {
  uid: string;
  displayName: string;
  score: number;
  xpEarned: number;
  bestStreak: number;
}
