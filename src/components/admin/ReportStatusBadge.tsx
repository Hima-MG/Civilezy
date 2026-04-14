import type { ReportStatus } from "@/lib/admin/getReportedIssues";

const STATUS_MAP: Record<ReportStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: "Pending",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
  reviewed: { label: "Reviewed", color: "#3b82f6", bg: "rgba(59,130,246,0.12)" },
  resolved: { label: "Resolved", color: "#22c55e", bg: "rgba(34,197,94,0.12)" },
};

export default function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.pending;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.color}25`,
        whiteSpace: "nowrap",
      }}
    >
      {s.label}
    </span>
  );
}
