"use client";

import { useState, useEffect, useCallback } from "react";
import { Timestamp } from "firebase/firestore";
import {
  getAllCampaigns,
  addCampaign,
  updateCampaign,
  deleteCampaign,
} from "@/lib/campaigns";
import type { Campaign, CampaignInput, CampaignPlan } from "@/types/campaign";

// ─── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px", padding: "11px 14px", color: "#fff",
  fontSize: "14px", outline: "none", fontFamily: "Nunito, sans-serif",
};
const lbl: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "6px" };
const lblText: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)",
  letterSpacing: "0.06em", textTransform: "uppercase",
  fontFamily: "Rajdhani, sans-serif",
};
const btn = {
  primary: {
    background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff",
    border: "none", borderRadius: "10px", padding: "11px 22px",
    fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 16px rgba(255,98,0,0.3)",
  } as React.CSSProperties,
  secondary: {
    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "11px 22px",
    fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 600, cursor: "pointer",
  } as React.CSSProperties,
  small: {
    background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "13px",
    color: "rgba(255,255,255,0.7)", lineHeight: 1, fontFamily: "Nunito, sans-serif",
    fontWeight: 600,
  } as React.CSSProperties,
  danger: {
    background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "13px",
    color: "#ef4444", lineHeight: 1, fontFamily: "Nunito, sans-serif", fontWeight: 600,
  } as React.CSSProperties,
};

// ─── Empty plan ────────────────────────────────────────────────────────────────

function emptyPlan(): CampaignPlan {
  return {
    id: `plan_${Date.now()}`,
    title: "",
    originalPrice: 0,
    offerPrice: 0,
    couponCode: "",
    previewUrl: "",
    purchaseUrl: "",
    showPreview: false,
    badge: "",
    featured: false,
    order: 0,
  };
}

// ─── Toggle component ──────────────────────────────────────────────────────────

