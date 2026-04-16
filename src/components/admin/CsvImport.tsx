"use client";

import { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import {
  batchImportQuestions,
  type QuestionInput,
  type Domain,
  type Difficulty,
} from "@/lib/questions";
import {
  getAllSubjects,
  getDomainHierarchy,
} from "@/data/subjectHierarchy";

// ─── Types ──────────────────────────────────────────────────────────────────
interface CsvRow {
  domain?: string;
  category?: string;
  subject?: string;
  difficulty?: string;
  level?: string;
  question?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  correct?: string;
  explanation?: string;
  xp?: string;
}

interface ValidatedRow {
  input: QuestionInput;
  rowNum: number;
}

interface InvalidRow {
  rowNum: number;
  raw: CsvRow;
  errors: string[];
}

/** Parsed state for a single CSV file */
interface ParsedFile {
  id: string;
  name: string;
  validRows: ValidatedRow[];
  invalidRows: InvalidRow[];
  status: "parsed" | "importing" | "done" | "error";
  written: number;
  error?: string;
}

type OverallPhase = "idle" | "preview" | "importing" | "done";

const VALID_DOMAINS: Domain[] = ["iti", "diploma", "btech"];
const VALID_DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const DOMAIN_LABELS: Record<Domain, string> = { iti: "ITI", diploma: "Diploma", btech: "B.Tech" };
const DIFF_COLORS: Record<Difficulty, string> = { easy: "#22c55e", medium: "#f59e0b", hard: "#ef4444" };

const CSV_TEMPLATE =
  "domain,category,subject,difficulty,level,question,option1,option2,option3,option4,correct,explanation,xp\n" +
  'iti,Building & Materials,Building Materials,easy,1,"The standard size of a modular brick in India is:","190x90x90 mm","230x115x75 mm","200x100x100 mm","220x110x80 mm",0,"Standard modular brick = 190x90x90 mm as per IS 1077.",5\n' +
  'diploma,Structures & Mechanics,Structural Engineering,medium,2,"The neutral axis depth factor in a singly reinforced beam depends on:","Steel % only","Modular ratio & steel %","Concrete grade only","Load intensity",1,"Neutral axis factor depends on modular ratio and permissible stresses.",10\n' +
  'btech,Structural Engineering,Structural Analysis,hard,3,"Stiffness coefficient K_ij represents:","Deflection at i due to unit load at j","Force at i due to unit displacement at j","Moment at i due to unit rotation at j","Displacement at i due to unit force at j",1,"K_ij = force at coordinate i when unit displacement is imposed at j while all other coordinates are restrained.",20\n' +
  'diploma,Water & Environment,Environmental Engineering,medium,2,"Standard BOD test is conducted at ___C for ___ days:","20C, 3 days","20C, 5 days","25C, 5 days","30C, 3 days",1,"BOD5 test standard conditions: 20C for 5 days.",10\n' +
  'iti,Surveying,Basic Surveying,easy,1,"In chain surveying, the check line is used to:","Measure distances","Check survey accuracy","Mark the baseline","Set right angles",1,"A check line verifies the accuracy of a surveyed triangle.",5\n';

// ─── Category resolution from hierarchy ─────────────────────────────────────

function resolveCategory(domain: Domain, subject: string): string | null {
  const hierarchy = getDomainHierarchy(domain);
  if (!hierarchy) return null;

  for (const cat of hierarchy.categories) {
    if (cat.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())) {
      return cat.name;
    }
  }

  if (hierarchy.addonGroups) {
    for (const group of hierarchy.addonGroups) {
      if (group.subjects.some((s) => s.toLowerCase() === subject.toLowerCase())) {
        return group.label;
      }
    }
  }

  return null;
}

// ─── Validation ─────────────────────────────────────────────────────────────

