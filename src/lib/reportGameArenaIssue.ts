import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

// ---------------------------------------------------------------------------
// Report types
// ---------------------------------------------------------------------------
export type IssueType =
  | "wrong_answer"
  | "typo"
  | "question_error"
  | "ui_bug"
  | "other";

export interface GameArenaReportInput {
  questionId: string;
  questionText: string;
  selectedDomain: string;
  selectedDifficulty: string;
  issueType: IssueType;
  description: string;
  userName: string | null;
  userId: string | null;
}

// ---------------------------------------------------------------------------
// Submit a game arena issue report to Firestore
// ---------------------------------------------------------------------------
export async function reportGameArenaIssue(
  report: GameArenaReportInput,
): Promise<string> {
  const docRef = await addDoc(collection(db, "game_arena_reports"), {
    ...report,
    createdAt: serverTimestamp(),
    status: "pending",
  });
  return docRef.id;
}
