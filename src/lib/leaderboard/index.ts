// ---------------------------------------------------------------------------
// Barrel export for the leaderboard module
// ---------------------------------------------------------------------------

// Original all-time leaderboard (moved from src/lib/leaderboard.ts)
export {
  getLevel,
  getNextLevel,
  saveScore,
  getLeaderboard,
  type Level,
  type SaveScoreParams,
  type LeaderboardEntry,
} from "./core";

// Period-based leaderboards (daily / weekly / monthly)
export type {
  LeaderboardPeriod,
  LeaderboardDoc,
  PeriodLeaderboardEntry,
  UpdatePeriodInput,
} from "./types";

export { getPeriodKey, msUntilReset } from "./periodKeys";
export { updateLeaderboardPeriod, updateAllPeriodLeaderboards } from "./updateLeaderboardPeriod";
export {
  subscribeToPeriodLeaderboard,
  fetchNextLeaderboardPage,
  fetchPeriodLeaderboard,
  fetchUserRankInPeriod,
} from "./getLeaderboardByPeriod";
