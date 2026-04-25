import { db } from "@/lib/firebase";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, Timestamp, serverTimestamp,
} from "firebase/firestore";

export type AnnouncementType = "exam" | "result" | "achievement" | "update";

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  type: AnnouncementType;
  link?: string;
  isActive: boolean;
  priority: number;
  createdAt: Timestamp;
  expiresAt?: Timestamp | null;
}

export type AnnouncementInput = Omit<Announcement, "id" | "createdAt">;

const COL = "announcements";

const byNewest = (a: Announcement, b: Announcement) =>
  (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0);

const byPriorityThenNewest = (a: Announcement, b: Announcement) =>
  b.priority - a.priority || byNewest(a, b);

function filterExpired(items: Announcement[]): Announcement[] {
  const now = Timestamp.now().toMillis();
  return items.filter((a) => !a.expiresAt || a.expiresAt.toMillis() > now);
}

/** Fetch active, non-expired announcements sorted by priority desc.
 *  Used by AnnouncementBar — returns the top item first. */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("isActive", "==", true))
  );
  return filterExpired(
    snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))
  ).sort(byPriorityThenNewest);
}

/** Fetch active, non-expired announcements ordered newest-first.
 *  Used by the public /announcements page. */
export async function getAnnouncementsPage(): Promise<Announcement[]> {
  const snap = await getDocs(
    query(collection(db, COL), where("isActive", "==", true))
  );
  return filterExpired(
    snap.docs.map((d) => ({ id: d.id, ...d.data() } as Announcement))
  ).sort(byNewest);
}

/** Fetch all announcements (admin) */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Announcement))
    .sort(byPriorityThenNewest);
}

export async function addAnnouncement(input: AnnouncementInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateAnnouncement(
  id: string,
  data: Partial<AnnouncementInput>
): Promise<void> {
  await updateDoc(doc(db, COL, id), data);
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
