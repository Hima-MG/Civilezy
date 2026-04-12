#!/usr/bin/env npx tsx
// ---------------------------------------------------------------------------
// importQuestions.ts — CSV → Firebase Firestore bulk importer
//
// Usage:
//   npx tsx scripts/importQuestions.ts                     # default: data/questions.csv
//   npx tsx scripts/importQuestions.ts path/to/file.csv    # custom path
//   npx tsx scripts/importQuestions.ts --dry-run            # validate only, no upload
//
// Requires:
//   - firebase-admin, papaparse, tsx (see README below)
//   - Service account key at scripts/serviceAccountKey.json
// ---------------------------------------------------------------------------

import * as fs from "fs";
import * as path from "path";
import * as admin from "firebase-admin";
import Papa from "papaparse";

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------
const FIRESTORE_COLLECTION = "questions";
const BATCH_SIZE = 500; // Firestore max per batch
const DEFAULT_CSV = path.resolve(__dirname, "..", "data", "questions.csv");
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, "serviceAccountKey.json");

// ---------------------------------------------------------------------------
// SUBJECT HIERARCHY — mirrored from src/data/subjectHierarchy.ts
// Kept inline so the script is fully standalone (no Next.js path aliases).
// ---------------------------------------------------------------------------
type Domain = "iti" | "diploma" | "btech";
type Difficulty = "easy" | "medium" | "hard";

interface SubjectEntry {
  category: string;
  subject: string;
}