function validateRow(raw: CsvRow, rowNum: number, adminName: string): ValidatedRow | InvalidRow {
  const errors: string[] = [];

  const domain = raw.domain?.trim().toLowerCase() as Domain;
  if (!domain) errors.push("Missing domain");
  else if (!VALID_DOMAINS.includes(domain)) errors.push(`Invalid domain "${raw.domain}" — use iti, diploma, or btech`);

  const subject = raw.subject?.trim() || "";
  if (!subject) {
    errors.push("Missing subject");
  } else if (domain && VALID_DOMAINS.includes(domain)) {
    const allSubjects = getAllSubjects(domain);
    const match = allSubjects.find((s) => s.toLowerCase() === subject.toLowerCase());
    if (!match) errors.push(`Unknown subject "${subject}" for domain "${domain}"`);
  }

  let resolvedSubject = subject;
  if (domain && VALID_DOMAINS.includes(domain) && subject) {
    const allSubjects = getAllSubjects(domain);
    const exact = allSubjects.find((s) => s.toLowerCase() === subject.toLowerCase());
    if (exact) resolvedSubject = exact;
  }

  let resolvedCategory = "";
  if (domain && VALID_DOMAINS.includes(domain) && resolvedSubject) {
    const autoCategory = resolveCategory(domain, resolvedSubject);
    if (autoCategory) {
      resolvedCategory = autoCategory;
    } else {
      errors.push(`Cannot auto-resolve category for subject "${resolvedSubject}"`);
    }
  }

  const difficulty = raw.difficulty?.trim().toLowerCase() as Difficulty;
  if (!difficulty) errors.push("Missing difficulty");
  else if (!VALID_DIFFICULTIES.includes(difficulty)) errors.push(`Invalid difficulty "${raw.difficulty}" — use easy, medium, or hard`);

  let level: 1 | 2 | 3 = 1;
  const rawLevel = raw.level?.trim();
  if (rawLevel) {
    const num = parseInt(rawLevel, 10);
    if (isNaN(num) || num < 1 || num > 3) {
      errors.push(`Invalid level "${rawLevel}" — use 1, 2, or 3`);
    } else {
      level = num as 1 | 2 | 3;
    }
  } else if (difficulty) {
    level = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
  }

  const question = raw.question?.trim() || "";
  if (!question) errors.push("Missing question text");

  const options: string[] = [
    raw.option1?.trim() || "",
    raw.option2?.trim() || "",
    raw.option3?.trim() || "",
    raw.option4?.trim() || "",
  ];
  const emptyOpts = options.filter((o) => !o).length;
  if (emptyOpts > 0) errors.push(`${emptyOpts} empty option(s)`);

  let correct: 0 | 1 | 2 | 3 = 0;
  const rawCorrect = raw.correct?.trim();
  if (rawCorrect === undefined || rawCorrect === "") {
    errors.push("Missing correct answer index");
  } else {
    const num = parseInt(rawCorrect, 10);
    if (isNaN(num)) {
      errors.push(`Invalid correct value "${rawCorrect}" — use 0–3`);
    } else if (num >= 0 && num <= 3) {
      correct = num as 0 | 1 | 2 | 3;
    } else if (num >= 1 && num <= 4) {
      correct = (num - 1) as 0 | 1 | 2 | 3;
    } else {
      errors.push(`correct must be 0–3 (or 1–4), got "${rawCorrect}"`);
    }
  }

  const xpRaw = raw.xp?.trim();
  let xp = 10;
  if (xpRaw) {
    const parsed = parseInt(xpRaw, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 100) {
      errors.push(`Invalid XP "${xpRaw}" — must be 1–100`);
    } else {
      xp = parsed;
    }
  }

  const explanation = raw.explanation?.trim() || "";

  if (errors.length > 0) {
    return { rowNum, raw, errors };
  }

  return {
    rowNum,
    input: {
      domain,
      category: resolvedCategory,
      subject: resolvedSubject,
      difficulty,
      level,
      question,
      options: options as [string, string, string, string],
      correct,
      explanation,
      xp,
      status: "draft",
      isActive: true,
      createdBy: adminName,
    },
  };
}

function isValid(result: ValidatedRow | InvalidRow): result is ValidatedRow {
  return "input" in result;
}

// ─── Parse a single file into a ParsedFile ──────────────────────────────────

function parseFile(file: File, adminName: string): Promise<ParsedFile> {
  return new Promise((resolve, reject) => {
    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, ""),
      complete(results) {
        const valid: ValidatedRow[] = [];
        const invalid: InvalidRow[] = [];

        results.data.forEach((row, i) => {
          const result = validateRow(row, i + 2, adminName);
          if (isValid(result)) valid.push(result);
          else invalid.push(result);
        });

        resolve({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name: file.name,
          validRows: valid,
          invalidRows: invalid,
          status: "parsed",
          written: 0,
        });
      },
      error(err) {
        reject(new Error(`CSV parse error in ${file.name}: ${err.message}`));
      },
    });
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

