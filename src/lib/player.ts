const STORAGE_KEY = "civilezy_user";

export interface PlayerData {
  name: string;
  totalScore: number;
  lastPlayed: string; // ISO date string (date only, e.g. "2026-04-10")
  streak: number;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function loadPlayer(): PlayerData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PlayerData;
  } catch {
    return null;
  }
}

export function savePlayer(data: PlayerData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function createPlayer(name: string): PlayerData {
  const data: PlayerData = {
    name: name.trim(),
    totalScore: 0,
    lastPlayed: "",
    streak: 0,
  };
  savePlayer(data);
  return data;
}

/**
 * Called after a game ends. Updates totalScore, streak, and lastPlayed.
 * Returns the updated player data.
 */
export function recordGame(player: PlayerData, gameScore: number): PlayerData {
  const today = todayStr();
  const yesterday = yesterdayStr();

  let newStreak: number;
  if (player.lastPlayed === today) {
    // Already played today — keep current streak, just add score
    newStreak = player.streak;
  } else if (player.lastPlayed === yesterday) {
    // Consecutive day — increment streak
    newStreak = player.streak + 1;
  } else {
    // First play or missed a day — reset to 1
    newStreak = 1;
  }

  const updated: PlayerData = {
    ...player,
    totalScore: player.totalScore + gameScore,
    lastPlayed: today,
    streak: newStreak,
  };
  savePlayer(updated);
  return updated;
}
