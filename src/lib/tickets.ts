import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "WAITING_FOR_STUDENT"
  | "RESOLVED"
  | "REOPENED"
  | "CLOSED";

export type TicketPriority = "HIGH" | "MEDIUM" | "LOW";

export type TicketCategory =
  | "Login Issue"
  | "Payment Issue"
  | "Course Access Issue"
  | "Video Not Playing"
  | "Ebook Issue"
  | "Test Series Issue"
  | "Website Bug"
  | "App Bug"
  | "Other";

export interface SupportTicket {
  id: string;
  ticketId: string;
  studentName: string;
  studentEmail: string;
  whatsappNumber: string;
  courseName: string;
  category: TicketCategory;
  description: string;
  screenshotUrl: string | null;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo: string | null;
  adminNotes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt: Timestamp | null;
  studentUid: string | null;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  senderType: "ADMIN" | "STUDENT";
  senderName: string;
  message: string;
  attachmentUrl: string | null;
  createdAt: Timestamp;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TICKETS_COL = "support_tickets";
const MESSAGES_COL = "ticket_messages";
const META_COL = "meta";
const COUNTER_DOC = "ticket_counter";

export const CATEGORIES: TicketCategory[] = [
  "Login Issue",
  "Payment Issue",
  "Course Access Issue",
  "Video Not Playing",
  "Ebook Issue",
  "Test Series Issue",
  "Website Bug",
  "App Bug",
  "Other",
];

export const COURSE_OPTIONS = [
  "ITI Course",
  "Diploma Course",
  "B.Tech Course",
  "Surveyor Course",
  "Other / Not Sure",
];

export const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_FOR_STUDENT: "Waiting for Student",
  RESOLVED: "Resolved",
  REOPENED: "Reopened",
  CLOSED: "Closed",
};

export const STATUS_COLORS: Record<TicketStatus, { color: string; bg: string; border: string }> = {
  OPEN:                 { color: "#60a5fa", bg: "rgba(96,165,250,0.12)",  border: "rgba(96,165,250,0.3)"  },
  IN_PROGRESS:          { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.3)"  },
  WAITING_FOR_STUDENT:  { color: "#fbbf24", bg: "rgba(251,191,36,0.12)",  border: "rgba(251,191,36,0.3)"  },
  RESOLVED:             { color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)"  },
  REOPENED:             { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" },
  CLOSED:               { color: "rgba(255,255,255,0.4)", bg: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.1)" },
};

export const PRIORITY_COLORS: Record<TicketPriority, { color: string; bg: string; border: string }> = {
  HIGH:   { color: "#f87171", bg: "rgba(248,113,113,0.12)", border: "rgba(248,113,113,0.3)" },
  MEDIUM: { color: "#fb923c", bg: "rgba(251,146,60,0.12)",  border: "rgba(251,146,60,0.3)"  },
  LOW:    { color: "#34d399", bg: "rgba(52,211,153,0.12)",  border: "rgba(52,211,153,0.3)"  },
};

export function getAutoPriority(category: TicketCategory): TicketPriority {
  if (["Login Issue", "Payment Issue", "Course Access Issue"].includes(category)) return "HIGH";
  if (["Video Not Playing", "Ebook Issue", "Test Series Issue"].includes(category)) return "MEDIUM";
  return "LOW";
}

export function formatDate(ts: Timestamp | null | undefined): string {
  if (!ts) return "—";
  return ts.toDate().toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── Ticket ID Generation ─────────────────────────────────────────────────────

async function generateTicketId(): Promise<string> {
  const counterRef = doc(db, META_COL, COUNTER_DOC);
  let count = 1;

  await runTransaction(db, async (tx) => {
    const snap = await tx.get(counterRef);
    count = snap.exists() ? (snap.data().count ?? 0) + 1 : 1;
    tx.set(counterRef, { count });
  });

  return `TECH-${String(count).padStart(6, "0")}`;
}

// ─── Ticket CRUD ──────────────────────────────────────────────────────────────

export interface CreateTicketInput {
  studentName: string;
  studentEmail: string;
  whatsappNumber: string;
  courseName: string;
  category: TicketCategory;
  description: string;
  screenshotUrl: string | null;
  studentUid: string | null;
}

export async function createTicket(input: CreateTicketInput): Promise<SupportTicket> {
  const ticketId = await generateTicketId();
  const priority = getAutoPriority(input.category);
  const now = serverTimestamp();

  const data = {
    ticketId,
    ...input,
    status: "OPEN" as TicketStatus,
    priority,
    assignedTo: null,
    adminNotes: null,
    createdAt: now,
    updatedAt: now,
    resolvedAt: null,
  };

  const ref = await addDoc(collection(db, TICKETS_COL), data);

  return {
    id: ref.id,
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  } as SupportTicket;
}

export async function getAllTickets(): Promise<SupportTicket[]> {
  const snap = await getDocs(
    query(collection(db, TICKETS_COL), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as SupportTicket));
}

export async function getTicketsByEmail(email: string): Promise<SupportTicket[]> {
  const snap = await getDocs(
    query(collection(db, TICKETS_COL), where("studentEmail", "==", email))
  );
  const tickets = snap.docs.map((d) => ({ id: d.id, ...d.data() } as SupportTicket));
  return tickets.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0));
}

export async function getTicketByTicketId(ticketId: string): Promise<SupportTicket | null> {
  const snap = await getDocs(
    query(collection(db, TICKETS_COL), where("ticketId", "==", ticketId))
  );
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as SupportTicket;
}

export async function getTicketById(id: string): Promise<SupportTicket | null> {
  const snap = await getDoc(doc(db, TICKETS_COL, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as SupportTicket;
}

export async function updateTicketStatus(
  id: string,
  status: TicketStatus,
  extra?: Record<string, unknown>
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updatedAt: serverTimestamp(),
    ...(extra ?? {}),
  };
  if (status === "WAITING_FOR_STUDENT" || status === "RESOLVED") {
    updates.resolvedAt = serverTimestamp();
  }
  if (status === "CLOSED" || status === "REOPENED") {
    updates.updatedAt = serverTimestamp();
  }
  await updateDoc(doc(db, TICKETS_COL, id), updates);
}

export async function updateTicket(
  id: string,
  data: Partial<Omit<SupportTicket, "id">>
): Promise<void> {
  await updateDoc(doc(db, TICKETS_COL, id), {
    ...(data as Record<string, unknown>),
    updatedAt: serverTimestamp(),
  });
}

// ─── Messages CRUD ────────────────────────────────────────────────────────────

export async function getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  const snap = await getDocs(
    query(collection(db, MESSAGES_COL), where("ticketId", "==", ticketId))
  );
  const msgs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as TicketMessage));
  return msgs.sort((a, b) => (a.createdAt?.toMillis() ?? 0) - (b.createdAt?.toMillis() ?? 0));
}

export async function addTicketMessage(
  ticketId: string,
  senderType: "ADMIN" | "STUDENT",
  senderName: string,
  message: string,
  attachmentUrl: string | null = null
): Promise<TicketMessage> {
  const data = {
    ticketId,
    senderType,
    senderName,
    message,
    attachmentUrl,
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, MESSAGES_COL), data);
  return { id: ref.id, ...data, createdAt: Timestamp.now() } as TicketMessage;
}
