"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

// ── Constants ─────────────────────────────────────────────────────────────────

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);
const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

// ── Types ─────────────────────────────────────────────────────────────────────

type UploadStatus =
  | { tag: "idle" }
  | { tag: "uploading"; progress: number; fileName: string; fileSizeMB: string }
  | { tag: "error"; message: string }
  | { tag: "done"; fileName: string };

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  /** Current cover URL (empty string when none). Controlled by parent. */
  value: string;
  /** Called with the Firebase Storage download URL after a successful upload. */
  onChange: (url: string) => void;
  /** Used to derive the storage path: ebooks/covers/{slug}.{ext} */
  slug: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CoverImageUpload({ value, onChange, slug }: Props) {
  const [status, setStatus] = useState<UploadStatus>({ tag: "idle" });
  const [dragActive, setDragActive] = useState(false);
  // Tracks drag-enter depth so child hover doesn't flicker the indicator
  const dragDepth = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // When a parent edit loads an existing coverImage, reset status to idle
  // so the preview is shown, not the drop zone.
  useEffect(() => {
    if (value && status.tag === "idle") return; // nothing to reset
    if (value && status.tag === "error") setStatus({ tag: "idle" });
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core upload logic ──

  const upload = useCallback(
    (file: File) => {
      // Type validation
      if (!ALLOWED_MIME.has(file.type)) {
        setStatus({
          tag: "error",
          message: `Unsupported file type (${file.type || "unknown"}). Use JPG, PNG or WebP.`,
        });
        return;
      }

      // Size validation
      if (file.size > MAX_BYTES) {
        const mb = (file.size / 1024 / 1024).toFixed(1);
        setStatus({
          tag: "error",
          message: `File is ${mb} MB — exceeds the 5 MB limit.`,
        });
        return;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const safeslug = slug.trim() || `ebook-${Date.now()}`;
      const storagePath = `ebooks/covers/${safeslug}.${ext}`;
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(1);

      setStatus({
        tag: "uploading",
        progress: 0,
        fileName: file.name,
        fileSizeMB,
      });

      const task = uploadBytesResumable(ref(storage, storagePath), file, {
        contentType: file.type,
      });

      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setStatus((prev) =>
            prev.tag === "uploading" ? { ...prev, progress: pct } : prev
          );
        },
        (err) => {
          console.error("[CoverImageUpload] upload error:", err);
          setStatus({
            tag: "error",
            message:
              err.code === "storage/unauthorized"
                ? "Permission denied — update Firebase Storage rules to allow writes to ebooks/covers/."
                : "Upload failed. Check your connection and try again.",
          });
        },
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            onChange(url);
            setStatus({ tag: "done", fileName: file.name });
          } catch {
            setStatus({ tag: "error", message: "Upload completed but URL retrieval failed." });
          }
        }
      );
    },
    [slug, onChange]
  );

  // ── Event handlers ──

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = ""; // reset so same file can be re-selected
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    if (dragDepth.current === 1) setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // required to allow drop
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const openPicker = () => fileInputRef.current?.click();

  const handleReplace = () => {
    setStatus({ tag: "idle" });
    // Small timeout so the input isn't clicked while React is re-rendering
    setTimeout(openPicker, 50);
  };

  // ── Derived booleans ──

  const isUploading = status.tag === "uploading";
  const hasImage = !!value && !isUploading;
  const showDropZone = !hasImage;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "Nunito, sans-serif" }}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXT.join(",")}
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-label="Upload cover image"
      />

      {/* ── Preview state ── */}
      {hasImage && (
        <PreviewPanel
          url={value}
          fileName={status.tag === "done" ? status.fileName : undefined}
          onReplace={handleReplace}
        />
      )}

      {/* ── Upload progress ── */}
      {isUploading && status.tag === "uploading" && (
        <ProgressPanel
          fileName={status.fileName}
          fileSizeMB={status.fileSizeMB}
          progress={status.progress}
        />
      )}

      {/* ── Drop zone (idle + error) ── */}
      {showDropZone && (
        <>
          {status.tag === "error" && (
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              marginBottom: "8px",
              padding: "10px 14px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: "10px",
              color: "#f87171",
              fontSize: "13px",
            }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{status.message}</span>
            </div>
          )}

          <DropZone
            dragActive={dragActive}
            hasError={status.tag === "error"}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openPicker}
          />
        </>
      )}
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function DropZone({
  dragActive,
  hasError,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onClick,
}: {
  dragActive: boolean;
  hasError: boolean;
  onDragEnter: React.DragEventHandler;
  onDragLeave: React.DragEventHandler;
  onDragOver: React.DragEventHandler;
  onDrop: React.DragEventHandler;
  onClick: () => void;
}) {
  const borderColor = dragActive
    ? "rgba(255,98,0,0.7)"
    : hasError
    ? "rgba(239,68,68,0.4)"
    : "rgba(255,255,255,0.12)";

  const bg = dragActive
    ? "rgba(255,98,0,0.08)"
    : hasError
    ? "rgba(239,68,68,0.05)"
    : "rgba(255,255,255,0.02)";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload cover image"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "32px 24px",
        border: `2px dashed ${borderColor}`,
        borderRadius: "14px",
        background: bg,
        cursor: "pointer",
        transition: "all 0.2s ease",
        userSelect: "none",
        outline: "none",
      }}
    >
      {/* Icon */}
      <div style={{
        width: "52px", height: "52px",
        borderRadius: "14px",
        background: dragActive
          ? "rgba(255,98,0,0.2)"
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${dragActive ? "rgba(255,98,0,0.35)" : "rgba(255,255,255,0.1)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "22px",
        transition: "all 0.2s",
        transform: dragActive ? "scale(1.1)" : "scale(1)",
      }}>
        {dragActive ? "⬇️" : "🖼️"}
      </div>

      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontSize: "14px", fontWeight: 700,
          color: dragActive ? "#FF8534" : "rgba(255,255,255,0.75)",
          marginBottom: "4px",
          transition: "color 0.2s",
        }}>
          {dragActive ? "Drop to upload" : "Drag & drop your cover image"}
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
          or{" "}
          <span style={{
            color: "#FF8534", fontWeight: 700,
            textDecoration: "underline", textUnderlineOffset: "2px",
          }}>
            browse files
          </span>
        </div>
      </div>

      {/* Format hint */}
      <div style={{
        display: "flex", alignItems: "center", gap: "6px",
        padding: "4px 12px",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
      }}>
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
          JPG · PNG · WebP
        </span>
        <span style={{ width: "1px", height: "10px", background: "rgba(255,255,255,0.12)" }} />
        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>
          Max 5 MB
        </span>
      </div>
    </div>
  );
}

