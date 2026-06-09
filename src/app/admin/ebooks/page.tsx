"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Timestamp } from "firebase/firestore";
import {
  getAllEbooks,
  addEbook,
  updateEbook,
  deleteEbook,
} from "@/lib/ebooks";
import type { Ebook, EbookInput, Promotion } from "@/types/ebook";
import CoverImageUpload from "@/components/admin/CoverImageUpload";

// ── Shared styles ─────────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(0,0,0,0.35)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: "10px",
  padding: "11px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  fontFamily: "Nunito, sans-serif",
};

const lbl: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "6px" };
const lblText: React.CSSProperties = {
  fontSize: "11px", fontWeight: 700,
  color: "rgba(255,255,255,0.5)",
  letterSpacing: "0.06em", textTransform: "uppercase",
  fontFamily: "Rajdhani, sans-serif",
};

const btn = {
  primary: {
    background: "linear-gradient(135deg,#FF6200,#FF8534)",
    color: "#fff", border: "none", borderRadius: "10px",
    padding: "11px 22px", fontFamily: "Nunito, sans-serif",
    fontSize: "14px", fontWeight: 700, cursor: "pointer",
    boxShadow: "0 4px 16px rgba(255,98,0,0.3)",
  } as React.CSSProperties,
  secondary: {
    background: "rgba(255,255,255,0.07)",
    color: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", padding: "11px 22px",
    fontFamily: "Nunito, sans-serif", fontSize: "14px",
    fontWeight: 600, cursor: "pointer",
  } as React.CSSProperties,
  icon: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px", padding: "6px 9px",
    cursor: "pointer", fontSize: "14px",
    color: "rgba(255,255,255,0.7)", lineHeight: 1,
  } as React.CSSProperties,
};

// ── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  title: string;
  slug: string;
  exam: string;
  level: string;
  description: string;
  coverImage: string;
  price: string;
  validityDate: string;
  previewUrl: string;
  purchaseUrl: string;
  featuresInput: string;
  modulesInput: string;
  features: string[];
  modules: string[];
  featured: boolean;
  published: boolean;
  productCategory: "single" | "bundle" | "ultimate";
  // promotion
  promoEnabled: boolean;
  promoOfferType: "discount" | "launch" | "bundle" | "limited";
  promoBadgeText: string;
  promoBannerText: string;
  promoOriginalPrice: string;
  promoOfferPrice: string;
  promoCouponCode: string;
  promoCouponEnabled: boolean;
  promoExpiryDate: string;
  promoFeatured: boolean;
  promoShowCountdown: boolean;
  promoShowBanner: boolean;
  promoBannerColor: "orange" | "red" | "green" | "purple";
  promoDiscountPercentage: string;
}

