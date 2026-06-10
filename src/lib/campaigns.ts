import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Campaign, CampaignInput } from "@/types/campaign";

const COL = "offer_campaigns";

function toCampaign(id: string, data: Record<string, unknown>): Campaign {
  return { id, ...(data as Omit<Campaign, "id">) };
}

/** Public: fetch the first enabled campaign (used site-wide). */
export async function getActiveCampaign(): Promise<Campaign | null> {
  const snap = await getDocs(
    query(collection(db, COL), where("enabled", "==", true), limit(1))
  );
  if (snap.empty) return null;
  return toCampaign(snap.docs[0].id, snap.docs[0].data());
}

/** Admin: fetch all campaigns regardless of status. */
export async function getAllCampaigns(): Promise<Campaign[]> {
  const snap = await getDocs(collection(db, COL));
  return snap.docs
    .map((d) => toCampaign(d.id, d.data()))
    .sort((a, b) => {
      const toMs = (t: unknown) =>
        t && typeof (t as { toMillis: () => number }).toMillis === "function"
          ? (t as { toMillis: () => number }).toMillis()
          : 0;
      return toMs(b.createdAt) - toMs(a.createdAt);
    });
}

export async function addCampaign(input: CampaignInput): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateCampaign(
  id: string,
  data: Partial<CampaignInput>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCampaign(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