function ProgressPanel({
  fileName,
  fileSizeMB,
  progress,
}: {
  fileName: string;
  fileSizeMB: string;
  progress: number;
}) {
  return (
    <div style={{
      padding: "20px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,98,0,0.2)",
      borderRadius: "14px",
    }}>
      {/* File info row */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: "12px", marginBottom: "16px",
      }}>
        {/* Spinning icon */}
        <div style={{
          width: "40px", height: "40px", flexShrink: 0,
          borderRadius: "10px",
          background: "rgba(255,98,0,0.12)",
          border: "1px solid rgba(255,98,0,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "18px",
        }}>
          🖼️
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: "13px", fontWeight: 700, color: "#fff",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {fileName}
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
            {fileSizeMB} MB · Uploading…
          </div>
        </div>

        <div style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "18px", fontWeight: 700,
          color: "#FF8534", flexShrink: 0,
        }}>
          {progress}%
        </div>
      </div>

      {/* Progress bar track */}
      <div style={{
        height: "6px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: "3px",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Fill */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: `${progress}%`,
          background: "linear-gradient(90deg, #FF6200, #FF8534)",
          borderRadius: "3px",
          transition: "width 0.15s ease",
          boxShadow: "0 0 8px rgba(255,98,0,0.5)",
        }} />

        {/* Shimmer overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s linear infinite",
        }} />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
      `}</style>
    </div>
  );
}

function PreviewPanel({
  url,
  fileName,
  onReplace,
}: {
  url: string;
  fileName?: string;
  onReplace: () => void;
}) {
  const [imgErr, setImgErr] = useState(false);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "16px",
      padding: "16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(34,197,94,0.2)",
      borderRadius: "14px",
    }}>
      {/* Thumbnail */}
      <div style={{
        width: "72px", height: "96px",
        flexShrink: 0, borderRadius: "8px",
        overflow: "hidden", position: "relative",
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}>
        {!imgErr ? (
          <Image
            src={url}
            alt="Cover preview"
            fill
            sizes="72px"
            style={{ objectFit: "cover" }}
            onError={() => setImgErr(true)}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "24px",
          }}>
            📖
          </div>
        )}
      </div>

      {/* Info + actions */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Status badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "3px 10px",
          background: "rgba(34,197,94,0.12)",
          border: "1px solid rgba(34,197,94,0.25)",
          borderRadius: "20px",
          marginBottom: "8px",
        }}>
          <span style={{ fontSize: "10px" }}>✓</span>
          <span style={{
            fontSize: "10px", fontWeight: 700,
            color: "#22c55e",
            fontFamily: "Rajdhani, sans-serif",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            Image Uploaded
          </span>
        </div>

        {/* File name if known */}
        {fileName && (
          <div style={{
            fontSize: "12px", color: "rgba(255,255,255,0.5)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            marginBottom: "12px",
          }}>
            {fileName}
          </div>
        )}

        {/* Replace button */}
        <button
          onClick={onReplace}
          type="button"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "7px 14px",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: "8px",
            color: "rgba(255,255,255,0.7)",
            fontSize: "12px", fontWeight: 700,
            fontFamily: "Nunito, sans-serif",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: "11px" }}>🔄</span> Replace Image
        </button>
      </div>
    </div>
  );
}