const EMPTY_FORM: FormState = {
  title: "", slug: "", exam: "", level: "",
  description: "", coverImage: "",
  price: "", validityDate: "", previewUrl: "", purchaseUrl: "",
  featuresInput: "", modulesInput: "",
  features: [], modules: [],
  featured: false, published: true,
  productCategory: "single",
  promoEnabled: false,
  promoOfferType: "discount",
  promoBadgeText: "",
  promoBannerText: "",
  promoOriginalPrice: "",
  promoOfferPrice: "",
  promoCouponCode: "",
  promoCouponEnabled: false,
  promoExpiryDate: "",
  promoFeatured: false,
  promoShowCountdown: false,
  promoShowBanner: false,
  promoBannerColor: "orange",
  promoDiscountPercentage: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function promoFromEbook(p: Promotion | undefined): Partial<FormState> {
  if (!p) return {};
  return {
    promoEnabled: p.enabled ?? false,
    promoOfferType: p.offerType ?? "discount",
    promoBadgeText: p.badgeText ?? "",
    promoBannerText: p.bannerText ?? "",
    promoOriginalPrice: p.originalPrice ? String(p.originalPrice) : "",
    promoOfferPrice: p.offerPrice ? String(p.offerPrice) : "",
    promoCouponCode: p.couponCode ?? "",
    promoCouponEnabled: p.couponEnabled ?? false,
    promoExpiryDate: p.expiryDate
      ? new Date(p.expiryDate.toMillis()).toISOString().slice(0, 16)
      : "",
    promoFeatured: p.featured ?? false,
    promoShowCountdown: p.showCountdown ?? false,
    promoShowBanner: p.showBanner ?? false,
    promoBannerColor: p.bannerColor ?? "orange",
    promoDiscountPercentage: p.discountPercentage ? String(p.discountPercentage) : "",
  };
}

function buildPromotion(form: FormState): Promotion {
  return {
    enabled: form.promoEnabled,
    offerType: form.promoOfferType,
    badgeText: form.promoBadgeText.trim(),
    bannerText: form.promoBannerText.trim(),
    originalPrice: parseFloat(form.promoOriginalPrice) || 0,
    offerPrice: parseFloat(form.promoOfferPrice) || 0,
    couponCode: form.promoCouponCode.trim().toUpperCase(),
    couponEnabled: form.promoCouponEnabled,
    expiryDate: form.promoExpiryDate
      ? Timestamp.fromDate(new Date(form.promoExpiryDate))
      : null,
    featured: form.promoFeatured,
    showCountdown: form.promoShowCountdown,
    showBanner: form.promoShowBanner,
    bannerColor: form.promoBannerColor,
    discountPercentage: parseFloat(form.promoDiscountPercentage) || 0,
  };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [slugManual, setSlugManual] = useState(false);

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      setEbooks(await getAllEbooks());
    } catch {
      flash("❌ Failed to load e-books");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  useEffect(() => {
    if (!slugManual && form.title) {
      setForm((f) => ({ ...f, slug: slugify(f.title) }));
    }
  }, [form.title, slugManual]);

  const set = (key: keyof FormState, val: string | boolean | string[]) => {
    setForm((f) => ({ ...f, [key]: val }));
  };

  // ── Tag inputs ──

  const addTag = (field: "features" | "modules", inputField: "featuresInput" | "modulesInput") => {
    const raw = form[inputField].trim().replace(/,+$/, "");
    if (!raw) return;
    const newTags = raw.split(",").map((t) => t.trim()).filter(Boolean);
    setForm((f) => ({
      ...f,
      [field]: [...f[field], ...newTags],
      [inputField]: "",
    }));
  };

  const removeTag = (field: "features" | "modules", idx: number) => {
    setForm((f) => ({ ...f, [field]: f[field].filter((_, i) => i !== idx) }));
  };

  // ── Save ──

  const handleSave = async () => {
    if (!form.title.trim()) return flash("❌ Title is required");
    if (!form.slug.trim()) return flash("❌ Slug is required");
    if (!form.exam.trim()) return flash("❌ Exam name is required");
    if (!form.level.trim()) return flash("❌ Level is required");
    const price = parseFloat(form.price);
    if (isNaN(price) || price < 0) return flash("❌ Valid price is required");

    setSaving(true);
    try {
      const input: EbookInput = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        exam: form.exam.trim(),
        level: form.level.trim(),
        description: form.description.trim(),
        coverImage: form.coverImage.trim(),
        price,
        validityDate: form.validityDate.trim(),
        previewUrl: form.previewUrl.trim(),
        purchaseUrl: form.purchaseUrl.trim(),
        features: form.features,
        modules: form.modules,
        featured: form.featured,
        published: form.published,
        productCategory: form.productCategory,
        promotion: buildPromotion(form),
      };

      if (editingId) {
        await updateEbook(editingId, input);
        flash("✅ E-book updated");
      } else {
        await addEbook(input);
        flash("✅ E-book added");
      }
      resetForm();
      setTab("list");
      await fetchAll();
    } catch (err) {
      flash("❌ Save failed — check console");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (ebook: Ebook) => {
    setSlugManual(true);
    setForm({
      ...EMPTY_FORM,
      title: ebook.title,
      slug: ebook.slug,
      exam: ebook.exam,
      level: ebook.level,
      description: ebook.description ?? "",
      coverImage: ebook.coverImage ?? "",
      price: String(ebook.price),
      validityDate: ebook.validityDate ?? "",
      previewUrl: ebook.previewUrl ?? "",
      purchaseUrl: ebook.purchaseUrl ?? "",
      featuresInput: "",
      modulesInput: "",
      features: ebook.features ?? [],
      modules: ebook.modules ?? [],
      featured: ebook.featured,
      published: ebook.published,
      productCategory: ebook.productCategory ?? "single",
      ...promoFromEbook(ebook.promotion),
    });
    setEditingId(ebook.id);
    setTab("form");
  };

  const handleToggle = async (ebook: Ebook, field: "featured" | "published") => {
    try {
      await updateEbook(ebook.id, { [field]: !ebook[field] });
      flash(`✅ ${field === "featured" ? "Featured" : "Published"} toggled`);
      await fetchAll();
    } catch {
      flash("❌ Toggle failed");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteEbook(deleteId);
      setDeleteId(null);
      flash("🗑️ E-book deleted");
      await fetchAll();
    } catch {
      flash("❌ Delete failed");
    }
  };

  const handleCoverDeleted = useCallback(async () => {
    if (!editingId) return;
    try {
      await updateEbook(editingId, { coverImage: "" });
      flash("🗑️ Cover image removed");
    } catch {
      flash("❌ Failed to clear cover in Firestore");
    }
  }, [editingId]);

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
    setSlugManual(false);
  };

  const publishedCount = ebooks.filter((e) => e.published).length;
  const featuredCount = ebooks.filter((e) => e.featured).length;
  const promoCount = ebooks.filter((e) => e.promotion?.enabled).length;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#060D1A",
      padding: "28px 24px", fontFamily: "Nunito, sans-serif",
    }}>

      {/* Flash */}
      {message && (
        <div style={{
          position: "fixed", top: "70px", right: "24px", zIndex: 9999,
          background: "rgba(11,30,61,0.96)",
          border: "1px solid rgba(255,98,0,0.4)",
          borderRadius: "12px", padding: "12px 20px",
          color: "#fff", fontSize: "14px", fontWeight: 600,
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        }}>
          {message}
        </div>
      )}

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "24px", gap: "16px", flexWrap: "wrap",
      }}>
        <div>
          <h1 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0,
          }}>
            📚 E-Book Manager
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "13px", margin: "4px 0 0" }}>
            Add, edit, and manage e-books in the marketplace
          </p>
        </div>
        <button onClick={() => { resetForm(); setTab("form"); }} style={btn.primary}>
          + Add E-Book
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { label: "Total",     value: ebooks.length,    color: "rgba(255,255,255,0.7)" },
          { label: "Published", value: publishedCount,   color: "#22c55e" },
          { label: "Featured",  value: featuredCount,    color: "#FFB800" },
          { label: "On Promo",  value: promoCount,       color: "#FF6200" },
          { label: "Drafts",    value: ebooks.length - publishedCount, color: "rgba(255,255,255,0.3)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "12px", padding: "12px 20px", minWidth: "90px",
          }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color, fontFamily: "Rajdhani, sans-serif" }}>
              {value}
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px" }}>
        {(["list", "form"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { if (t === "list") resetForm(); setTab(t); }}
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
              ? `📋 All E-Books (${ebooks.length})`
              : editingId ? "✏️ Edit E-Book" : "➕ Add New"}
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
          ) : ebooks.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "16px", color: "rgba(255,255,255,0.35)", fontSize: "14px",
            }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>📭</div>
              No e-books yet.{" "}
              <span
                style={{ color: "#FF8534", cursor: "pointer", fontWeight: 700 }}
                onClick={() => { resetForm(); setTab("form"); }}
              >
                Add one →
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {ebooks.map((ebook) => (
                <EbookRow
                  key={ebook.id}
                  ebook={ebook}
                  onEdit={() => startEdit(ebook)}
                  onDelete={() => setDeleteId(ebook.id)}
                  onToggleFeatured={() => handleToggle(ebook, "featured")}
                  onTogglePublished={() => handleToggle(ebook, "published")}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ FORM ══ */}
      {tab === "form" && (
        <EbookForm
          form={form}
          set={set}
          saving={saving}
          uploadingCover={uploadingCover}
          onCoverUploadStateChange={setUploadingCover}
          onCoverDeleted={handleCoverDeleted}
          editingId={editingId}
          slugManual={slugManual}
          setSlugManual={setSlugManual}
          addTag={addTag}
          removeTag={removeTag}
          onSave={handleSave}
          onCancel={() => { resetForm(); setTab("list"); }}
        />
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
        }}>
          <div style={{
            background: "#0B1E3D",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "20px", padding: "32px 28px",
            maxWidth: "360px", width: "100%", textAlign: "center",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗑️</div>
            <h3 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 8px",
            }}>
              Delete E-Book?
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: "0 0 24px" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setDeleteId(null)} style={{ ...btn.secondary, flex: 1 }}>Cancel</button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1, background: "linear-gradient(135deg,#ef4444,#dc2626)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "10px", fontFamily: "Nunito, sans-serif",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
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

// ── List row ──────────────────────────────────────────────────────────────────

function EbookRow({
  ebook, onEdit, onDelete, onToggleFeatured, onTogglePublished,
}: {
  ebook: Ebook;
  onEdit: () => void;
  onDelete: () => void;
  onToggleFeatured: () => void;
  onTogglePublished: () => void;
}) {
  const [thumbErr, setThumbErr] = useState(false);
  const promo = ebook.promotion;

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "14px", padding: "14px 18px",
      display: "flex", alignItems: "center",
      gap: "14px", flexWrap: "wrap",
      borderLeft: `3px solid ${ebook.published ? "#22c55e" : "rgba(255,255,255,0.15)"}`,
    }}>
      {/* Cover thumb */}
      <div style={{
        width: "42px", height: "56px",
        borderRadius: "6px", overflow: "hidden",
        background: "rgba(255,255,255,0.06)",
        flexShrink: 0, position: "relative",
      }}>
        {ebook.coverImage && !thumbErr ? (
          <Image
            src={ebook.coverImage}
            alt={ebook.title}
            fill
            sizes="42px"
            style={{ objectFit: "cover" }}
            onError={() => setThumbErr(true)}
          />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
            📖
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: "180px" }}>
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", marginBottom: "3px" }}>
          {ebook.title}
        </div>
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>
          {ebook.exam} · {ebook.level}
        </div>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", marginTop: "2px", fontFamily: "monospace" }}>
          /{ebook.slug}
        </div>
      </div>

      {/* Price */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        {promo?.enabled && promo.offerPrice > 0 ? (
          <>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textDecoration: "line-through", fontFamily: "Rajdhani, sans-serif" }}>
              ₹{(promo.originalPrice || ebook.price).toLocaleString("en-IN")}
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#FF8534", fontFamily: "Rajdhani, sans-serif" }}>
              ₹{promo.offerPrice.toLocaleString("en-IN")}
            </div>
          </>
        ) : (
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#FF8534", fontFamily: "Rajdhani, sans-serif" }}>
            ₹{ebook.price.toLocaleString("en-IN")}
          </div>
        )}
      </div>

      {/* Badges */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
          background: ebook.published ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.06)",
          color: ebook.published ? "#22c55e" : "rgba(255,255,255,0.3)",
          border: `1px solid ${ebook.published ? "rgba(34,197,94,0.25)" : "rgba(255,255,255,0.1)"}`,
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
        }}>
          {ebook.published ? "PUBLISHED" : "DRAFT"}
        </span>
        {ebook.featured && (
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
            background: "rgba(255,184,0,0.12)", color: "#FFB800",
            border: "1px solid rgba(255,184,0,0.25)",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
          }}>
            ⭐ FEATURED
          </span>
        )}
        {promo?.enabled && (
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 8px", borderRadius: "20px",
            background: "rgba(255,98,0,0.15)", color: "#FF6200",
            border: "1px solid rgba(255,98,0,0.3)",
            fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
          }}>
            🏷️ {promo.badgeText || "PROMO"}
          </span>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
        <button onClick={onEdit} style={btn.icon} title="Edit">✏️</button>
        <button
          onClick={onToggleFeatured}
          style={{ ...btn.icon, color: ebook.featured ? "#FFB800" : "rgba(255,255,255,0.5)" }}
          title={ebook.featured ? "Remove featured" : "Mark featured"}
        >
          ⭐
        </button>
        <button
          onClick={onTogglePublished}
          style={{ ...btn.icon, color: ebook.published ? "#22c55e" : "rgba(255,255,255,0.5)" }}
          title={ebook.published ? "Unpublish" : "Publish"}
        >
          {ebook.published ? "⏸" : "▶️"}
        </button>
        <button onClick={onDelete} style={{ ...btn.icon, color: "#ef4444" }} title="Delete">🗑️</button>
      </div>
    </div>
  );
}

