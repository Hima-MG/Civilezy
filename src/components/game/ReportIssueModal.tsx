"use client";

import { useState, useRef, useEffect } from "react";
import {
  reportGameArenaIssue,
  type IssueType,
} from "@/lib/reportGameArenaIssue";
import { useAuth } from "@/contexts/AuthContext";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface ReportIssueModalProps {
  questionId: string;
  questionText: string;
  selectedDomain: string;
  selectedDifficulty: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const ISSUE_OPTIONS: { value: IssueType; label: string }[] = [
  { value: "wrong_answer", label: "Wrong Answer" },
  { value: "typo", label: "Typo" },
  { value: "question_error", label: "Question Error" },
  { value: "ui_bug", label: "UI Bug" },
  { value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ReportIssueModal({
  questionId,
  questionText,
  selectedDomain,
  selectedDifficulty,
  onClose,
  onSubmitted,
}: ReportIssueModalProps) {
  const { user, profile } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [issueType, setIssueType] = useState<IssueType>("wrong_answer");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Open the dialog on mount
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }

    // Close on backdrop click
    const handleClick = (e: MouseEvent) => {
      if (e.target === dialog) onClose();
    };
    dialog?.addEventListener("click", handleClick);

    return () => {
      dialog?.removeEventListener("click", handleClick);
    };
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setError("");

    try {
      await reportGameArenaIssue({
        questionId,
        questionText,
        selectedDomain,
        selectedDifficulty,
        issueType,
        description: description.trim(),
        userName: profile?.displayName || user?.displayName || null,
        userId: user?.uid || null,
      });

      onSubmitted();
      onClose();
    } catch (err) {
      console.error("[ReportIssueModal] Submit failed:", err);
      const msg =
        err instanceof Error && err.message.includes("permission")
          ? "Permission denied. Firestore rules may need updating."
          : "Failed to submit report. Please try again.";
      setError(msg);
      setSubmitting(false);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={onClose}
      className="fixed inset-0 z-50 m-auto w-[90vw] max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900 p-0 text-white shadow-2xl shadow-black/50 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-[Rajdhani] text-lg font-bold text-white">
            Report Issue
          </h3>
          <button
            onClick={onClose}
            aria-label="Close report dialog"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            &times;
          </button>
        </div>

        {/* Question preview */}
        <div className="mb-4 rounded-xl border border-zinc-800 bg-zinc-800/50 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Question
          </p>
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-zinc-300">
            {questionText}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Issue type */}
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Issue Type
          </label>
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value as IssueType)}
            className="mb-4 w-full rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-orange-500"
          >
            {ISSUE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Description */}
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the issue..."
            maxLength={500}
            rows={3}
            className="mb-4 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-white placeholder-zinc-600 outline-none transition-colors focus:border-orange-500"
          />

          {/* Error message */}
          {error && (
            <p className="mb-3 text-sm font-medium text-rose-400">{error}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:shadow-orange-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </button>
        </form>
      </div>
    </dialog>
  );
}
