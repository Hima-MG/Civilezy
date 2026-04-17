import { db } from "@/lib/firebase";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, where, Timestamp, serverTimestamp,
} from "firebase/firestore";

export type AnnouncementType = "exam" | "result" | "achievement";

export interface Announcement {
  id: string;
  title: string;
  type: AnnouncementType;
  link: string;
  isActive: boolean;
  priority: number;
  createdAt: Timestamp;
  expiresAt?: Timestamp | null;
}

export type AnnouncementInput = Omit<Announcement, "id" | "createdAt">;

const COL = "announcements";

/** Fetch active, non-expired announcements sorted by priority desc */
export async function getActiveAnnouncements(): Promise<Announcement[]> {
  const now = Timestamp.now();
  const snap = await getDocs(
    query(collection(db, COL), where("isActive", "==", true))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Announcement))
    .filter((a) => !a.expiresAt || a.expiresAt.toMillis() > now.toMillis())
    .sort((a, b) => b.priority - a.priority || b.createdAt?.toMillis() - a.createdAt?.toMillis());
}

/** Fetch all announcements (admin) */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() } as Announcement))
    .sort((a, b) => b.priority - a.priority || b.createdAt?.toMillis() - a.createdAt?.toMillis());
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
