import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

const COL = "questions";

// ─── Types ──────────────────────────────────────────────────────────────────
export type Domain     = "iti" | "diploma" | "btech";
export type Difficulty = "easy" | "medium" | "hard";
export type Status     = "draft" | "published";

export interface QuestionDoc {
  id:           string;               // Firestore doc ID
  domain:       Domain;
  category:     string;
  subject:      string;
  difficulty:   Difficulty;
  level:        1 | 2 | 3;
  question:     string;
  options:      [string, string, string, string];
  correct:      0 | 1 | 2 | 3;
  explanation:  string;
  xp:           number;
  status:       Status;
  isActive:     boolean;
  createdBy:    string;
  reviewedBy?:  string;
  createdAt:    Timestamp | null;
  updatedAt:    Timestamp | null;
}

export interface QuestionInput {
  domain:       Domain;
  category:     string;
  subject:      string;
  difficulty:   Difficulty;
  level:        1 | 2 | 3;
  question:     string;
  options:      [string, string, string, string];
  correct:      0 | 1 | 2 | 3;
  explanation:  string;
  xp:           number;
  status:       Status;
  isActive:     boolean;
  createdBy:    string;
}

// ─── CRUD ───────────────────────────────────────────────────────────────────

export async function addQuestion(input: QuestionInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateQuestion(
  id: string,
  data: Partial<QuestionInput> & { reviewedBy?: string },
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteQuestion(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

// ─── Fetch all (admin) ─────────────────────────────────────────────────────

export async function getAllQuestions(): Promise<QuestionDoc[]> {
  const q = query(collection(db, COL), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuestionDoc));
}

// ─── Fetch published + active (game) ────────────────────────────────────────

export async function getPublishedQuestions(
  domain: Domain,
  subjects: string[],
  difficulty?: Difficulty,
): Promise<QuestionDoc[]> {
  // Firestore compound query: published + active + domain
  const constraints = [
    where("status", "==", "published"),
    where("isActive", "==", true),
    where("domain", "==", domain),
  ];
  if (difficulty) {
    constraints.push(where("difficulty", "==", difficulty));
  }
  const q = query(collection(db, COL), ...constraints);
  const snap = await getDocs(q);
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuestionDoc));

  // Client-side filter by subjects if provided
  if (subjects.length > 0) {
    return all.filter((q) => subjects.includes(q.subject));
  }
  return all;
}

// ─── Stats (admin dashboard) ────────────────────────────────────────────────

export interface DomainStats {
  domain: Domain;
  total: number;
  published: number;
  draft: number;
  easy: number;
  medium: number;
  hard: number;
}

export interface SubjectStats {
  domain: Domain;
  subject: string;
  total: number;
  published: number;
}

export function computeStats(questions: QuestionDoc[]): {
  byDomain: DomainStats[];
  bySubject: SubjectStats[];
} {
  const domainMap = new Map<Domain, DomainStats>();
  const subjMap = new Map<string, SubjectStats>();

  for (const q of questions) {
    // Domain stats
    const dk = q.domain;
    if (!domainMap.has(dk)) {
      domainMap.set(dk, { domain: dk, total: 0, published: 0, draft: 0, easy: 0, medium: 0, hard: 0 });
    }
    const ds = domainMap.get(dk)!;
    ds.total++;
    if (q.status === "published") ds.published++;
    else ds.draft++;
    ds[q.difficulty]++;

    // Subject stats
    const sk = `${q.domain}::${q.subject}`;
    if (!subjMap.has(sk)) {
      subjMap.set(sk, { domain: q.domain, subject: q.subject, total: 0, published: 0 });
    }
    const ss = subjMap.get(sk)!;
    ss.total++;
    if (q.status === "published") ss.published++;
  }

  return {
    byDomain: Array.from(domainMap.values()),
    bySubject: Array.from(subjMap.values()).sort((a, b) => a.subject.localeCompare(b.subject)),
  };
}

// ─── Batch publish all drafts ───────────────────────────────────────────────

export async function publishAllDrafts(
  draftIds: string[],
  reviewedBy: string,
  onProgress?: (done: number, total: number) => void,
): Promise<number> {
  const BATCH_SIZE = 500;
  let done = 0;

  for (let i = 0; i < draftIds.length; i += BATCH_SIZE) {
    const chunk = draftIds.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const id of chunk) {
      batch.update(doc(db, COL, id), {
        status: "published",
        reviewedBy,
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    done += chunk.length;
    onProgress?.(done, draftIds.length);
  }

  return done;
}

// ─── Batch import (CSV bulk upload) ─────────────────────────────────────────

/**
 * Writes up to 500 questions in Firestore batches of 500 (Firestore limit).
 * Returns the count of successfully written documents.
 * Calls `onProgress` after each batch so the UI can show live status.
 */
export async function batchImportQuestions(
  inputs: QuestionInput[],
  onProgress?: (written: number, total: number) => void,
): Promise<number> {
  const BATCH_SIZE = 500;
  let written = 0;

  for (let i = 0; i < inputs.length; i += BATCH_SIZE) {
    const chunk = inputs.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    for (const input of chunk) {
      const ref = doc(collection(db, COL));
      batch.set(ref, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    written += chunk.length;
    onProgress?.(written, inputs.length);
  }

  return written;
}
