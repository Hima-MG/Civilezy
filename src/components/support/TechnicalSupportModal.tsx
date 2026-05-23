"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useSupportModal } from "@/contexts/SupportContext";
import { useAuth } from "@/contexts/AuthContext";
import { CATEGORIES, COURSE_OPTIONS, type TicketCategory } from "@/lib/tickets";
import { storage } from "@/lib/firebase";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_SCREENSHOTS = 5;
const MAX_SCREENSHOT_MB = 5;
const MAX_SCREEN_REC_MB = 25;
const MAX_VOICE_SECONDS = 180; // 3 minutes

// ─── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  studentName: string;
  studentEmail: string;
  whatsappNumber: string;
  courseName: string;
  category: TicketCategory | "";
  description: string;
}

type UploadItemStatus = "pending" | "uploading" | "done" | "failed";

interface UploadItem {
  label: string;
  status: UploadItemStatus;
  progress: number; // 0-100
}

interface UploadState {
  items: UploadItem[];
  allDone: boolean;
  failedCount: number;
}

const EMPTY: FormState = {
  studentName: "", studentEmail: "", whatsappNumber: "",
  courseName: "", category: "", description: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSupportedMimeType(): string {
  if (typeof window === "undefined" || !window.MediaRecorder) return "";
  const types = [
    "audio/webm;codecs=opus", "audio/webm",
    "audio/ogg;codecs=opus", "audio/mp4",
  ];
  for (const t of types) {
    try { if (MediaRecorder.isTypeSupported(t)) return t; } catch { /* skip */ }
  }
  return "";
}

function fmtTime(s: number): string {
  const m = Math.floor(s / 60);
  return `${m}:${(s % 60).toString().padStart(2, "0")}`;
}

/**
 * Compress + resize an image using Canvas API.
 * • Tries WebP first (smaller, supported on all modern browsers).
 * • Falls back to JPEG when WebP toBlob() returns null (Safari < 2022, some Android WebViews).
 * • 8-second timeout guard prevents a hung canvas.toBlob() from stalling the upload.
 * • Skips compression for GIF to avoid losing animation.
 */
async function compressImage(file: File, maxPx = 1600, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;

  return new Promise<Blob>((resolve) => {
    let settled = false;
    const settle = (blob: Blob) => { if (!settled) { settled = true; resolve(blob); } };

    // Timeout guard — never hang longer than 8s; fall back to original file
    const guard = setTimeout(() => {
      console.warn("[compress] timeout — using original file:", file.name);
      settle(file);
    }, 8000);

    const img = new Image();
    const objUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objUrl);
      clearTimeout(guard);

      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxPx || h > maxPx) {
        if (w >= h) { h = Math.round(h * maxPx / w); w = maxPx; }
        else { w = Math.round(w * maxPx / h); h = maxPx; }
      }

      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

      // Try WebP first
      canvas.toBlob((webpBlob) => {
        if (webpBlob && webpBlob.size > 0) { settle(webpBlob); return; }
        // WebP not supported — fall back to JPEG
        canvas.toBlob((jpegBlob) => {
          settle(jpegBlob && jpegBlob.size > 0 ? jpegBlob : file);
        }, "image/jpeg", quality);
      }, "image/webp", quality);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objUrl);
      clearTimeout(guard);
      settle(file);
    };

    img.src = objUrl;
  });
}

/** Upload a file/blob to Firebase Storage with progress callback. Returns download URL or null. */
async function uploadWithProgress(
  fileOrBlob: File | Blob,
  path: string,
  onProgress?: (pct: number) => void
): Promise<string | null> {
  try {
    const sRef = storageRef(storage, path);
    const task = uploadBytesResumable(sRef, fileOrBlob);

    return await new Promise<string | null>((resolve) => {
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          onProgress?.(pct);
        },
        (err) => {
          console.warn(`[upload] ${path} failed:`, err);
          resolve(null);
        },
        async () => {
          try { resolve(await getDownloadURL(task.snapshot.ref)); }
          catch { resolve(null); }
        }
      );
    });
  } catch (err) {
    console.warn(`[upload] ${path} failed:`, err);
    return null;
  }
}