interface Props {
  adminName: string;
  onImportDone: () => void;
}

export default function CsvImport({ adminName, onImportDone }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<OverallPhase>("idle");
  const [files, setFiles] = useState<ParsedFile[]>([]);
  const [parseError, setParseError] = useState("");
  const [expandedFile, setExpandedFile] = useState<string | null>(null);

  // ── Process multiple files ──
  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      const csvFiles = Array.from(fileList).filter((f) => f.name.endsWith(".csv"));
      if (csvFiles.length === 0) {
        setParseError("No .csv files found. Only .csv files are accepted.");
        return;
      }

      setParseError("");
      const parsed: ParsedFile[] = [];

      for (const file of csvFiles) {
        try {
          const result = await parseFile(file, adminName);
          parsed.push(result);
        } catch (err) {
          parsed.push({
            id: `${file.name}-err`,
            name: file.name,
            validRows: [],
            invalidRows: [],
            status: "error",
            written: 0,
            error: err instanceof Error ? err.message : "Parse failed",
          });
        }
      }

      setFiles(parsed);
      setPhase("preview");
    },
    [adminName],
  );

  // ── Drag & drop handlers ──
  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fl = e.target.files;
    if (fl && fl.length > 0) processFiles(fl);
    e.target.value = "";
  };

  // ── Remove a single file from the list ──
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const next = prev.filter((f) => f.id !== id);
      if (next.length === 0) setPhase("idle");
      return next;
    });
  };

  // ── Import all files sequentially ──
  const handleImportAll = async () => {
    const importable = files.filter((f) => f.validRows.length > 0 && f.status === "parsed");
    if (importable.length === 0) return;

    setPhase("importing");

    for (const pf of importable) {
      // Mark as importing
      setFiles((prev) => prev.map((f) => f.id === pf.id ? { ...f, status: "importing" as const } : f));

      try {
        const count = await batchImportQuestions(
          pf.validRows.map((r) => r.input),
          (written) => {
            setFiles((prev) => prev.map((f) => f.id === pf.id ? { ...f, written } : f));
          },
        );
        setFiles((prev) => prev.map((f) => f.id === pf.id ? { ...f, status: "done" as const, written: count } : f));
      } catch (err) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === pf.id
              ? { ...f, status: "error" as const, error: err instanceof Error ? err.message : "Write failed" }
              : f,
          ),
        );
        // Continue to next file — don't stop the whole batch
      }
    }

    setPhase("done");
    onImportDone();
  };

  // ── Reset ──
  const reset = () => {
    setPhase("idle");
    setFiles([]);
    setParseError("");
    setExpandedFile(null);
  };

  // ── Download template ──
  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "civilezy_questions_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Aggregate stats ──
  const totalValid = files.reduce((sum, f) => sum + f.validRows.length, 0);
  const totalInvalid = files.reduce((sum, f) => sum + f.invalidRows.length, 0);
  const totalWritten = files.reduce((sum, f) => sum + f.written, 0);
  const filesWithErrors = files.filter((f) => f.status === "error").length;
  const filesDone = files.filter((f) => f.status === "done").length;
  const filesImporting = files.filter((f) => f.status === "importing").length;
  const importableCount = files.filter((f) => f.validRows.length > 0 && f.status === "parsed").length;

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={S.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: 0 }}>
          CSV Bulk Import
        </h3>
        <button onClick={downloadTemplate} style={S.templateBtn}>
          Download CSV Template
        </button>
      </div>

      {/* ── Error banner ── */}
      {parseError && (
        <div style={S.errorBanner}>{parseError}</div>
      )}

      {/* ═══ IDLE — Upload zone ═══ */}
      {phase === "idle" && (
        <>
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              ...S.dropZone,
              borderColor: isDragging ? "#FF6200" : "rgba(255,255,255,0.15)",
              background: isDragging ? "rgba(255,98,0,0.08)" : "rgba(255,255,255,0.02)",
            }}
          >
            <input ref={fileRef} type="file" accept=".csv" multiple onChange={onFileChange} style={{ display: "none" }} />
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>CSV</div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: "6px" }}>
              {isDragging ? "Drop your CSV files here" : "Drag & drop one or more CSV files"}
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              or click to browse — select multiple .csv files
            </div>
          </div>

          {/* Format guide */}
          <div style={S.formatGuide}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: "8px" }}>
              Required CSV columns:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["domain*", "subject*", "difficulty*", "question*", "option1*", "option2*", "option3*", "option4*", "correct*"].map((col) => (
                <span key={col} style={S.colChipRequired}>{col}</span>
              ))}
              {["category", "level", "explanation", "xp"].map((col) => (
                <span key={col} style={S.colChipOptional}>{col}</span>
              ))}
            </div>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "8px" }}>
              <strong>correct:</strong> 0-3 (zero-based) or 1-4 (auto-converted) &nbsp;-&nbsp;
              <strong>domain:</strong> iti / diploma / btech &nbsp;-&nbsp;
              <strong>difficulty:</strong> easy / medium / hard &nbsp;-&nbsp;
              <strong>level:</strong> 1-3 (auto-assigned from difficulty if omitted) &nbsp;-&nbsp;
              <strong>category:</strong> auto-resolved from subject if omitted
            </div>
          </div>
        </>
      )}

      {/* ═══ PREVIEW — Parsed files summary ═══ */}
      {phase === "preview" && (
        <>
          {/* Aggregate summary bar */}
          <div style={S.summaryBar}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <StatChip color="rgba(255,255,255,0.5)" label={files.length === 1 ? "file" : "files"} count={files.length} />
              <StatChip color="#22c55e" label="valid" count={totalValid} />
              <StatChip color="#ef4444" label="errors" count={totalInvalid} />
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={reset} style={S.btnSecondary}>Start Over</button>
              <button
                onClick={handleImportAll}
                disabled={importableCount === 0}
                style={{
                  ...S.btnPrimary,
                  opacity: importableCount === 0 ? 0.4 : 1,
                  cursor: importableCount === 0 ? "not-allowed" : "pointer",
                }}
              >
                Import {totalValid} Question{totalValid !== 1 ? "s" : ""} from {importableCount} file{importableCount !== 1 ? "s" : ""}
              </button>
            </div>
          </div>

          {/* Per-file cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {files.map((pf) => {
              const isExpanded = expandedFile === pf.id;
              return (
                <div key={pf.id} style={S.fileCard}>
                  {/* File header */}
                  <div
                    style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
                    onClick={() => setExpandedFile(isExpanded ? null : pf.id)}
                  >
                    <span style={{ fontSize: "18px" }}>
                      {pf.status === "error" ? "X" : pf.validRows.length > 0 ? "CSV" : "!"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{pf.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                        {pf.status === "error" ? (
                          <span style={{ color: "#ef4444" }}>{pf.error}</span>
                        ) : (
                          <>
                            <span style={{ color: "#22c55e" }}>{pf.validRows.length} valid</span>
                            {pf.invalidRows.length > 0 && (
                              <span style={{ color: "#ef4444", marginLeft: "8px" }}>{pf.invalidRows.length} errors</span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFile(pf.id); }}
                      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: "18px", padding: "4px 8px" }}
                      title="Remove file"
                    >
                      x
                    </button>
                  </div>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div style={{ marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                      {/* Invalid rows */}
                      {pf.invalidRows.length > 0 && (
                        <div style={{ marginBottom: "12px" }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#ef4444", marginBottom: "6px" }}>
                            {pf.invalidRows.length} row{pf.invalidRows.length !== 1 ? "s" : ""} with errors:
                          </div>
                          <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "4px" }}>
                            {pf.invalidRows.map((row) => (
                              <div key={row.rowNum} style={S.errorRow}>
                                <span style={{ fontWeight: 700, color: "#ef4444", fontSize: "11px", flexShrink: 0 }}>Row {row.rowNum}</span>
                                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                                  {row.raw.question?.slice(0, 50) || "(empty)"}
                                </span>
                                <span style={{ fontSize: "11px", color: "#ef4444", flexShrink: 0 }}>{row.errors.join(" | ")}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Valid rows preview */}
                      {pf.validRows.length > 0 && (
                        <div>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#22c55e", marginBottom: "6px" }}>
                            {pf.validRows.length} question{pf.validRows.length !== 1 ? "s" : ""} ready:
                          </div>
                          <div style={{ overflowX: "auto" }}>
                            <table style={S.table}>
                              <thead>
                                <tr>
                                  <th style={S.th}>#</th>
                                  <th style={S.th}>Domain</th>
                                  <th style={S.th}>Category</th>
                                  <th style={S.th}>Subject</th>
                                  <th style={S.th}>Diff</th>
                                  <th style={{ ...S.th, minWidth: "200px" }}>Question</th>
                                  <th style={S.th}>Answer</th>
                                  <th style={S.th}>XP</th>
                                </tr>
                              </thead>
                              <tbody>
                                {pf.validRows.slice(0, 30).map((r) => (
                                  <tr key={r.rowNum}>
                                    <td style={S.td}>{r.rowNum}</td>
                                    <td style={S.td}><span style={{ color: "#FF8534", fontWeight: 700, fontSize: "12px" }}>{DOMAIN_LABELS[r.input.domain]}</span></td>
                                    <td style={{ ...S.td, maxWidth: "100px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{r.input.category}</td>
                                    <td style={{ ...S.td, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.input.subject}</td>
                                    <td style={S.td}><span style={{ color: DIFF_COLORS[r.input.difficulty], fontWeight: 700, fontSize: "12px" }}>{r.input.difficulty}</span></td>
                                    <td style={{ ...S.td, maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.input.question}</td>
                                    <td style={{ ...S.td, fontSize: "12px", color: "#22c55e" }}>{r.input.options[r.input.correct]}</td>
                                    <td style={S.td}>{r.input.xp}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {pf.validRows.length > 30 && (
                              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "8px" }}>
                                Showing first 30 of {pf.validRows.length} rows
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ═══ IMPORTING — Progress ═══ */}
      {phase === "importing" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>
              Importing questions...
            </div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
              {totalWritten} of {totalValid} written — {filesDone} of {files.length} files complete
            </div>
          </div>

          {/* Overall progress bar */}
          <div style={{ maxWidth: "500px", margin: "0 auto 24px", height: "8px", background: "rgba(255,255,255,0.1)", borderRadius: "10px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "linear-gradient(90deg, #FF6200, #FFB800)",
                borderRadius: "10px",
                width: totalValid > 0 ? `${(totalWritten / totalValid) * 100}%` : "0%",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          {/* Per-file status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {files.map((pf) => (
              <div key={pf.id} style={{ ...S.fileStatusRow, borderLeftColor: pf.status === "done" ? "#22c55e" : pf.status === "error" ? "#ef4444" : pf.status === "importing" ? "#FF6200" : "rgba(255,255,255,0.1)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{pf.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    {pf.status === "done" && <span style={{ color: "#22c55e" }}>{pf.written} imported</span>}
                    {pf.status === "importing" && <span style={{ color: "#FF6200" }}>{pf.written} / {pf.validRows.length} writing...</span>}
                    {pf.status === "error" && <span style={{ color: "#ef4444" }}>{pf.error}</span>}
                    {pf.status === "parsed" && <span>Waiting... ({pf.validRows.length} questions)</span>}
                  </div>
                </div>
                <StatusBadge status={pf.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ DONE — Summary ═══ */}
      {phase === "done" && (
        <div>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "8px" }}>Done</div>
            <div style={{ fontSize: "20px", fontWeight: 700, color: "#22c55e", marginBottom: "4px" }}>
              Import Complete!
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "4px" }}>
              <strong>{totalWritten}</strong> question{totalWritten !== 1 ? "s" : ""} added as <strong style={{ color: "#f59e0b" }}>drafts</strong> from {filesDone} file{filesDone !== 1 ? "s" : ""}.
            </div>
            {filesWithErrors > 0 && (
              <div style={{ fontSize: "13px", color: "#ef4444" }}>
                {filesWithErrors} file{filesWithErrors !== 1 ? "s" : ""} had errors.
              </div>
            )}
          </div>

          {/* Per-file results */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
            {files.map((pf) => (
              <div key={pf.id} style={{ ...S.fileStatusRow, borderLeftColor: pf.status === "done" ? "#22c55e" : "#ef4444" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{pf.name}</div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                    {pf.status === "done" ? (
                      <>
                        <span style={{ color: "#22c55e" }}>{pf.written} imported</span>
                        {pf.invalidRows.length > 0 && (
                          <span style={{ color: "#ef4444", marginLeft: "8px" }}>{pf.invalidRows.length} rows skipped</span>
                        )}
                      </>
                    ) : (
                      <span style={{ color: "#ef4444" }}>{pf.error || "Failed"}</span>
                    )}
                  </div>
                </div>
                <StatusBadge status={pf.status} />
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", display: "flex", gap: "10px", justifyContent: "center" }}>
            <button onClick={reset} style={S.btnPrimary}>Import More Files</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function StatChip({ color, label, count }: { color: string; label: string; count: number }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: `${color}15`, border: `1px solid ${color}30`, borderRadius: "8px", padding: "3px 10px", fontSize: "12px", fontWeight: 700, color }}>
      {count} {label}
    </span>
  );
}

function StatusBadge({ status }: { status: ParsedFile["status"] }) {
  const config = {
    parsed:    { label: "Pending",    color: "rgba(255,255,255,0.5)", bg: "rgba(255,255,255,0.06)" },
    importing: { label: "Writing...", color: "#FF6200",               bg: "rgba(255,98,0,0.12)" },
    done:      { label: "Done",       color: "#22c55e",               bg: "rgba(34,197,94,0.12)" },
    error:     { label: "Failed",     color: "#ef4444",               bg: "rgba(239,68,68,0.12)" },
  }[status];

  return (
    <span style={{ fontSize: "11px", fontWeight: 700, color: config.color, background: config.bg, padding: "3px 10px", borderRadius: "6px" }}>
      {config.label}
    </span>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const S = {
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "24px",
  } as React.CSSProperties,
  dropZone: {
    border: "2px dashed",
    borderRadius: "14px",
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
  } as React.CSSProperties,
  formatGuide: {
    marginTop: "16px",
    padding: "14px 18px",
    background: "rgba(255,184,0,0.06)",
    border: "1px solid rgba(255,184,0,0.15)",
    borderRadius: "12px",
  } as React.CSSProperties,
  colChipRequired: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "monospace",
    color: "#FFB800",
    background: "rgba(255,184,0,0.12)",
    border: "1px solid rgba(255,184,0,0.25)",
  } as React.CSSProperties,
  colChipOptional: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    fontFamily: "monospace",
    color: "rgba(255,255,255,0.5)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
  } as React.CSSProperties,
  summaryBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "20px",
    padding: "14px 18px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
  } as React.CSSProperties,
  errorBanner: {
    background: "rgba(239,68,68,0.12)",
    border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "10px",
    padding: "10px 16px",
    fontSize: "13px",
    color: "#ef4444",
    marginBottom: "16px",
  } as React.CSSProperties,
  errorRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "6px 10px",
    background: "rgba(239,68,68,0.06)",
    border: "1px solid rgba(239,68,68,0.15)",
    borderRadius: "6px",
    fontSize: "12px",
  } as React.CSSProperties,
  fileCard: {
    padding: "14px 18px",
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
  } as React.CSSProperties,
  fileStatusRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.03)",
    borderLeft: "3px solid",
    borderRadius: "8px",
  } as React.CSSProperties,
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "13px",
  } as React.CSSProperties,
  th: {
    textAlign: "left",
    padding: "6px 8px",
    fontSize: "11px",
    fontWeight: 700,
    color: "rgba(255,255,255,0.4)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  td: {
    padding: "6px 8px",
    color: "rgba(255,255,255,0.75)",
    borderBottom: "1px solid rgba(255,255,255,0.04)",
    fontSize: "12px",
  } as React.CSSProperties,
  templateBtn: {
    background: "rgba(100,200,255,0.1)",
    border: "1px solid rgba(100,200,255,0.25)",
    borderRadius: "10px",
    padding: "8px 16px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#64C8FF",
    cursor: "pointer",
    transition: "background 0.15s",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  btnPrimary: {
    background: "linear-gradient(135deg,#FF6200,#FF8534)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "10px 24px",
    fontSize: "14px",
    fontWeight: 700,
    cursor: "pointer",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  btnSecondary: {
    background: "transparent",
    color: "rgba(255,255,255,0.6)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
};
