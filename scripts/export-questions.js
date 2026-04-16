#!/usr/bin/env node
// ---------------------------------------------------------------------------
// Export Firestore `questions` collection to JSON
//
// Usage:  node scripts/export-questions.js
// Output: data/questions-export.json
// ---------------------------------------------------------------------------

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

// ── Config ──────────────────────────────────────────────────────────────────
const SERVICE_ACCOUNT_PATH = path.join(__dirname, "serviceAccountKey.json");
const OUTPUT_PATH = path.join(__dirname, "..", "data", "questions-export.json");
const COLLECTION = "questions";
const BATCH_SIZE = 500; // Firestore returns max 500 docs per page

// ── Init Firebase Admin ─────────────────────────────────────────────────────
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error("❌ Service account key not found at:", SERVICE_ACCOUNT_PATH);
  console.error("   Download it from Firebase Console → Project Settings → Service accounts → Generate new private key");
  process.exit(1);
}

const serviceAccount = require(SERVICE_ACCOUNT_PATH);
initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// ── Export ───────────────────────────────────────────────────────────────────
async function exportQuestions() {
  console.log(`📦 Exporting "${COLLECTION}" collection...`);

  const allDocs = [];
  let lastDoc = null;
  let page = 0;

  // Paginate through the collection to handle large datasets
  while (true) {
    let q = db.collection(COLLECTION).orderBy("__name__").limit(BATCH_SIZE);
    if (lastDoc) {
      q = q.startAfter(lastDoc);
    }

    const snapshot = await q.get();
    if (snapshot.empty) break;

    for (const doc of snapshot.docs) {
      const data = doc.data();

      // Convert Firestore Timestamps to ISO strings for JSON compatibility
      for (const [key, val] of Object.entries(data)) {
        if (val && typeof val.toDate === "function") {
          data[key] = val.toDate().toISOString();
        }
      }

      allDocs.push({ id: doc.id, ...data });
    }

    lastDoc = snapshot.docs[snapshot.docs.length - 1];
    page++;
    console.log(`   Page ${page}: fetched ${snapshot.size} docs (total: ${allDocs.length})`);
  }

  if (allDocs.length === 0) {
    console.log("⚠️  No documents found in the collection.");
    return;
  }

  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allDocs, null, 2), "utf-8");

  const sizeMB = (fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✅ Exported ${allDocs.length} documents → ${OUTPUT_PATH}`);
  console.log(`   File size: ${sizeMB} MB`);
}

exportQuestions().catch((err) => {
  console.error("❌ Export failed:", err.message);
  process.exit(1);
});
