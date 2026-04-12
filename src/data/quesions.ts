// ---------------------------------------------------------------------------
// quesions.ts — REFACTORED
// No hardcoded questions. All questions come from Firebase.
// Subject hierarchy/metadata lives in subjectHierarchy.ts.
// This file re-exports for backward compatibility + provides getQuestions().
// ---------------------------------------------------------------------------

export type { Domain, Difficulty } from "./subjectHierarchy";
export {
  SUBJECTS_BY_DOMAIN,
  ADDON_SUBJECTS,
  ADDON_GROUPS,
  DIFFICULTY_COUNTS,
  SUBJECT_HIERARCHY,
  getDomainHierarchy,
  getSubjects,
  getAddonSubjects,
  getAllSubjects,
  getAddonGroups,
} from "./subjectHierarchy";

import type { Domain, Difficulty } from "./subjectHierarchy";
import { DIFFICULTY_COUNTS } from "./subjectHierarchy";
import { getPublishedQuestions, type QuestionDoc } from "@/lib/questions";

// ---------------------------------------------------------------------------
// Question type (frontend game format)
// ---------------------------------------------------------------------------
export interface Question {
  id:          string;
  domain:      Domain[];
  subject:     string;
  difficulty:  Difficulty;
  question:    string;
  options:     [string, string, string, string];
  correct:     0 | 1 | 2 | 3;
  explanation: string;
  xp:          number;
}

// ---------------------------------------------------------------------------
// Convert Firestore doc → frontend Question
// ---------------------------------------------------------------------------
function docToQuestion(d: QuestionDoc): Question {
  return {
    id:          d.id,
    domain:      [d.domain],
    subject:     d.subject,
    difficulty:  d.difficulty,
    question:    d.question,
    options:     d.options,
    correct:     d.correct,
    explanation: d.explanation,
    xp:          d.xp,
  };
}

// ---------------------------------------------------------------------------
// Shuffle + limit helper
// ---------------------------------------------------------------------------
function shuffleAndLimit(questions: Question[], limit: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}

// ---------------------------------------------------------------------------
// getQuestions — Firebase only, no hardcoded fallback
//
// Fetches published, active questions filtered by domain, subjects,
// and optionally difficulty. Returns up to `limit` shuffled questions.
// Throws if no questions are found so the caller can show a message.
// ---------------------------------------------------------------------------
export async function getQuestions(
  domain: Domain,
  subjects: string[],
  difficulty?: Difficulty,
  limit: number = 25,
): Promise<Question[]> {
  const firestoreDocs = await getPublishedQuestions(domain, subjects, difficulty);

  if (firestoreDocs.length === 0) {
    throw new Error("NO_QUESTIONS");
  }

  return shuffleAndLimit(firestoreDocs.map(docToQuestion), limit);
}