// ── Form ──────────────────────────────────────────────────────────────────────

function EbookForm({
  form, set, saving, uploadingCover, onCoverUploadStateChange, onCoverDeleted,
  editingId, slugManual, setSlugManual,
  addTag, removeTag, onSave, onCancel,
}: {
  form: FormState;
  set: (key: keyof FormState, val: string | boolean | string[]) => void;
  saving: boolean;
  uploadingCover: boolean;
  onCoverUploadStateChange: (uploading: boolean) => void;
  onCoverDeleted: () => void;
  editingId: string | null;
  slugManual: boolean;
  setSlugManual: (v: boolean) => void;
  addTag: (f: "features" | "modules", i: "featuresInput" | "modulesInput") => void;
  removeTag: (f: "features" | "modules", idx: number) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const handleTagKeyDown = (
    e: React.KeyboardEvent,
    field: "features" | "modules",
    inputField: "featuresInput" | "modulesInput"
  ) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(field, inputField);
    }
  };

  const bannerColorMap: Record<string, string> = {
    orange: "#FF6200",
    red: "#ef4444",
    green: "#22c55e",
    purple: "#8b5cf6",
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.09)",
      borderRadius: "18px", padding: "28px",
    }}>
      <h2 style={{
        fontFamily: "Rajdhani, sans-serif",
        fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 24px",
      }}>
        {editingId ? "✏️ Edit E-Book" : "➕ Add New E-Book"}
      </h2>

      <div style={{ display: "grid", gap: "18px" }}>

        {/* Title + Slug */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={lbl}>
            <span style={lblText}>Title *</span>
            <input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="e.g. Quick Revision E-Book"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Slug * {!slugManual && <span style={{ color: "rgba(255,255,255,0.25)" }}>(auto)</span>}</span>
            <input
              value={form.slug}
              onChange={(e) => { setSlugManual(true); set("slug", e.target.value); }}
              placeholder="e.g. overseer-gr1-instructor"
              style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px" }}
            />
          </label>
        </div>

        {/* Exam + Level */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={lbl}>
            <span style={lblText}>Exam Name *</span>
            <input
              value={form.exam}
              onChange={(e) => set("exam", e.target.value)}
              placeholder="e.g. Overseer GR.1 / Instructor"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Level *</span>
            <input
              value={form.level}
              onChange={(e) => set("level", e.target.value)}
              placeholder="e.g. Diploma Civil Level"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Product Category */}
        <label style={lbl}>
          <span style={lblText}>Product Category</span>
          <select
            value={form.productCategory}
            onChange={(e) => set("productCategory", e.target.value as "single" | "bundle" | "ultimate")}
            style={{ ...inputStyle }}
          >
            <option value="single">Single E-Book</option>
            <option value="bundle">Bundle</option>
            <option value="ultimate">Ultimate Bundle</option>
          </select>
        </label>

        {/* Description */}
        <label style={lbl}>
          <span style={lblText}>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Brief description of the e-book content…"
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
          />
        </label>

        {/* Cover Image Upload */}
        <div style={lbl}>
          <span style={lblText}>Cover Image</span>
          <CoverImageUpload
            value={form.coverImage}
            onChange={(url) => set("coverImage", url)}
            slug={form.slug}
            onUploadStateChange={onCoverUploadStateChange}
            onDeleted={onCoverDeleted}
          />
        </div>

        {/* Price + Validity */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={lbl}>
            <span style={lblText}>Price (₹) *</span>
            <input
              type="number"
              min="0"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              placeholder="e.g. 2000"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Validity Date</span>
            <input
              value={form.validityDate}
              onChange={(e) => set("validityDate", e.target.value)}
              placeholder="e.g. 30-06-2026"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Preview + Purchase URLs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <label style={lbl}>
            <span style={lblText}>Preview URL</span>
            <input
              value={form.previewUrl}
              onChange={(e) => set("previewUrl", e.target.value)}
              placeholder="https://…"
              style={inputStyle}
            />
          </label>
          <label style={lbl}>
            <span style={lblText}>Purchase URL</span>
            <input
              value={form.purchaseUrl}
              onChange={(e) => set("purchaseUrl", e.target.value)}
              placeholder="https://…"
              style={inputStyle}
            />
          </label>
        </div>

        {/* Features */}
        <div style={lbl}>
          <span style={lblText}>Features</span>
          <TagInput
            tags={form.features}
            inputValue={form.featuresInput}
            onInputChange={(v) => set("featuresInput", v)}
            onAdd={() => addTag("features", "featuresInput")}
            onRemove={(i) => removeTag("features", i)}
            onKeyDown={(e) => handleTagKeyDown(e, "features", "featuresInput")}
            placeholder="e.g. Syllabus Based — press Enter or comma to add"
            color="#FF8534"
          />
        </div>

        {/* Modules */}
        <div style={lbl}>
          <span style={lblText}>Modules</span>
          <TagInput
            tags={form.modules}
            inputValue={form.modulesInput}
            onInputChange={(v) => set("modulesInput", v)}
            onAdd={() => addTag("modules", "modulesInput")}
            onRemove={(i) => removeTag("modules", i)}
            onKeyDown={(e) => handleTagKeyDown(e, "modules", "modulesInput")}
            placeholder="e.g. Surveying I — press Enter or comma to add"
            color="#3b82f6"
          />
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          <Toggle label="Featured" checked={form.featured} onChange={() => set("featured", !form.featured)} activeColor="#FFB800" />
          <Toggle label="Published" checked={form.published} onChange={() => set("published", !form.published)} activeColor="#22c55e" />
        </div>

        {/* ═══ PROMOTION SETTINGS ═══ */}
        <div style={{
          border: "1px solid rgba(255,98,0,0.25)",
          borderRadius: "16px",
          padding: "24px",
          background: "rgba(255,98,0,0.03)",
        }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            marginBottom: form.promoEnabled ? "24px" : "0",
            flexWrap: "wrap", gap: "12px",
          }}>
            <div>
              <h3 style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "17px", fontWeight: 700, color: "#FF8534", margin: 0,
              }}>
                🏷️ Promotion Settings
              </h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>
                Control pricing, discounts, coupons and banners from here
              </p>
            </div>
            <Toggle
              label="Enable Promotion"
              checked={form.promoEnabled}
              onChange={() => set("promoEnabled", !form.promoEnabled)}
              activeColor="#FF6200"
            />
          </div>

          {form.promoEnabled && (
            <div style={{ display: "grid", gap: "16px" }}>

              {/* Offer Type + Badge Text */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <label style={lbl}>
                  <span style={lblText}>Offer Type</span>
                  <select
                    value={form.promoOfferType}
                    onChange={(e) => set("promoOfferType", e.target.value as FormState["promoOfferType"])}
                    style={{ ...inputStyle }}
                  >
                    <option value="discount">Discount</option>
                    <option value="launch">Launch Offer</option>
                    <option value="bundle">Bundle Deal</option>
                    <option value="limited">Limited Offer</option>
                  </select>
                </label>
                <label style={lbl}>
                  <span style={lblText}>Badge Text</span>
                  <input
                    value={form.promoBadgeText}
                    onChange={(e) => set("promoBadgeText", e.target.value)}
                    placeholder="e.g. 50% OFF, EARLY BIRD, BEST VALUE"
                    style={inputStyle}
                  />
                </label>
              </div>

              {/* Banner Text */}
              <label style={lbl}>
                <span style={lblText}>Banner Text</span>
                <input
                  value={form.promoBannerText}
                  onChange={(e) => set("promoBannerText", e.target.value)}
                  placeholder="e.g. 🔥 Early Bird Offer — Limited Time Only!"
                  style={inputStyle}
                />
              </label>

              {/* Original Price + Offer Price + Discount % */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                <label style={lbl}>
                  <span style={lblText}>Original Price (₹)</span>
                  <input
                    type="number" min="0"
                    value={form.promoOriginalPrice}
                    onChange={(e) => set("promoOriginalPrice", e.target.value)}
                    placeholder="e.g. 20000"
                    style={inputStyle}
                  />
                </label>
                <label style={lbl}>
                  <span style={lblText}>Offer Price (₹)</span>
                  <input
                    type="number" min="0"
                    value={form.promoOfferPrice}
                    onChange={(e) => set("promoOfferPrice", e.target.value)}
                    placeholder="e.g. 10000"
                    style={inputStyle}
                  />
                </label>
                <label style={lbl}>
                  <span style={lblText}>Discount %</span>
                  <input
                    type="number" min="0" max="100"
                    value={form.promoDiscountPercentage}
                    onChange={(e) => set("promoDiscountPercentage", e.target.value)}
                    placeholder="e.g. 50"
                    style={inputStyle}
                  />
                </label>
              </div>

              {/* Coupon Code + Coupon Enabled */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "16px", alignItems: "end" }}>
                <label style={lbl}>
                  <span style={lblText}>Coupon Code</span>
                  <input
                    value={form.promoCouponCode}
                    onChange={(e) => set("promoCouponCode", e.target.value.toUpperCase())}
                    placeholder="e.g. BTECH50"
                    style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}
                  />
                </label>
                <div style={{ paddingBottom: "2px" }}>
                  <Toggle
                    label="Coupon Enabled"
                    checked={form.promoCouponEnabled}
                    onChange={() => set("promoCouponEnabled", !form.promoCouponEnabled)}
                    activeColor="#22c55e"
                  />
                </div>
              </div>

              {/* Expiry Date */}
              <label style={lbl}>
                <span style={lblText}>Promotion Expiry Date & Time</span>
                <input
                  type="datetime-local"
                  value={form.promoExpiryDate}
                  onChange={(e) => set("promoExpiryDate", e.target.value)}
                  style={{ ...inputStyle, colorScheme: "dark" }}
                />
              </label>

              {/* Banner Color */}
              <div style={lbl}>
                <span style={lblText}>Banner Color</span>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {(["orange", "red", "green", "purple"] as const).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => set("promoBannerColor", color)}
                      style={{
                        padding: "8px 18px",
                        borderRadius: "20px",
                        border: `2px solid ${form.promoBannerColor === color ? bannerColorMap[color] : "transparent"}`,
                        background: form.promoBannerColor === color
                          ? `${bannerColorMap[color]}22`
                          : "rgba(255,255,255,0.06)",
                        color: form.promoBannerColor === color ? bannerColorMap[color] : "rgba(255,255,255,0.5)",
                        fontSize: "13px", fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "Nunito, sans-serif",
                        textTransform: "capitalize",
                        transition: "all 0.2s",
                      }}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Toggles */}
              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", paddingTop: "4px" }}>
                <Toggle label="Featured Offer" checked={form.promoFeatured} onChange={() => set("promoFeatured", !form.promoFeatured)} activeColor="#FFB800" />
                <Toggle label="Show Countdown Timer" checked={form.promoShowCountdown} onChange={() => set("promoShowCountdown", !form.promoShowCountdown)} activeColor="#3b82f6" />
                <Toggle label="Show Banner" checked={form.promoShowBanner} onChange={() => set("promoShowBanner", !form.promoShowBanner)} activeColor="#FF6200" />
              </div>

            </div>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", paddingTop: "4px", flexWrap: "wrap", alignItems: "center" }}>
          <button
            onClick={onSave}
            disabled={saving || uploadingCover}
            style={{ ...btn.primary, opacity: (saving || uploadingCover) ? 0.55 : 1, cursor: (saving || uploadingCover) ? "not-allowed" : "pointer" }}
          >
            {saving ? "Saving…" : uploadingCover ? "⏳ Uploading image…" : editingId ? "Update E-Book" : "Publish E-Book"}
          </button>
          <button onClick={onCancel} style={btn.secondary}>Cancel</button>
          {uploadingCover && (
            <span style={{ fontSize: "12px", color: "rgba(255,184,0,0.8)", fontWeight: 600 }}>
              Wait for image upload to finish before saving.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Tag input ─────────────────────────────────────────────────────────────────

function TagInput({
  tags, inputValue, onInputChange, onAdd, onRemove, onKeyDown, placeholder, color,
}: {
  tags: string[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  color: string;
}) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: tags.length ? "8px" : 0 }}>
        {tags.map((tag, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "4px 10px",
            background: `${color}14`,
            border: `1px solid ${color}30`,
            borderRadius: "20px",
            color, fontSize: "12px", fontWeight: 600,
            fontFamily: "Nunito, sans-serif",
          }}>
            {tag}
            <button
              onClick={() => onRemove(i)}
              style={{ background: "none", border: "none", color, cursor: "pointer", padding: 0, fontSize: "12px", lineHeight: 1, opacity: 0.7 }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={{ ...inputStyle, flex: 1 }}
        />
        <button
          onClick={onAdd}
          style={{
            padding: "11px 14px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "10px",
            color: "rgba(255,255,255,0.7)",
            cursor: "pointer", fontSize: "16px", flexShrink: 0,
          }}
          title="Add"
        >
          +
        </button>
      </div>
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({
  label, checked, onChange, activeColor,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  activeColor: string;
}) {
  return (
    <div onClick={onChange} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
      <div style={{
        width: "44px", height: "24px", borderRadius: "12px",
        background: checked ? activeColor : "rgba(255,255,255,0.15)",
        position: "relative", transition: "background 0.25s", flexShrink: 0,
      }}>
        <div style={{
          position: "absolute", top: "3px",
          left: checked ? "23px" : "3px",
          width: "18px", height: "18px", borderRadius: "50%",
          background: "#fff", transition: "left 0.25s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }} />
      </div>
      <span style={{
        fontSize: "14px",
        color: checked ? activeColor : "rgba(255,255,255,0.45)",
        fontWeight: 600, transition: "color 0.2s",
      }}>
        {label}
      </span>
    </div>
  );
}