const HIERARCHY: Record<Domain, SubjectEntry[]> = {
  iti: [
    // Drawing & Design
    { category: "Drawing & Design", subject: "Engineering Drawing & CAD" },
    { category: "Drawing & Design", subject: "Machine Drawing Elements" },
    { category: "Drawing & Design", subject: "Limits, Fit & Tolerance" },
    // Building & Materials
    { category: "Building & Materials", subject: "Building Materials" },
    { category: "Building & Materials", subject: "Building Construction" },
    { category: "Building & Materials", subject: "Building Planning & Estimation" },
    // Surveying
    { category: "Surveying", subject: "Basic Surveying" },
    { category: "Surveying", subject: "Advanced Surveying" },
    // Structures & Mechanics
    { category: "Structures & Mechanics", subject: "RCC & Steel Structures" },
    { category: "Structures & Mechanics", subject: "Mechanics & Mensuration" },
    // Water & Transportation
    { category: "Water & Transportation", subject: "Hydraulics & Irrigation" },
    { category: "Water & Transportation", subject: "Transportation Engineering" },
    { category: "Water & Transportation", subject: "Public Health & Sanitation" },
    // Addon: Junior Instructor
    { category: "Junior Instructor / Training Instructor", subject: "Advanced Engineering Mechanics" },
    { category: "Junior Instructor / Training Instructor", subject: "Tunnel Engineering" },
    { category: "Junior Instructor / Training Instructor", subject: "Building Planning Principles" },
  ],
  diploma: [
    // Drawing & Design
    { category: "Drawing & Design", subject: "Engineering Drawing & CAD" },
    { category: "Drawing & Design", subject: "Machine Drawing Elements" },
    { category: "Drawing & Design", subject: "Limits, Fit & Tolerance" },
    // Building & Materials
    { category: "Building & Materials", subject: "Building Materials" },
    { category: "Building & Materials", subject: "Construction Technology" },
    { category: "Building & Materials", subject: "Building Planning & Byelaws" },
    // Surveying
    { category: "Surveying", subject: "Surveying" },
    // Structures & Mechanics
    { category: "Structures & Mechanics", subject: "Engineering Mechanics" },
    { category: "Structures & Mechanics", subject: "Structural Engineering" },
    // Geotechnical & Foundation
    { category: "Geotechnical & Foundation", subject: "Geotechnical & Foundation Engineering" },
    // Water & Environment
    { category: "Water & Environment", subject: "Water Resources & Hydraulics" },
    { category: "Water & Environment", subject: "Environmental Engineering" },
    // Transportation & Estimation
    { category: "Transportation & Estimation", subject: "Transportation Engineering" },
    { category: "Transportation & Estimation", subject: "Estimation & Costing" },
    // Addon: Overseer Civil
    { category: "Overseer Civil / Site Engineer", subject: "Theory of Structures" },
    { category: "Overseer Civil / Site Engineer", subject: "Geotechnical Engineering" },
    { category: "Overseer Civil / Site Engineer", subject: "Foundation Engineering" },
    { category: "Overseer Civil / Site Engineer", subject: "Advanced Environmental Engineering" },
  ],
  btech: [
    // Structural Engineering
    { category: "Structural Engineering", subject: "Structural Analysis" },
    { category: "Structural Engineering", subject: "Structural Design" },
    { category: "Structural Engineering", subject: "Engineering Mechanics & Solid Mechanics" },
    // Geotechnical Engineering
    { category: "Geotechnical Engineering", subject: "Geotechnical Engineering" },
    // Water & Hydraulics
    { category: "Water & Hydraulics", subject: "Fluid Mechanics & Hydraulics" },
    { category: "Water & Hydraulics", subject: "Water Resources Engineering" },
    // Environmental Engineering
    { category: "Environmental Engineering", subject: "Environmental Engineering" },
    // Surveying & Planning
    { category: "Surveying & Planning", subject: "Surveying & Geomatics" },
    { category: "Surveying & Planning", subject: "Urban Planning" },
    // Construction & Estimation
    { category: "Construction & Estimation", subject: "Estimation, Costing & Valuation" },
    { category: "Construction & Estimation", subject: "Construction Engineering & Management" },
    // Transportation & Mathematics
    { category: "Transportation & Mathematics", subject: "Transportation Engineering" },
    { category: "Transportation & Mathematics", subject: "Technical Mathematics" },
    // Addon: AE PCB
    { category: "AE \u2013 Pollution Control Board", subject: "Air Pollution Control & Dispersion Modelling" },
    { category: "AE \u2013 Pollution Control Board", subject: "Noise & Industrial Pollution Control" },
    { category: "AE \u2013 Pollution Control Board", subject: "Solid & Hazardous Waste Management" },
    { category: "AE \u2013 Pollution Control Board", subject: "Environmental Law & Regulations" },
    { category: "AE \u2013 Pollution Control Board", subject: "Engineering Mathematics (AE PCB)" },
    // Addon: AE KWA
    { category: "AE \u2013 Kerala Water Authority", subject: "Advanced Water Supply Engineering" },
    { category: "AE \u2013 Kerala Water Authority", subject: "Advanced Wastewater Treatment & Reuse" },
    { category: "AE \u2013 Kerala Water Authority", subject: "Urban & Regional Planning" },
    { category: "AE \u2013 Kerala Water Authority", subject: "Basic Mechanical Engineering" },
    { category: "AE \u2013 Kerala Water Authority", subject: "Basic Chemical Engineering" },
    // Addon: Lecturer Polytechnics
    { category: "Lecturer Civil Engineering \u2013 Polytechnics", subject: "Engineering Mathematics (Poly Lecturer)" },
    { category: "Lecturer Civil Engineering \u2013 Polytechnics", subject: "Basic Electrical Engineering" },
    { category: "Lecturer Civil Engineering \u2013 Polytechnics", subject: "Basic Electronics Engineering" },
    { category: "Lecturer Civil Engineering \u2013 Polytechnics", subject: "Construction Management (Advanced)" },
    // Addon: Asst Professor
    { category: "Assistant Professor Civil Engineering", subject: "Engineering Mathematics (Asst. Professor)" },
    { category: "Assistant Professor Civil Engineering", subject: "Plastic Analysis & Matrix Methods" },
    { category: "Assistant Professor Civil Engineering", subject: "Structural Dynamics" },
    { category: "Assistant Professor Civil Engineering", subject: "GIS & Geoinformatics" },
  ],
};

const VALID_DOMAINS = new Set<string>(["iti", "diploma", "btech"]);
const VALID_DIFFICULTIES = new Set<string>(["easy", "medium", "hard"]);

