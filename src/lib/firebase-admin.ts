import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function createAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID ??
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ??
    "civilezy-game-e0fcf";

  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  // dotenv stores \n as literal \\n in quoted strings — convert back to real newlines
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (clientEmail && privateKey) {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
  }

  // Fallback: try the JSON blob (works if it's properly single-line)
  const jsonBlob = process.env.FIREBASE_SERVICE_ACCOUNT_JSON ?? "";
  if (jsonBlob.length > 10) {
    try {
      return initializeApp({ credential: cert(JSON.parse(jsonBlob)) });
    } catch {
      // malformed — continue to project-id-only fallback
    }
  }

  // Last resort: project ID only (works in Google Cloud / Vercel with proper IAM)
  return initializeApp({ projectId });
}

export function getAdminDb() {
  const app = createAdminApp();
  return getFirestore(app);
}