/** Immutably update one item's status + progress in UploadState. */
function patchItem(
  prev: UploadState,
  idx: number,
  patch: Partial<UploadItem>
): UploadState {
  const items = [...prev.items];
  items[idx] = { ...items[idx], ...patch };
  return { ...prev, items };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function TechnicalSupportModal() {
  const { isOpen, closeModal } = useSupportModal();
  const { user, profile } = useAuth();

  // Form
  const [form, setForm] = useState<FormState>({ ...EMPTY });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  // Submission result
  const [submitted, setSubmitted] = useState<string | null>(null);          // ticketId (TECH-XXXXXX)
  const [submittedDocId, setSubmittedDocId] = useState<string | null>(null); // Firestore doc ID
  const [uploadState, setUploadState] = useState<UploadState | null>(null);

  // Ref for retry (snapshot of files at submit time)
  const uploadSnapshotRef = useRef<{
    docId: string;
    screenshots: File[];
    voice: Blob | null;
    voiceDur: number;
    video: File | null;
  } | null>(null);

  // Screenshots
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const imgInputRef = useRef<HTMLInputElement>(null);
  const camInputRef = useRef<HTMLInputElement>(null);

  // Voice recording
  const [recState, setRecState] = useState<"idle" | "recording" | "recorded">("idle");
  const [recTime, setRecTime] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState<Blob | null>(null);
  const [voiceBlobUrl, setVoiceBlobUrl] = useState<string | null>(null);
  const mediaRecRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recTimeRef = useRef(0);

  // Screen recording
  const [screenRec, setScreenRec] = useState<File | null>(null);
  const screenRecInputRef = useRef<HTMLInputElement>(null);

  const canRecord =
    typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia;

  // ── Stop recording ────────────────────────────────────────────────────────
  const doStop = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (mediaRecRef.current && mediaRecRef.current.state !== "inactive") {
      mediaRecRef.current.stop();
    }
  }, []);

  // Auto-stop at max duration
  useEffect(() => {
    if (recState === "recording" && recTime >= MAX_VOICE_SECONDS) doStop();
  }, [recTime, recState, doStop]);

  // Pre-fill from auth
  useEffect(() => {
    if (user && profile) {
      setForm(f => ({
        ...f,
        studentName: profile.displayName ?? f.studentName,
        studentEmail: user.email ?? f.studentEmail,
      }));
    }
  }, [user, profile]);

  // Reset everything when modal closes
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setForm(user && profile
          ? { ...EMPTY, studentName: profile.displayName ?? "", studentEmail: user.email ?? "" }
          : { ...EMPTY });
        setErrors({});
        setSubmitted(null);
        setSubmittedDocId(null);
        setUploadState(null);
        uploadSnapshotRef.current = null;
        setSubmitting(false);
        setUploadMsg("");

        // Screenshots
        setScreenshotPreviews(prev => { prev.forEach(URL.revokeObjectURL); return []; });
        setScreenshots([]);

        // Voice
        doStop();
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        mediaRecRef.current = null;
        recTimeRef.current = 0;
        setVoiceBlobUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
        setVoiceBlob(null);
        setRecState("idle");
        setRecTime(0);

        // Screen rec
        setScreenRec(null);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, user, profile, doStop]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  // ── Screenshot handlers ───────────────────────────────────────────────────
  function handleImagesSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    const remaining = MAX_SCREENSHOTS - screenshots.length;
    const toAdd: File[] = [];
    for (const f of files.slice(0, remaining)) {
      if (!f.type.startsWith("image/")) { alert(`${f.name} is not an image`); continue; }
      if (f.size > MAX_SCREENSHOT_MB * 1024 * 1024) {
        alert(`${f.name} exceeds ${MAX_SCREENSHOT_MB} MB`); continue;
      }
      toAdd.push(f);
    }
    if (toAdd.length === 0) return;
    const newPreviews = toAdd.map(f => URL.createObjectURL(f));
    setScreenshots(prev => [...prev, ...toAdd]);
    setScreenshotPreviews(prev => [...prev, ...newPreviews]);
  }

  function removeScreenshot(i: number) {
    URL.revokeObjectURL(screenshotPreviews[i]);
    setScreenshots(prev => prev.filter((_, idx) => idx !== i));
    setScreenshotPreviews(prev => prev.filter((_, idx) => idx !== i));
  }

  // ── Voice handlers ────────────────────────────────────────────────────────
  async function handleStartRecording() {
    if (!canRecord) { alert("Voice recording is not supported in this browser."); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      chunksRef.current = [];
      recTimeRef.current = 0;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecRef.current = recorder;

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        setVoiceBlob(blob);
        setVoiceBlobUrl(url);
        setRecState("recorded");
        stream.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      };

      recorder.start(1000);
      setRecState("recording");
      setRecTime(0);

      timerRef.current = setInterval(() => {
        recTimeRef.current += 1;
        setRecTime(recTimeRef.current);
      }, 1000);
    } catch (err) {
      console.error("[voice]", err);
      alert("Could not access the microphone. Please allow microphone access and try again.");
    }
  }

  function handleStopRecording() { doStop(); }

  function handleReRecord() {
    setVoiceBlobUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setVoiceBlob(null);
    setRecState("idle");
    setRecTime(0);
    recTimeRef.current = 0;
  }

  // ── Screen recording handler ───────────────────────────────────────────────
  function handleScreenRecSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    if (f.size > MAX_SCREEN_REC_MB * 1024 * 1024) {
      alert(`Screen recording must be under ${MAX_SCREEN_REC_MB} MB`); return;
    }
    setScreenRec(f);
  }

  // ── Validation ────────────────────────────────────────────────────────────
  function validate(): boolean {
    const e: Partial<FormState> = {};
    if (!form.studentName.trim()) e.studentName = "Name is required";
    if (!form.studentEmail.trim()) {
      e.studentEmail = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.studentEmail)) {
      e.studentEmail = "Enter a valid email address";
    }
    if (!form.whatsappNumber.trim()) {
      e.whatsappNumber = "WhatsApp number is required";
    } else if (!/^[6-9]\d{9}$/.test(form.whatsappNumber.replace(/\s/g, ""))) {
      e.whatsappNumber = "Enter a valid 10-digit Indian mobile number";
    }
    if (!form.courseName) e.courseName = "Select your course";
    if (!form.category) e.category = "Select an issue category" as never;
    if (!form.description.trim()) {
      e.description = "Description is required";
    } else if (form.description.trim().length < 20) {
      e.description = "Describe the issue in at least 20 characters";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Background upload (runs AFTER ticket creation, non-blocking) ──────────
  //
  // KEY OPTIMIZATION: screenshots + voice + video all run in FULL PARALLEL
  // via a single Promise.all([...screenshotPromises, voicePromise, videoPromise]).
  // The previous version ran screenshots parallel but voice/video sequential.
  //
  async function backgroundUpload(
    docId: string,
    files: File[],
    voiceBlobData: Blob | null,
    voiceDur: number,
    videoFile: File | null,
  ) {
    const ts = Date.now();
    const t0 = performance.now();

    // Precompute stable indices for each upload task
    const scCount = files.length;
    const voiceIdx = scCount;                             // voice always after screenshots
    const videoIdx = scCount + (voiceBlobData ? 1 : 0);  // video after voice

    // Build task list
    const tasks: UploadItem[] = [
      ...files.map((_, i) => ({
        label: files.length === 1 ? "Screenshot" : `Screenshot ${i + 1} of ${files.length}`,
        status: "pending" as const,
        progress: 0,
      })),
      ...(voiceBlobData ? [{ label: "Voice note", status: "pending" as const, progress: 0 }] : []),
      ...(videoFile     ? [{ label: "Screen recording", status: "pending" as const, progress: 0 }] : []),
    ];

    if (tasks.length === 0) {
      setUploadState({ items: [], allDone: true, failedCount: 0 });
      return;
    }

    setUploadState({ items: tasks, allDone: false, failedCount: 0 });
    console.log(`[upload] ▶ Starting ${tasks.length} upload(s) in parallel`);

    // ── ALL uploads run simultaneously ────────────────────────────────────────
    const [screenshotResults, voiceUrl, videoUrl] = await Promise.all([

      // Screenshots — compress then upload, all parallel
      Promise.all(
        files.map(async (file, i) => {
          const tFile = performance.now();
          setUploadState(p => p ? patchItem(p, i, { status: "uploading", progress: 0 }) : p);
          try {
            const tCompress = performance.now();
            const compressed = await compressImage(file);
            const ratio = ((1 - compressed.size / file.size) * 100).toFixed(0);
            console.log(`[upload] screenshot[${i}] compressed in ${Math.round(performance.now() - tCompress)}ms — saved ${ratio}% (${(file.size/1024).toFixed(0)}KB → ${(compressed.size/1024).toFixed(0)}KB)`);

            const ext = compressed.type === "image/webp" ? "webp" : "jpg";
            const baseName = file.name.replace(/\.[^.]+$/, "");
            const url = await uploadWithProgress(
              compressed,
              `support_screenshots/${ts}_${i}_${encodeURIComponent(baseName)}.${ext}`,
              (pct) => setUploadState(p => p ? patchItem(p, i, { progress: pct }) : p)
            );
            console.log(`[upload] screenshot[${i}] done in ${Math.round(performance.now() - tFile)}ms — ${url ? "✓" : "✗"}`);
            setUploadState(p => p ? patchItem(p, i, { status: url ? "done" : "failed", progress: 100 }) : p);
            return url;
          } catch (err) {
            console.warn(`[upload] screenshot[${i}] error:`, err);
            setUploadState(p => p ? patchItem(p, i, { status: "failed" }) : p);
            return null;
          }
        })
      ),

      // Voice note (runs in parallel with screenshots)
      voiceBlobData
        ? (async () => {
            const tVoice = performance.now();
            setUploadState(p => p ? patchItem(p, voiceIdx, { status: "uploading", progress: 0 }) : p);
            try {
              const url = await uploadWithProgress(
                voiceBlobData,
                `support_voice/${ts}_voice.webm`,
                (pct) => setUploadState(p => p ? patchItem(p, voiceIdx, { progress: pct }) : p)
              );
              console.log(`[upload] voice done in ${Math.round(performance.now() - tVoice)}ms — ${url ? "✓" : "✗"}`);
              setUploadState(p => p ? patchItem(p, voiceIdx, { status: url ? "done" : "failed", progress: 100 }) : p);
              return url;
            } catch (err) {
              console.warn("[upload] voice error:", err);
              setUploadState(p => p ? patchItem(p, voiceIdx, { status: "failed" }) : p);
              return null;
            }
          })()
        : Promise.resolve(null),

      // Screen recording (runs in parallel with screenshots + voice)
      videoFile
        ? (async () => {
            const tVideo = performance.now();
            setUploadState(p => p ? patchItem(p, videoIdx, { status: "uploading", progress: 0 }) : p);
            try {
              const url = await uploadWithProgress(
                videoFile,
                `support_screen/${ts}_${encodeURIComponent(videoFile.name)}`,
                (pct) => setUploadState(p => p ? patchItem(p, videoIdx, { progress: pct }) : p)
              );
              console.log(`[upload] video done in ${Math.round(performance.now() - tVideo)}ms — ${url ? "✓" : "✗"}`);
              setUploadState(p => p ? patchItem(p, videoIdx, { status: url ? "done" : "failed", progress: 100 }) : p);
              return url;
            } catch (err) {
              console.warn("[upload] video error:", err);
              setUploadState(p => p ? patchItem(p, videoIdx, { status: "failed" }) : p);
              return null;
            }
          })()
        : Promise.resolve(null),

    ]); // end Promise.all

    const uploadElapsed = Math.round(performance.now() - t0);
    console.log(`[upload] ✅ All uploads finished in ${uploadElapsed}ms`);

    // ── PATCH ticket with collected URLs ──────────────────────────────────────
    const attachments = screenshotResults.filter((u): u is string => !!u);
    const patch: Record<string, unknown> = {};
    if (attachments.length) { patch.attachments = attachments; patch.screenshotUrl = attachments[0]; }
    if (voiceUrl) { patch.voiceNoteUrl = voiceUrl; patch.voiceDuration = voiceDur; }
    if (videoUrl) patch.screenRecordingUrl = videoUrl;

    if (Object.keys(patch).length > 0) {
      const tPatch = performance.now();
      const patchPayload = { id: docId, ...patch };
      console.log(`[upload] PATCH payload — docId: ${docId}, fields:`, Object.keys(patch).join(", "));
      fetch("/api/tickets/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchPayload),
      })
        .then(async (res) => {
          const elapsed = Math.round(performance.now() - tPatch);
          if (!res.ok) {
            let errBody = "";
            try { errBody = JSON.stringify(await res.json()); } catch { /* ignore */ }
            console.error(`[upload] ✗ PATCH FAILED — HTTP ${res.status} after ${elapsed}ms`, errBody);
          } else {
            console.log(`[upload] ✓ PATCH done in ${elapsed}ms — attachment URLs saved to Firestore`);
          }
        })
        .catch(err => console.warn("[upload] PATCH network error:", err));
    }

    setUploadState(p => {
      if (!p) return p;
      const failedCount = p.items.filter(it => it.status === "failed").length;
      return { ...p, allDone: true, failedCount };
    });
  }

  // ── Retry failed uploads ──────────────────────────────────────────────────
  function handleRetryUploads() {
    if (!uploadSnapshotRef.current || !uploadState) return;
    const { docId, screenshots: sc, voice, voiceDur, video } = uploadSnapshotRef.current;

    const scCount = sc.length;
    const voiceIdx = scCount;
    const videoIdx = scCount + (voice ? 1 : 0);

    const retryScreenshots: File[] = [];
    let retryVoice: Blob | null = null;
    let retryVideo: File | null = null;

    uploadState.items.forEach((item, i) => {
      if (item.status !== "failed") return;
      if (i < scCount) retryScreenshots.push(sc[i]);
      else if (i === voiceIdx && voice) retryVoice = voice;
      else if (i === videoIdx && video) retryVideo = video;
    });

    if (retryScreenshots.length || retryVoice || retryVideo) {
      backgroundUpload(docId, retryScreenshots, retryVoice, voiceDur, retryVideo);
    }
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate() || submitting) return;
    setSubmitting(true);

    const t0 = performance.now();
    console.log("[submit] ▶ Form submitted");

    try {
      doStop(); // Stop any in-progress recording

      setUploadMsg("Creating ticket…");

      // Snapshot files before async ops (state may change during await)
      const screenshotSnap = [...screenshots];
      const voiceBlobSnap = recState === "recorded" && voiceBlob ? voiceBlob : null;
      const voiceDurSnap = recTimeRef.current;
      const screenRecSnap = screenRec;

      console.log(`[submit] files: ${screenshotSnap.length} screenshots, voice: ${!!voiceBlobSnap}, video: ${!!screenRecSnap}`);

      // ── Step 1: Create ticket (no attachments) ──
      const tFetch = performance.now();
      const res = await fetch("/api/tickets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName: form.studentName.trim(),
          studentEmail: form.studentEmail.trim().toLowerCase(),
          whatsappNumber: form.whatsappNumber.trim().replace(/\s/g, ""),
          courseName: form.courseName,
          category: form.category as TicketCategory,
          description: form.description.trim(),
          studentUid: user?.uid ?? null,
          // Attachments are empty — uploaded in background after success
          screenshotUrl: null,
          attachments: [],
          voiceNoteUrl: null,
          voiceDuration: voiceDurSnap || null,
          screenRecordingUrl: null,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error((errJson as { error?: string }).error ?? `HTTP ${res.status}`);
      }

      const { id: docId, ticketId } = await res.json() as { id: string; ticketId: string };
      const creationMs = Math.round(performance.now() - tFetch);
      const totalMs = Math.round(performance.now() - t0);
      console.log(`[submit] ✅ Ticket created in ${creationMs}ms (total: ${totalMs}ms) — ${ticketId}`);

      // ── Step 2: Show success immediately ──
      setSubmitted(ticketId);
      setSubmittedDocId(docId);

      // Store snapshot for potential retry
      uploadSnapshotRef.current = {
        docId,
        screenshots: screenshotSnap,
        voice: voiceBlobSnap,
        voiceDur: voiceDurSnap,
        video: screenRecSnap,
      };

      // ── Step 3: Fire email asynchronously (non-blocking) ──
      fetch("/api/send-ticket-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "new_ticket",
          ticket: {
            ticketId, id: docId,
            studentName: form.studentName.trim(),
            studentEmail: form.studentEmail.trim().toLowerCase(),
            category: form.category,
            courseName: form.courseName,
            description: form.description.trim(),
          },
        }),
      }).catch(() => {});

      // ── Step 4: Upload attachments in background ──
      const hasAttachments = screenshotSnap.length > 0 || !!voiceBlobSnap || !!screenRecSnap;
      if (hasAttachments) {
        // Intentionally NOT awaited — runs fully in background
        backgroundUpload(docId, screenshotSnap, voiceBlobSnap, voiceDurSnap, screenRecSnap);
      }

    } catch (err) {
      console.error("[submit ticket]", err);
      alert(`Failed to submit ticket.\n\nError: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setSubmitting(false);
      setUploadMsg("");
    }
  }

  if (!isOpen) return null;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: "16px", overflowY: "auto",
      }}
    >
      <div
        style={{
          background: "rgba(8,20,48,0.99)",
          border: "1px solid rgba(255,98,0,0.25)",
          borderRadius: "24px",
          width: "100%", maxWidth: "580px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
          margin: "auto", position: "relative",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          padding: "22px 26px 18px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0,
          background: "rgba(8,20,48,0.99)", backdropFilter: "blur(12px)",
          borderRadius: "24px 24px 0 0", zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "12px",
              background: "linear-gradient(135deg,#FF6200,#FF8534)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0,
            }}>🛠️</div>
            <div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff" }}>
                Report Technical Issue
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                Our team responds within a few hours
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {user && (
              <Link
                href="/support"
                onClick={closeModal}
                style={{
                  padding: "6px 14px", borderRadius: "8px",
                  background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)",
                  color: "#60a5fa", fontSize: "12px", fontWeight: 600, textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                🎫 My Tickets
              </Link>
            )}
            <button
              onClick={closeModal}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "rgba(255,255,255,0.6)", cursor: "pointer",
                width: "36px", height: "36px", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: "18px", flexShrink: 0,
              }}
              aria-label="Close"
            >×</button>
          </div>
        </div>

        {/* ── Success Screen ── */}
        {submitted ? (
          <div style={{ padding: "36px 28px" }}>
            {/* Icon + heading */}
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{
                width: "72px", height: "72px", borderRadius: "50%",
                background: "rgba(52,211,153,0.15)", border: "2px solid rgba(52,211,153,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "32px", margin: "0 auto 16px",
              }}>✅</div>
              <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
                Ticket Submitted!
              </h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", margin: 0, lineHeight: "1.6" }}>
                Your issue has been received. Our team will respond shortly.
              </p>
            </div>

            {/* Ticket ID */}
            <div style={{
              background: "rgba(96,165,250,0.08)", border: "1px solid rgba(96,165,250,0.2)",
              borderRadius: "14px", padding: "16px 20px", marginBottom: "20px", textAlign: "center",
            }}>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>
                Ticket ID
              </div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#60a5fa", letterSpacing: "1px" }}>
                {submitted}
              </div>
            </div>

            {/* Upload progress panel */}
            {uploadState && uploadState.items.length > 0 && (
              <div style={{
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "14px", padding: "16px 18px", marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                  <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.6px" }}>
                    📎 Uploading Attachments
                  </div>
                  {uploadState.allDone && uploadState.failedCount === 0 && (
                    <span style={{ fontSize: "11px", color: "#34d399", fontWeight: 700 }}>All done ✓</span>
                  )}
                  {uploadState.allDone && uploadState.failedCount > 0 && (
                    <span style={{ fontSize: "11px", color: "#f87171", fontWeight: 700 }}>
                      {uploadState.failedCount} failed
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {uploadState.items.map((item, i) => (
                    <div key={i}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: item.status === "uploading" ? "5px" : 0 }}>
                        <span style={{ fontSize: "14px", lineHeight: 1, flexShrink: 0 }}>
                          {item.status === "done" ? "✅" : item.status === "failed" ? "❌" : item.status === "uploading" ? "⏳" : "⌛"}
                        </span>
                        <span style={{
                          fontSize: "13px",
                          color: item.status === "done" ? "rgba(255,255,255,0.7)"
                            : item.status === "failed" ? "#f87171"
                            : item.status === "uploading" ? "#fff"
                            : "rgba(255,255,255,0.4)",
                          fontWeight: item.status === "uploading" ? 600 : 400,
                        }}>
                          {item.label}
                        </span>
                        {item.status === "uploading" && item.progress > 0 && (
                          <span style={{ marginLeft: "auto", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                            {item.progress}%
                          </span>
                        )}
                      </div>
                      {/* Progress bar */}
                      {item.status === "uploading" && (
                        <div style={{ height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", borderRadius: "2px",
                            background: "linear-gradient(90deg,#FF6200,#FF8534)",
                            width: `${item.progress}%`,
                            transition: "width 0.3s ease",
                          }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Retry button */}
                {uploadState.allDone && uploadState.failedCount > 0 && (
                  <button
                    onClick={handleRetryUploads}
                    style={{
                      marginTop: "12px", width: "100%",
                      padding: "9px 16px", borderRadius: "10px",
                      background: "rgba(248,113,113,0.12)", border: "1px solid rgba(248,113,113,0.3)",
                      color: "#f87171", fontSize: "13px", fontWeight: 700, cursor: "pointer",
                      fontFamily: "Nunito, sans-serif",
                    }}
                  >
                    ↻ Retry {uploadState.failedCount} Failed Upload{uploadState.failedCount > 1 ? "s" : ""}
                  </button>
                )}

                {!uploadState.allDone && (
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", margin: "10px 0 0", textAlign: "center", lineHeight: "1.5" }}>
                    Ticket is already created. You can close this window — uploads continue in the background.
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/support"
                onClick={closeModal}
                style={{
                  padding: "11px 24px", borderRadius: "50px",
                  background: "linear-gradient(135deg,#FF6200,#FF8534)",
                  color: "#fff", textDecoration: "none", fontSize: "14px", fontWeight: 700,
                  boxShadow: "0 4px 16px rgba(255,98,0,0.35)",
                }}
              >
                🎫 View My Tickets
              </Link>
              <button
                onClick={closeModal}
                style={{
                  padding: "11px 24px", borderRadius: "50px",
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (

          /* ── Form ── */
          <form onSubmit={handleSubmit} noValidate style={{ padding: "22px 26px 26px" }}>

            {/* Basic fields grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "6px" }}>

              {/* Name */}
              <Field label={`Student Name${user ? " 🔒" : ""}`} error={errors.studentName}>
                <Input type="text" placeholder="Your full name"
                  value={form.studentName} onChange={set("studentName")}
                  hasError={!!errors.studentName} readOnly={!!user} locked={!!user} />
              </Field>

              {/* Email */}
              <Field label={`Email Address${user ? " 🔒" : ""}`} error={errors.studentEmail}>
                <Input type="email" placeholder="your@email.com"
                  value={form.studentEmail} onChange={set("studentEmail")}
                  hasError={!!errors.studentEmail} readOnly={!!user} locked={!!user} />
              </Field>

              {/* WhatsApp */}
              <Field label="WhatsApp Number" error={errors.whatsappNumber}>
                <Input type="tel" placeholder="10-digit mobile number"
                  value={form.whatsappNumber} onChange={set("whatsappNumber")}
                  hasError={!!errors.whatsappNumber} maxLength={10} />
              </Field>

              {/* Course */}
              <Field label="Course" error={errors.courseName}>
                <Select value={form.courseName} onChange={set("courseName")} hasError={!!errors.courseName}>
                  <option value="">Select course</option>
                  {COURSE_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>

              {/* Category — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Issue Category" error={errors.category as string}>
                  <Select value={form.category} onChange={set("category")} hasError={!!errors.category}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </Field>
              </div>

              {/* Description — full width */}
              <div style={{ gridColumn: "1 / -1" }}>
                <Field label="Issue Description" error={errors.description}>
                  <textarea
                    rows={4}
                    placeholder="Describe the issue — what happened, when it started, any error messages…"
                    value={form.description}
                    onChange={set("description")}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      background: "rgba(0,0,0,0.3)",
                      border: `1px solid ${errors.description ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}`,
                      borderRadius: "12px", padding: "12px 14px",
                      color: "#fff", fontSize: "14px", outline: "none",
                      fontFamily: "Nunito, sans-serif", lineHeight: "1.6", resize: "vertical",
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = errors.description ? "rgba(248,113,113,0.8)" : "rgba(255,133,52,0.6)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = errors.description ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"; }}
                  />
                </Field>
              </div>
            </div>

            {/* ── Attachments section ── */}
            <div style={{
              border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px",
              padding: "18px", marginTop: "8px", marginBottom: "18px",
              background: "rgba(255,255,255,0.02)",
            }}>
              <div style={{
                fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase",
                letterSpacing: "0.7px", marginBottom: "16px", fontFamily: "Nunito, sans-serif",
              }}>
                📎 Attachments <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(all optional · uploaded after ticket creation)</span>
              </div>

              {/* ── Screenshots ── */}
              <div style={{ marginBottom: "18px" }}>
                <div style={attachLabelStyle}>
                  📸 Screenshots
                  <span style={attachCountStyle}>{screenshots.length}/{MAX_SCREENSHOTS}</span>
                  <span style={attachHintStyle}>· JPG, PNG, WEBP · max {MAX_SCREENSHOT_MB} MB · auto-compressed</span>
                </div>

                {screenshotPreviews.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "10px" }}>
                    {screenshotPreviews.map((url, i) => (
                      <div key={i} style={{ position: "relative", flexShrink: 0 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={url} alt={`Screenshot ${i + 1}`}
                          style={{
                            width: "72px", height: "72px", objectFit: "cover",
                            borderRadius: "10px", border: "1px solid rgba(255,255,255,0.12)",
                            display: "block",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeScreenshot(i)}
                          style={{
                            position: "absolute", top: "-7px", right: "-7px",
                            width: "20px", height: "20px", borderRadius: "50%",
                            background: "#f87171", border: "2px solid rgba(8,20,48,0.9)",
                            color: "#fff", fontSize: "11px", fontWeight: 700,
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            lineHeight: 1,
                          }}
                          aria-label={`Remove screenshot ${i + 1}`}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}

                {screenshots.length < MAX_SCREENSHOTS && (
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button type="button" onClick={() => imgInputRef.current?.click()} style={ghostBtnStyle}>
                      + Add Photos
                    </button>
                    <button type="button" onClick={() => camInputRef.current?.click()} style={ghostBtnStyle}>
                      📷 Camera
                    </button>
                  </div>
                )}

                <input ref={imgInputRef} type="file" accept="image/*" multiple
                  style={{ display: "none" }} onChange={handleImagesSelect} />
                <input ref={camInputRef} type="file" accept="image/*"
                  capture="environment"
                  style={{ display: "none" }} onChange={handleImagesSelect} />
              </div>

              {/* ── Divider ── */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "18px" }} />

              {/* ── Voice Note ── */}
              <div style={{ marginBottom: "18px" }}>
                <div style={attachLabelStyle}>
                  🎙️ Voice Note
                  <span style={attachHintStyle}>· max {MAX_VOICE_SECONDS / 60} min</span>
                </div>

                {recState === "idle" && (
                  <button type="button" onClick={handleStartRecording} style={ghostBtnStyle}>
                    ● Record Voice Note
                  </button>
                )}

                {recState === "recording" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{
                      display: "inline-block", width: "10px", height: "10px",
                      borderRadius: "50%", background: "#f87171", flexShrink: 0,
                      animation: "vcPulse 1s ease-in-out infinite",
                    }} />
                    <span style={{ color: "#f87171", fontWeight: 700, fontSize: "15px", minWidth: "40px" }}>
                      {fmtTime(recTime)}
                    </span>
                    <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "12px" }}>/ {fmtTime(MAX_VOICE_SECONDS)}</span>
                    <button type="button" onClick={handleStopRecording} style={{
                      ...ghostBtnStyle,
                      background: "rgba(248,113,113,0.12)", borderColor: "rgba(248,113,113,0.3)",
                      color: "#f87171",
                    }}>
                      ■ Stop
                    </button>
                  </div>
                )}

                {recState === "recorded" && voiceBlobUrl && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <audio
                      controls
                      src={voiceBlobUrl}
                      style={{ flex: 1, minWidth: "180px", maxWidth: "100%", height: "36px" }}
                    />
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                      {fmtTime(recTimeRef.current)}
                    </span>
                    <button type="button" onClick={handleReRecord} style={{ ...ghostBtnStyle, color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
                      🗑️ Re-record
                    </button>
                  </div>
                )}
              </div>

              {/* ── Divider ── */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: "18px" }} />

              {/* ── Screen Recording ── */}
              <div>
                <div style={attachLabelStyle}>
                  📹 Screen Recording
                  <span style={attachHintStyle}>· .mp4 or .webm · max {MAX_SCREEN_REC_MB} MB</span>
                </div>

                {screenRec ? (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "10px", padding: "10px 14px",
                  }}>
                    <span style={{ fontSize: "20px" }}>🎬</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", color: "#fff", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {screenRec.name}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                        {(screenRec.size / (1024 * 1024)).toFixed(1)} MB
                      </div>
                    </div>
                    <button type="button" onClick={() => setScreenRec(null)}
                      style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>
                      ×
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => screenRecInputRef.current?.click()} style={ghostBtnStyle}>
                    📹 Upload Screen Recording
                  </button>
                )}

                <input
                  ref={screenRecInputRef}
                  type="file"
                  accept=".mp4,.webm,video/mp4,video/webm"
                  style={{ display: "none" }}
                  onChange={handleScreenRecSelect}
                />
              </div>
            </div>

            {/* ── Submit button ── */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                background: submitting ? "rgba(255,98,0,0.4)" : "linear-gradient(135deg,#FF6200,#FF8534)",
                border: "none", borderRadius: "14px", color: "#fff",
                fontSize: "15px", fontWeight: 700, padding: "14px",
                cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "Nunito, sans-serif",
                boxShadow: submitting ? "none" : "0 6px 20px rgba(255,98,0,0.4)",
                transition: "all 0.2s",
              }}
            >
              {uploadMsg || (submitting ? "Creating ticket…" : "Submit Ticket")}
            </button>

            {user && (
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <Link
                  href="/support"
                  onClick={closeModal}
                  style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none" }}
                >
                  🎫 View my existing tickets →
                </Link>
              </div>
            )}
          </form>
        )}
      </div>

      <style>{`
        @keyframes vcPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        @media (max-width: 520px) {
          audio { height: 32px; }
        }
      `}</style>
    </div>
  );
}

// ─── Style constants ─────────────────────────────────────────────────────────

const attachLabelStyle: React.CSSProperties = {
  fontSize: "13px", color: "rgba(255,255,255,0.65)", fontWeight: 600,
  marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px",
  flexWrap: "wrap",
};

const attachCountStyle: React.CSSProperties = {
  fontSize: "11px", color: "#FF8534", background: "rgba(255,133,52,0.12)",
  border: "1px solid rgba(255,133,52,0.25)", borderRadius: "20px",
  padding: "1px 7px", fontWeight: 700,
};

const attachHintStyle: React.CSSProperties = {
  fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: 400,
};

const ghostBtnStyle: React.CSSProperties = {
  padding: "8px 16px", borderRadius: "10px",
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
  color: "rgba(255,255,255,0.7)", fontSize: "13px", cursor: "pointer",
  fontFamily: "Nunito, sans-serif", whiteSpace: "nowrap",
  display: "inline-flex", alignItems: "center", gap: "6px",
};

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, error, children }: {
  label: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{
        display: "block", fontSize: "12px", color: "rgba(255,255,255,0.5)",
        textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: "8px",
        fontFamily: "Nunito, sans-serif",
      }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: "11px", color: "#f87171", marginTop: "5px" }}>{error}</div>}
    </div>
  );
}

function Input({
  hasError, locked, ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean; locked?: boolean }) {
  return (
    <input
      {...props}
      style={{
        width: "100%", boxSizing: "border-box",
        background: locked ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.3)",
        border: `1px solid ${hasError ? "rgba(248,113,113,0.6)" : locked ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "12px", padding: "11px 14px",
        color: locked ? "rgba(255,255,255,0.5)" : "#fff",
        fontSize: "14px", outline: "none",
        fontFamily: "Nunito, sans-serif",
        cursor: locked ? "default" : "text",
        transition: "border-color 0.2s",
      }}
      onFocus={e => {
        if (!locked) e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.8)" : "rgba(255,133,52,0.6)";
        props.onFocus?.(e);
      }}
      onBlur={e => {
        if (!locked) e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)";
        props.onBlur?.(e);
      }}
    />
  );
}

function Select({
  hasError, children, ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { hasError?: boolean }) {
  return (
    <select
      {...props}
      style={{
        width: "100%", boxSizing: "border-box",
        background: "rgba(0,0,0,0.5)",
        border: `1px solid ${hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"}`,
        borderRadius: "12px", padding: "11px 14px",
        color: "#fff", fontSize: "14px", outline: "none",
        fontFamily: "Nunito, sans-serif", cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,0.4)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
        paddingRight: "36px",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.8)" : "rgba(255,133,52,0.6)"; }}
      onBlur={e => { e.currentTarget.style.borderColor = hasError ? "rgba(248,113,113,0.6)" : "rgba(255,255,255,0.12)"; }}
    >
      {children}
    </select>
  );
}