// Build a fast lookup: "domain::subject_lowercase" → category
const SUBJECT_TO_CATEGORY = new Map<string, string>();
const SUBJECT_EXACT_CASE = new Map<string, string>();
for (const [domain, entries] of Object.entries(HIERARCHY)) {
  for (const { category, subject } of entries) {
    const key = `${domain}::${subject.toLowerCase()}`;
    SUBJECT_TO_CATEGORY.set(key, category);
    SUBJECT_EXACT_CASE.set(key, subject);
  }
}

// ---------------------------------------------------------------------------
// CSV ROW TYPE
// ---------------------------------------------------------------------------
interface CsvRow {
  domain?: string;
  category?: string;
  subject?: string;
  difficulty?: string;
  level?: string;
  question?: string;
  questiontext?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  optiona?: string;
  optionb?: string;
  optionc?: string;
  optiond?: string;
  correct?: string;
  correctanswer?: string;
  explanation?: string;
  xp?: string;
}

// ---------------------------------------------------------------------------
// VALIDATION
// ---------------------------------------------------------------------------
interface ValidRow {
  domain: Domain;
  category: string;
  subject: string;
  difficulty: Difficulty;
  level: 1 | 2 | 3;
  question: string;
  options: [string, string, string, string];
  correct: 0 | 1 | 2 | 3;
  explanation: string;
  xp: number;
}

interface FailedRow {
  rowNum: number;
  errors: string[];
  raw: CsvRow;
}

function validateRow(raw: CsvRow, rowNum: number): ValidRow | FailedRow {
  const errors: string[] = [];

  // --- Domain ---
  const domainRaw = raw.domain?.trim().toLowerCase() || "";
  if (!domainRaw) errors.push("Missing domain");
  else if (!VALID_DOMAINS.has(domainRaw)) errors.push(`Invalid domain "${domainRaw}"`);
  const domain = domainRaw as Domain;

  // --- Subject (case-insensitive match) ---
  const subjectRaw = raw.subject?.trim() || "";
  if (!subjectRaw) errors.push("Missing subject");
  const subjectKey = `${domain}::${subjectRaw.toLowerCase()}`;
  const subjectExact = SUBJECT_EXACT_CASE.get(subjectKey);
  if (subjectRaw && VALID_DOMAINS.has(domainRaw) && !subjectExact) {
    errors.push(`Unknown subject "${subjectRaw}" for domain "${domain}"`);
  }
  const subject = subjectExact || subjectRaw;

  // --- Category (auto-resolve or validate) ---
  const categoryRaw = raw.category?.trim() || "";
  const autoCategory = SUBJECT_TO_CATEGORY.get(subjectKey) || "";
  let category = autoCategory;
  if (categoryRaw && autoCategory && categoryRaw.toLowerCase() !== autoCategory.toLowerCase()) {
    errors.push(`Category "${categoryRaw}" doesn't match subject — expected "${autoCategory}"`);
  } else if (categoryRaw && !autoCategory) {
    category = categoryRaw; // Use provided if can't auto-resolve
  } else if (!categoryRaw && !autoCategory && subjectRaw) {
    errors.push(`Cannot resolve category for subject "${subjectRaw}"`);
  }

  // --- Difficulty ---
  const diffRaw = raw.difficulty?.trim().toLowerCase() || "";
  if (!diffRaw) errors.push("Missing difficulty");
  else if (!VALID_DIFFICULTIES.has(diffRaw)) errors.push(`Invalid difficulty "${diffRaw}"`);
  const difficulty = diffRaw as Difficulty;

  // --- Level (optional, auto-assign from difficulty) ---
  let level: 1 | 2 | 3 = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  const levelRaw = raw.level?.trim();
  if (levelRaw) {
    const n = parseInt(levelRaw, 10);
    if (isNaN(n) || n < 1 || n > 3) errors.push(`Invalid level "${levelRaw}" — use 1, 2, or 3`);
    else level = n as 1 | 2 | 3;
  }

  // --- Question text (support both column name variants) ---
  const question = (raw.question || raw.questiontext || "").trim();
  if (!question) errors.push("Missing question text");

  // --- Options (support both naming conventions) ---
  const options: string[] = [
    (raw.option1 || raw.optiona || "").trim(),
    (raw.option2 || raw.optionb || "").trim(),
    (raw.option3 || raw.optionc || "").trim(),
    (raw.option4 || raw.optiond || "").trim(),
  ];
  const emptyCount = options.filter((o) => !o).length;
  if (emptyCount > 0) errors.push(`${emptyCount} empty option(s)`);

  // --- Correct answer (support both column names) ---
  const correctRaw = (raw.correct || raw.correctanswer || "").trim();
  let correct: 0 | 1 | 2 | 3 = 0;
  if (!correctRaw) {
    errors.push("Missing correct answer index");
  } else {
    const n = parseInt(correctRaw, 10);
    if (isNaN(n)) {
      errors.push(`Invalid correct value "${correctRaw}" — use 0-3`);
    } else if (n >= 0 && n <= 3) {
      correct = n as 0 | 1 | 2 | 3;
    } else if (n >= 1 && n <= 4) {
      correct = (n - 1) as 0 | 1 | 2 | 3; // Accept 1-based
    } else {
      errors.push(`correct must be 0-3 (or 1-4), got "${correctRaw}"`);
    }
  }

  // --- XP (optional, default 10) ---
  let xp = 10;
  const xpRaw = raw.xp?.trim();
  if (xpRaw) {
    const n = parseInt(xpRaw, 10);
    if (isNaN(n) || n < 1 || n > 100) errors.push(`Invalid xp "${xpRaw}" — must be 1-100`);
    else xp = n;
  }

  // --- Explanation (optional) ---
  const explanation = raw.explanation?.trim() || "";

  if (errors.length > 0) {
    return { rowNum, errors, raw };
  }

  return {
    domain,
    category,
    subject,
    difficulty,
    level,
    question,
    options: options as [string, string, string, string],
    correct,
    explanation,
    xp,
  };
}