function Toggle({
  label, checked, onChange, color = "#22c55e",
}: {
  label: string; checked: boolean; onChange: () => void; color?: string;
}) {
  return (
    <div
      onClick={onChange}
      style={{
        display: "flex", alignItems: "center", gap: "10px", cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{
        width: "40px", height: "22px", borderRadius: "11px",
        background: checked ? color : "rgba(255,255,255,0.12)",
        position: "relative", transition: "background 0.25s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: "3px",
          left: checked ? "21px" : "3px",
          width: "16px", height: "16px", borderRadius: "50%",
          background: "#fff", transition: "left 0.25s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
      <span style={{ fontSize: "13px", color: checked ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

// ─── Plan editor ───────────────────────────────────────────────────────────────

function PlanEditor({
  plan, index, total,
  onChange, onDelete, onMoveUp, onMoveDown,
}: {
  plan: CampaignPlan;
  index: number;
  total: number;
  onChange: (updated: CampaignPlan) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const set = (key: keyof CampaignPlan, val: string | number | boolean) =>
    onChange({ ...plan, [key]: val });

  return (
    <div style={{
      background: plan.featured ? "rgba(255,184,0,0.06)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${plan.featured ? "rgba(255,184,0,0.3)" : "rgba(255,255,255,0.1)"}`,
      borderRadius: "14px", padding: "20px",
    }}>
      {/* Plan header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "16px", flexWrap: "wrap", gap: "8px",
      }}>
        <span style={{
          fontFamily: "Rajdhani, sans-serif", fontSize: "14px", fontWeight: 700,
          color: plan.featured ? "#FFB800" : "rgba(255,255,255,0.6)",
        }}>
          {plan.featured ? "⭐ " : ""}Plan {index + 1}{plan.title ? ` — ${plan.title}` : ""}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={onMoveUp} disabled={index === 0} style={{ ...btn.small, opacity: index === 0 ? 0.3 : 1 }} title="Move up">↑</button>
          <button onClick={onMoveDown} disabled={index === total - 1} style={{ ...btn.small, opacity: index === total - 1 ? 0.3 : 1 }} title="Move down">↓</button>
          <button onClick={onDelete} style={btn.danger} title="Remove plan">🗑️ Remove</button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "14px" }}>
        {/* Title + Badge */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <label style={lbl}>
            <span style={lblText}>Plan Title *</span>
            <input
              value={plan.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. B.Tech Level"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Badge</span>
            <input
              value={plan.badge ?? ""}
              onChange={(e) => set("badge", e.target.value)}
              placeholder="e.g. 1 Year Access"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Original Price + Offer Price */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <label style={lbl}>
            <span style={lblText}>Original Price (₹) *</span>
            <input
              type="number" min="0"
              value={plan.originalPrice || ""}
              onChange={(e) => set("originalPrice", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 20000"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Offer Price (₹) *</span>
            <input
              type="number" min="0"
              value={plan.offerPrice || ""}
              onChange={(e) => set("offerPrice", parseFloat(e.target.value) || 0)}
              placeholder="e.g. 10000"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Coupon Code */}
        <label style={lbl}>
          <span style={lblText}>Coupon Code</span>
          <input
            value={plan.couponCode ?? ""}
            onChange={(e) => set("couponCode", e.target.value.toUpperCase())}
            placeholder="e.g. BTECH50"
            style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.08em", maxWidth: "260px" }}
          />
        </label>

        {/* Purchase URL + Preview URL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <label style={lbl}>
            <span style={lblText}>Purchase URL</span>
            <input
              value={plan.purchaseUrl ?? ""}
              onChange={(e) => set("purchaseUrl", e.target.value)}
              placeholder="https://…"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Preview URL</span>
            <input
              value={plan.previewUrl ?? ""}
              onChange={(e) => set("previewUrl", e.target.value)}
              placeholder="https://…"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <Toggle
            label="Featured (Best Value)"
            checked={!!plan.featured}
            onChange={() => set("featured", !plan.featured)}
            color="#FFB800"
          />
          <Toggle
            label="Show Preview Button"
            checked={!!plan.showPreview}
            onChange={() => set("showPreview", !plan.showPreview)}
            color="#3b82f6"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Campaign form ─────────────────────────────────────────────────────────────

interface CampaignFormProps {
  initial: Campaign | null;
  onSave: (input: CampaignInput) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}

function CampaignForm({ initial, onSave, onCancel, saving }: CampaignFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "EARLY BIRD");
  const [bannerText, setBannerText] = useState(initial?.bannerText ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [theme, setTheme] = useState<Campaign["theme"]>(initial?.theme ?? "orange");
  const [backgroundStyle, setBackgroundStyle] = useState<Campaign["backgroundStyle"]>(initial?.backgroundStyle ?? "glass");
  const [enabled, setEnabled] = useState(initial?.enabled ?? true);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [expiryInput, setExpiryInput] = useState(
    initial?.expiryDate
      ? new Date((initial.expiryDate as Timestamp).toMillis()).toISOString().slice(0, 16)
      : ""
  );
  const [plans, setPlans] = useState<CampaignPlan[]>(
    initial?.plans?.length ? initial.plans : [emptyPlan()]
  );

  const addPlan = () => setPlans((p) => [...p, { ...emptyPlan(), order: p.length }]);

  const updatePlan = (idx: number, updated: CampaignPlan) =>
    setPlans((p) => p.map((pl, i) => (i === idx ? updated : pl)));

  const deletePlan = (idx: number) =>
    setPlans((p) => p.filter((_, i) => i !== idx).map((pl, i) => ({ ...pl, order: i })));

  const movePlan = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= plans.length) return;
    const arr = [...plans];
    [arr[idx], arr[next]] = [arr[next], arr[idx]];
    setPlans(arr.map((pl, i) => ({ ...pl, order: i })));
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required");
    if (plans.some((p) => !p.title.trim())) return alert("All plans need a title");

    const input: CampaignInput = {
      title: title.trim(),
      subtitle: subtitle.trim() || undefined,
      badge: badge.trim() || undefined,
      bannerText: bannerText.trim() || undefined,
      description: description.trim() || undefined,
      theme,
      backgroundStyle,
      enabled,
      featured,
      expiryDate: expiryInput ? Timestamp.fromDate(new Date(expiryInput)) : null,
      plans: plans.map((p, i) => ({ ...p, order: i })),
    };
    await onSave(input);
  };

  const THEMES: Campaign["theme"][] = ["orange", "red", "green", "blue", "purple", "gold"];
  const themeColors: Record<string, string> = {
    orange: "#FF6200", red: "#ef4444", green: "#22c55e",
    blue: "#3b82f6", purple: "#8b5cf6", gold: "#FFB800",
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: "18px", padding: "28px",
    }}>
      <h2 style={{
        fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700,
        color: "#fff", margin: "0 0 24px",
      }}>
        {initial ? "✏️ Edit Campaign" : "➕ New Campaign"}
      </h2>

      <div style={{ display: "grid", gap: "18px" }}>

        {/* Title */}
        <label style={lbl}>
          <span style={lblText}>Campaign Title *</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g. 🔥 Early Bird Offer – 50% OFF'
            style={inputStyle}
          />
        </label>

        {/* Subtitle + Description */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={lbl}>
            <span style={lblText}>Subtitle</span>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Get Kerala PSC books at half price"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Badge Label</span>
            <input
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
              placeholder="e.g. EARLY BIRD"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Banner Text */}
        <label style={lbl}>
          <span style={lblText}>Banner / Tagline</span>
          <input
            value={bannerText}
            onChange={(e) => setBannerText(e.target.value)}
            placeholder="e.g. 50% OFF"
            style={inputStyle}
          />
        </label>

        {/* Description */}
        <label style={lbl}>
          <span style={lblText}>Description (shown below subtitle)</span>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Limited offer for the first 100 students."
            style={inputStyle}
          />
        </label>

        {/* Expiry + Background */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={lbl}>
            <span style={lblText}>Expiry Date & Time</span>
            <input
              type="datetime-local"
              value={expiryInput}
              onChange={(e) => setExpiryInput(e.target.value)}
              style={{ ...inputStyle, colorScheme: "dark" }}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Background Style</span>
            <select
              value={backgroundStyle}
              onChange={(e) => setBackgroundStyle(e.target.value as Campaign["backgroundStyle"])}
              style={inputStyle}
            >
              <option value="glass">Glassmorphism</option>
              <option value="gradient">Gradient</option>
              <option value="solid">Solid</option>
            </select>
          </label>
        </div>

        {/* Theme color picker */}
        <div style={lbl}>
          <span style={lblText}>Theme Color</span>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {THEMES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                style={{
                  padding: "8px 18px", borderRadius: "20px", cursor: "pointer",
                  border: `2px solid ${theme === t ? themeColors[t!] : "transparent"}`,
                  background: theme === t ? `${themeColors[t!]}22` : "rgba(255,255,255,0.06)",
                  color: theme === t ? themeColors[t!] : "rgba(255,255,255,0.5)",
                  fontSize: "13px", fontWeight: 700, fontFamily: "Nunito, sans-serif",
                  textTransform: "capitalize", transition: "all 0.2s",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Status toggles */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Toggle label="Enabled (live on site)" checked={enabled} onChange={() => setEnabled((v) => !v)} color="#22c55e" />
          <Toggle label="Featured" checked={featured} onChange={() => setFeatured((v) => !v)} color="#FFB800" />
        </div>

        {/* ── Plans section ── */}
        <div style={{
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px", padding: "20px",
          background: "rgba(0,0,0,0.2)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "20px", flexWrap: "wrap", gap: "12px",
          }}>
            <div>
              <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                📦 Plans ({plans.length})
              </div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>
                Each plan appears as a card on the website. Mark one as Featured for Best Value.
              </div>
            </div>
            <button onClick={addPlan} style={btn.primary}>+ Add Plan</button>
          </div>

          {plans.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "40px 20px",
              color: "rgba(255,255,255,0.3)", fontSize: "14px",
            }}>
              No plans yet. Click <strong style={{ color: "#FF8534" }}>+ Add Plan</strong> to start.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {plans.map((plan, idx) => (
                <PlanEditor
                  key={plan.id}
                  plan={plan}
                  index={idx}
                  total={plans.length}
                  onChange={(updated) => updatePlan(idx, updated)}
                  onDelete={() => deletePlan(idx)}
                  onMoveUp={() => movePlan(idx, -1)}
                  onMoveDown={() => movePlan(idx, 1)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px", flexWrap: "wrap" }}>
          <button onClick={handleSubmit} disabled={saving} style={{ ...btn.primary, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Saving…" : initial ? "Update Campaign" : "Create Campaign"}
          </button>
          <button onClick={onCancel} style={btn.secondary}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ─── Campaign row ──────────────────────────────────────────────────────────────

function CampaignRow({
  campaign,
  onEdit,
  onDelete,
  onToggleEnabled,
  onToggleFeatured,
}: {
  campaign: Campaign;
  onEdit: () => void;
  onDelete: () => void;
  onToggleEnabled: () => void;
  onToggleFeatured: () => void;
}) {
  const hasExpiry = !!campaign.expiryDate;
  const isExpired =
    hasExpiry &&
    typeof (campaign.expiryDate as Timestamp).toMillis === "function" &&
    (campaign.expiryDate as Timestamp).toMillis() < Date.now();

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px", padding: "16px 18px",
      display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap",
      borderLeft: `3px solid ${campaign.enabled ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
    }}>
      {/* Info */}
      <div style={{ flex: 1, minWidth: "220px" }}>
        <div style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>
          {campaign.title}
        </div>
        {campaign.subtitle && (
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "3px" }}>
            {campaign.subtitle}
          </div>
        )}
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "4px" }}>
          {campaign.plans?.length ?? 0} plans
          {hasExpiry && (
            <span style={{ marginLeft: "8px", color: isExpired ? "#f59e0b" : "rgba(255,255,255,0.25)" }}>
              · {isExpired ? "⚠️ Expired" : "⏳ Has expiry"}
            </span>
          )}
        </div>
      </div>

      {/* Status badges */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
          background: campaign.enabled ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
          color: campaign.enabled ? "#22c55e" : "rgba(255,255,255,0.3)",
          border: `1px solid ${campaign.enabled ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)"}`,
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
        }}>
          {campaign.enabled ? "LIVE" : "DISABLED"}
        </span>
        {campaign.featured && (
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
            background: "rgba(255,184,0,0.12)", color: "#FFB800",
            border: "1px solid rgba(255,184,0,0.25)",
            fontFamily: "Rajdhani, sans-serif",
          }}>
            ⭐ FEATURED
          </span>
        )}
        {campaign.theme && (
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            fontFamily: "Rajdhani, sans-serif", textTransform: "capitalize",
          }}>
            {campaign.theme}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        <button onClick={onEdit} style={btn.small} title="Edit">✏️ Edit</button>
        <button
          onClick={onToggleEnabled}
          style={{ ...btn.small, color: campaign.enabled ? "#f59e0b" : "#22c55e" }}
          title={campaign.enabled ? "Disable" : "Enable"}
        >
          {campaign.enabled ? "⏸ Disable" : "▶️ Enable"}
        </button>
        <button
          onClick={onToggleFeatured}
          style={{ ...btn.small, color: campaign.featured ? "#FFB800" : "rgba(255,255,255,0.5)" }}
          title="Toggle featured"
        >
          ⭐
        </button>
        <button onClick={onDelete} style={btn.danger} title="Delete">🗑️</button>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function AdminOfferCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "form">("list");
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3_500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try { setCampaigns(await getAllCampaigns()); }
    catch { flash("❌ Failed to load campaigns"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleSave = async (input: CampaignInput) => {
    setSaving(true);
    try {
      if (editing) {
        await updateCampaign(editing.id, input);
        flash("✅ Campaign updated");
      } else {
        await addCampaign(input);
        flash("✅ Campaign created");
      }
      setEditing(null);
      setTab("list");
      await fetchAll();
    } catch (err) {
      console.error(err);
      flash("❌ Save failed — check console");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCampaign(deleteId);
      setDeleteId(null);
      flash("🗑️ Campaign deleted");
      await fetchAll();
    } catch {
      flash("❌ Delete failed");
    }
  };

  const handleToggle = async (campaign: Campaign, field: "enabled" | "featured") => {
    try {
      await updateCampaign(campaign.id, { [field]: !campaign[field] });
      flash(`✅ ${field === "enabled" ? "Status" : "Featured"} updated`);
      await fetchAll();
    } catch {
      flash("❌ Toggle failed");
    }
  };

  const liveCount = campaigns.filter((c) => c.enabled).length;
  const totalPlans = campaigns.reduce((s, c) => s + (c.plans?.length ?? 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#060D1A", padding: "28px 24px", fontFamily: "Nunito, sans-serif" }}>

      {/* Flash toast */}
      {message && (
        <div style={{
          position: "fixed", top: "70px", right: "24px", zIndex: 9999,
          background: "rgba(11,30,61,0.96)", border: "1px solid rgba(255,98,0,0.4)",
          borderRadius: "12px", padding: "12px 20px", color: "#fff",
          fontSize: "14px", fontWeight: 600, backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {message}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginBottom: "24px", gap: "16px", flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>
            🏷️ Offer Campaigns
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "4px 0 0" }}>
            Create and manage Early Bird, Flash Sale, Bundle and Festival campaigns
          </p>
        </div>
        <button onClick={() => { setEditing(null); setTab("form"); }} style={btn.primary}>
          + New Campaign
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Total",    value: campaigns.length, color: "rgba(255,255,255,0.7)" },
          { label: "Live",     value: liveCount,         color: "#22c55e" },
          { label: "Disabled", value: campaigns.length - liveCount, color: "rgba(255,255,255,0.3)" },
          { label: "Plans",    value: totalPlans,         color: "#FF8534" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "12px 20px", minWidth: "90px",
          }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color, fontFamily: "Rajdhani, sans-serif" }}>{value}</div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {(["list", "form"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { if (t === "list") { setEditing(null); } setTab(t); }}
            style={{
              padding: "8px 18px", borderRadius: "10px", cursor: "pointer",
              fontFamily: "Nunito, sans-serif", fontSize: "13px", fontWeight: 700,
              background: tab === t ? "rgba(255,98,0,0.2)" : "rgba(255,255,255,0.05)",
              color: tab === t ? "#FF8534" : "rgba(255,255,255,0.5)",
              border: `1px solid ${tab === t ? "rgba(255,98,0,0.35)" : "transparent"}`,
              transition: "all 0.2s",
            }}
          >
            {t === "list"
              ? `📋 All (${campaigns.length})`
              : editing ? "✏️ Edit" : "➕ New"}
          </button>
        ))}
      </div>

      {/* ══ LIST ══ */}
      {tab === "list" && (
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", color: "rgba(255,255,255,0.35)", fontSize: "14px" }}>
              Loading…
            </div>
          ) : campaigns.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", color: "rgba(255,255,255,0.35)", fontSize: "14px",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏷️</div>
              No campaigns yet.{" "}
              <span
                style={{ color: "#FF8534", cursor: "pointer", fontWeight: 700 }}
                onClick={() => { setEditing(null); setTab("form"); }}
              >
                Create one →
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {campaigns.map((c) => (
                <CampaignRow
                  key={c.id}
                  campaign={c}
                  onEdit={() => { setEditing(c); setTab("form"); }}
                  onDelete={() => setDeleteId(c.id)}
                  onToggleEnabled={() => handleToggle(c, "enabled")}
                  onToggleFeatured={() => handleToggle(c, "featured")}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ FORM ══ */}
      {tab === "form" && (
        <CampaignForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => { setEditing(null); setTab("list"); }}
          saving={saving}
        />
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{
            background: "#0B1E3D", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px", padding: "32px 28px",
            maxWidth: "360px", width: "100%", textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px" }}>
              Delete Campaign?
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>
              This will permanently remove the campaign and all its plans.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} style={{ ...btn.secondary, flex: 1 }}>Cancel</button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1, background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff", border: "none", borderRadius: "10px", padding: "10px",
                  fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
