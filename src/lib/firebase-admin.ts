import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

// ── Singleton cache ────────────────────────────────────────────────────────────
// Vercel serverless functions reuse the module between warm invocations.
// Caching the Firestore + Auth instances avoids re-calling getFirestore(app)
// on every request (saves ~5–20ms per call and prevents duplicate listeners).
let _app: App | null = null;
let _db: Firestore | null = null;
let _auth: Auth | null = null;

function getAdminApp(): App {
  if (_app) return _app;

  if (getApps().length > 0) {
    _app = getApps()[0];
    return _app;
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    "civilezy-game-e0fcf";

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  // dotenv stores \n as literal \\n in quoted strings — convert back
  const privateKey = rawKey?.replace(/\\n/g, "\n");

  console.log("[firebase-admin] init — projectId:", projectId);
  console.log("[firebase-admin] clientEmail:", clientEmail ? "SET" : "MISSING");
  console.log("[firebase-admin] privateKey:", privateKey ? `SET (${privateKey.length} chars)` : "MISSING");

  if (clientEmail && privateKey) {
    console.log("[firebase-admin] Using service account cert");
    _app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    return _app;
  }

  const jsonBlob = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "";
  if (jsonBlob.length > 10) {
    try {
      console.log("[firebase-admin] Using JSON blob credentials");
      _app = initializeApp({ credential: cert(JSON.parse(jsonBlob)) });
      return _app;
    } catch {
      /* malformed — fall through */
    }
  }

  console.warn("[firebase-admin] WARNING: project-ID-only fallback — writes may fail");
  _app = initializeApp({ projectId });
  return _app;
}

export function getAdminDb(): Firestore {
  if (_db) return _db;
  _db = getFirestore(getAdminApp());
  return _db;
}

export function getAdminAuth(): Auth {
  if (_auth) return _auth;
  _auth = getAuth(getAdminApp());
  return _auth;
}