function isValid(result: ValidRow | FailedRow): result is ValidRow {
  return !("errors" in result);
}

// ---------------------------------------------------------------------------
// FIREBASE INIT
// ---------------------------------------------------------------------------
function initFirebase(): admin.firestore.Firestore {
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error("\n  Service account key not found at:");
    console.error(`  ${SERVICE_ACCOUNT_PATH}\n`);
    console.error("  Download it from Firebase Console:");
    console.error("  Project Settings > Service Accounts > Generate New Private Key\n");
    process.exit(1);
  }

  const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, "utf-8"));

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin.firestore();
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const csvPath = args.find((a) => !a.startsWith("--")) || DEFAULT_CSV;

  console.log("=".repeat(60));
  console.log("  Civilezy Question Importer");
  console.log("=".repeat(60));
  console.log(`  CSV file:  ${csvPath}`);
  console.log(`  Mode:      ${dryRun ? "DRY RUN (validate only)" : "LIVE IMPORT"}`);
  console.log("=".repeat(60));

  // --- Read CSV ---
  if (!fs.existsSync(csvPath)) {
    console.error(`\n  CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const parsed = Papa.parse<CsvRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ""),
  });

  if (parsed.errors.length > 0) {
    console.error("\n  CSV parse errors:");
    parsed.errors.slice(0, 10).forEach((e) => {
      console.error(`    Row ${e.row}: ${e.message}`);
    });
    if (parsed.errors.length > 10) {
      console.error(`    ... and ${parsed.errors.length - 10} more`);
    }
  }

  const totalRows = parsed.data.length;
  console.log(`\n  Parsed ${totalRows} rows from CSV.\n`);

  // --- Validate ---
  const validRows: ValidRow[] = [];
  const failedRows: FailedRow[] = [];

  for (let i = 0; i < parsed.data.length; i++) {
    const result = validateRow(parsed.data[i], i + 2); // +2 = 1-based + header
    if (isValid(result)) {
      validRows.push(result);
    } else {
      failedRows.push(result);
    }
  }

  // --- Report validation ---
  console.log("  Validation Results");
  console.log("  " + "-".repeat(40));
  console.log(`  Valid:    ${validRows.length}`);
  console.log(`  Failed:   ${failedRows.length}`);
  console.log(`  Total:    ${totalRows}`);

  if (failedRows.length > 0) {
    console.log("\n  Failed Rows:");
    console.log("  " + "-".repeat(40));
    const show = failedRows.slice(0, 20);
    for (const f of show) {
      console.log(`  Row ${f.rowNum}: ${f.errors.join(" | ")}`);
      const q = f.raw.question || f.raw.questiontext || "(empty)";
      console.log(`         "${q.slice(0, 60)}${q.length > 60 ? "..." : ""}"`);
    }
    if (failedRows.length > 20) {
      console.log(`\n  ... and ${failedRows.length - 20} more failed rows.`);
    }
  }

  // --- Domain/subject breakdown ---
  const domainCounts: Record<string, number> = {};
  const subjectCounts: Record<string, number> = {};
  for (const row of validRows) {
    domainCounts[row.domain] = (domainCounts[row.domain] || 0) + 1;
    const key = `${row.domain} > ${row.category} > ${row.subject}`;
    subjectCounts[key] = (subjectCounts[key] || 0) + 1;
  }

  console.log("\n  Breakdown by Domain:");
  console.log("  " + "-".repeat(40));
  for (const [d, count] of Object.entries(domainCounts).sort()) {
    console.log(`  ${d.padEnd(10)} ${count} questions`);
  }

  console.log("\n  Breakdown by Subject (top 15):");
  console.log("  " + "-".repeat(40));
  const sorted = Object.entries(subjectCounts).sort((a, b) => b[1] - a[1]);
  for (const [key, count] of sorted.slice(0, 15)) {
    console.log(`  ${key.padEnd(50)} ${count}`);
  }
  if (sorted.length > 15) {
    console.log(`  ... and ${sorted.length - 15} more subjects.`);
  }

  // --- Dry run stops here ---
  if (dryRun) {
    console.log("\n  DRY RUN complete. No data was uploaded.\n");
    process.exit(failedRows.length > 0 ? 1 : 0);
  }

  if (validRows.length === 0) {
    console.log("\n  No valid rows to import. Exiting.\n");
    process.exit(1);
  }

  // --- Upload to Firestore ---
  console.log("\n  Uploading to Firestore...");
  console.log("  " + "-".repeat(40));

  const db = initFirebase();
  const col = db.collection(FIRESTORE_COLLECTION);
  let totalWritten = 0;
  const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);

  for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
    const chunk = validRows.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batch = db.batch();

    for (const row of chunk) {
      const ref = col.doc();
      batch.set(ref, {
        domain: row.domain,
        category: row.category,
        subject: row.subject,
        difficulty: row.difficulty,
        level: row.level,
        question: row.question,
        options: row.options,
        correct: row.correct,
        explanation: row.explanation,
        xp: row.xp,
        status: "draft",
        isActive: true,
        createdBy: "csv-import",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    totalWritten += chunk.length;
    const pct = Math.round((totalWritten / validRows.length) * 100);
    console.log(`  Batch ${batchNum}/${totalBatches} — ${chunk.length} docs — ${totalWritten}/${validRows.length} (${pct}%)`);
  }

  // --- Final summary ---
  console.log("\n" + "=".repeat(60));
  console.log("  IMPORT COMPLETE");
  console.log("=".repeat(60));
  console.log(`  Uploaded:  ${totalWritten} questions`);
  console.log(`  Skipped:   ${failedRows.length} invalid rows`);
  console.log(`  Status:    All imported as "draft"`);
  console.log(`  Collection: ${FIRESTORE_COLLECTION}`);
  console.log("=".repeat(60));
  console.log("\n  Next: Go to Admin UI to review and publish questions.\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("\n  Fatal error:", err.message || err);
  process.exit(1);
});
