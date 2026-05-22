import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function createAdminApp(): App {
  if (getApps().length > 0) {
    console.log("[firebase-admin] Reusing existing app");
    return getApps()[0];
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    "civilezy-game-e0fcf";

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
  // dotenv stores \n as literal \\n in quoted strings — convert back to real newlines
  const privateKey = rawKey?.replace(/\\n/g, "\n");

  console.log("[firebase-admin] projectId:", projectId);
  console.log("[firebase-admin] clientEmail:", clientEmail ? "SET" : "MISSING");
  console.log("[firebase-admin] privateKey:", privateKey ? `SET (${privateKey.length} chars)` : "MISSING");

  if (clientEmail && privateKey) {
    console.log("[firebase-admin] Using service account cert credentials");
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  // Fallback: try the JSON blob (works if it's properly single-line)
  const jsonBlob = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "";
  if (jsonBlob.length > 10) {
    try {
      console.log("[firebase-admin] Using JSON blob credentials");
      return initializeApp({ credential: cert(JSON.parse(jsonBlob)) });
    } catch {
      // malformed — continue to project-id-only fallback
    }
  }

  // Last resort: project ID only (works in Google Cloud / Vercel with proper IAM)
  console.warn("[firebase-admin] WARNING: Falling back to project-ID-only — writes will fail if Firestore rules require auth");
  return initializeApp({ projectId });
}

export function getAdminDb() {
  const app = createAdminApp();
  return getFirestore(app);
}
