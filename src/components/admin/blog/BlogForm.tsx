"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog, deleteBlog, slugify, calcReadingTime } from "@/lib/blog";
import { uploadBlogImage } from "@/lib/blogStorage";
import { markdownToHtml } from "@/lib/markdownToHtml";
import { BLOG_CATEGORIES } from "@/types/blog";
import type { Blog, BlogCreateInput } from "@/types/blog";

// ─── Shared styles ────────────────────────────────────────────────────────────

const S = {
  input: {
    width: "100%", boxSizing: "border-box",
    background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", padding: "11px 14px", color: "#fff",
    fontSize: "14px", outline: "none", fontFamily: "Nunito, sans-serif",
    transition: "border-color 0.2s",
  } as React.CSSProperties,
  lbl: { display: "flex", flexDirection: "column", gap: "6px" } as React.CSSProperties,
  lblText: {
    fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Rajdhani, sans-serif",
  } as React.CSSProperties,
  card: {
    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px", padding: "24px",
  } as React.CSSProperties,
  sectionTitle: {
    fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700,
    color: "#fff", marginBottom: "20px",
  } as React.CSSProperties,
  btnPrimary: {
    background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff",
    border: "none", borderRadius: "10px", padding: "11px 24px",
    fontFamily: "Nunito, sans-serif", fontSize: "14px", fontWeight: 700,
    cursor: "pointer", boxShadow: "0 4px 16px rgba(255,98,0,0.3)",
    whiteSpace: "nowrap",
  } as React.CSSProperties,
  btnSecondary: {
    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.65)",
    border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px",
    padding: "11px 24px", fontFamily: "Nunito, sans-serif", fontSize: "14px",
    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  } as React.CSSProperties,
  btnDanger: {
    background: "rgba(239,68,68,0.1)", color: "#f87171",
    border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px",
    padding: "11px 24px", fontFamily: "Nunito, sans-serif", fontSize: "14px",
    fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
  } as React.CSSProperties,
};

// ─── Toolbar ──────────────────────────────────────────────────────────────────

function insertMarkdown(
  ta: HTMLTextAreaElement,
  before: string,
  after = "",
  placeholder = "text",
): string {
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const sel = ta.value.slice(start, end) || placeholder;
  return ta.value.slice(0, start) + before + sel + after + ta.value.slice(end);
}

const TOOLBAR = [
  { label: "H1", before: "# ", after: "", placeholder: "Heading 1" },
  { label: "H2", before: "## ", after: "", placeholder: "Heading 2" },
  { label: "H3", before: "### ", after: "", placeholder: "Heading 3" },
  { label: "B",  before: "**", after: "**", placeholder: "bold" },
  { label: "I",  before: "*",  after: "*",  placeholder: "italic" },
  { label: `"`, before: "\n> ", after: "", placeholder: "quote" },
  { label: "</>", before: "`", after: "`", placeholder: "code" },
  { label: "```", before: "\n```\n", after: "\n```", placeholder: "code block" },
  { label: "—",  before: "\n---\n", after: "", placeholder: "" },
  { label: "ul", before: "\n- ", after: "", placeholder: "item" },
  { label: "ol", before: "\n1. ", after: "", placeholder: "item" },
  { label: "🔗", before: "[", after: "](url)", placeholder: "link text" },
  { label: "🖼",  before: "![", after: "](image-url)", placeholder: "alt text" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  initial?: Blog;
  mode: "create" | "edit";
}

export default function BlogForm({ initial, mode }: Props) {
  const router = useRouter();

  const [title, setTitle]           = useState(initial?.title ?? "");
  const [slug, setSlug]             = useState(initial?.slug ?? "");
  const [excerpt, setExcerpt]       = useState(initial?.excerpt ?? "");
  const [content, setContent]       = useState(initial?.content ?? "");
  const [category, setCategory]     = useState(initial?.category ?? "");
  const [tagsInput, setTagsInput]   = useState(initial?.tags.join(", ") ?? "");
  const [authorName, setAuthorName] = useState(initial?.authorName ?? "Civilezy Team");
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [status, setStatus]         = useState<"draft" | "published">(
    initial?.status === "published" ? "published" : "draft",
  );
  const [seoTitle, setSeoTitle]         = useState(initial?.seoTitle ?? "");
  const [seoDesc, setSeoDesc]           = useState(initial?.seoDescription ?? "");
  const [imageUrl, setImageUrl]         = useState(initial?.featuredImage ?? "");
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initial?.featuredImage ?? "");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [preview, setPreview]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug from title (only when creating)
  useEffect(() => {
    if (mode === "create") setSlug(slugify(title));
  }, [title, mode]);

  // Auto-populate SEO title from title
  useEffect(() => {
    if (!seoTitle && title) setSeoTitle(title + " | Civilezy Blog");
  }, [title, seoTitle]);

  const readingTime = calcReadingTime(content);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function applyToolbar(item: typeof TOOLBAR[number]) {
    const ta = taRef.current;
    if (!ta) return;
    const newVal = insertMarkdown(ta, item.before, item.after, item.placeholder);
    setContent(newVal);
    ta.focus();
  }

  const validate = useCallback(() => {
    if (!title.trim())   { setError("Title is required"); return false; }
    if (!slug.trim())    { setError("Slug is required"); return false; }
    if (!content.trim()) { setError("Content is required"); return false; }
    if (!category)       { setError("Please select a category"); return false; }
    if (status === "published" && !excerpt.trim()) {
      setError("Excerpt is required before publishing"); return false;
    }
    return true;
  }, [title, slug, content, category, excerpt, status]);

  async function handleSave(publishOverride?: "published" | "draft") {
    setError("");
    if (!validate()) return;
    setSaving(true);
    try {
      const finalStatus = publishOverride ?? status;
      const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
      const tempId = initial?.id ?? `blog_${Date.now()}`;

      let finalImageUrl = imageUrl;
      if (imageFile) {
        setUploadProgress(1);
        finalImageUrl = await uploadBlogImage(imageFile, tempId, setUploadProgress);
        setImageUrl(finalImageUrl);
        setUploadProgress(0);
      }

      const payload: BlogCreateInput = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        featuredImage: finalImageUrl,
        category,
        tags,
        authorName: authorName.trim() || "Civilezy Team",
        authorPhoto: initial?.authorPhoto ?? "",
        status: finalStatus,
        isFeatured,
        seoTitle: seoTitle.trim() || title.trim(),
        seoDescription: seoDesc.trim(),
        readingTime,
      };

      if (mode === "create") {
        await createBlog(payload);
      } else if (initial?.id) {
        await updateBlog(initial.id, payload);
      }

      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!initial?.id) return;
    setSaving(true);
    try {
      await deleteBlog(initial.id);
      router.push("/admin/blogs");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 24px 60px" }}>
      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <button
            onClick={() => router.push("/admin/blogs")}
            style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "6px", fontFamily: "Nunito, sans-serif" }}
          >
            ← Back to Blogs
          </button>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0 }}>
            {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {mode === "edit" && (
            <button style={S.btnDanger} onClick={() => setConfirmDelete(true)} disabled={saving}>
              🗑 Delete
            </button>
          )}
          <button style={S.btnSecondary} onClick={() => handleSave("draft")} disabled={saving}>
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button style={S.btnPrimary} onClick={() => handleSave("published")} disabled={saving}>
            {saving ? "Publishing…" : status === "published" ? "Update Published" : "Publish Blog"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "14px", marginBottom: "20px" }}>
          ⚠️ {error}
        </div>
      )}

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${uploadProgress}%`, background: "linear-gradient(90deg,#FF6200,#FF8534)", transition: "width 0.3s", borderRadius: "4px" }} />
          </div>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "6px" }}>Uploading image… {uploadProgress}%</p>
        </div>
      )}

      {/* ── Main layout: form + sidebar ── */}
      <div className="blog-form-grid">
        {/* ── Left column: main content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Title & Slug */}
          <div style={S.card}>
            <p style={S.sectionTitle}>📝 Post Details</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <label style={S.lbl}>
                <span style={S.lblText}>Title *</span>
                <input
                  value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title…"
                  style={{ ...S.input, fontSize: "17px", fontWeight: 600 }}
                />
              </label>
              <label style={S.lbl}>
                <span style={S.lblText}>Slug *</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    value={slug} onChange={(e) => setSlug(e.target.value)}
                    placeholder="blog-post-slug"
                    style={{ ...S.input, fontFamily: "monospace", fontSize: "13px" }}
                  />
                  <button
                    onClick={() => setSlug(slugify(title))}
                    title="Regenerate from title"
                    style={{ ...S.btnSecondary, padding: "8px 12px", fontSize: "13px", flexShrink: 0 }}
                  >
                    ↺
                  </button>
                </div>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
                  URL: /blogs/<strong style={{ color: "rgba(255,255,255,0.5)" }}>{slug || "your-slug"}</strong>
                </span>
              </label>
              <label style={S.lbl}>
                <span style={S.lblText}>Excerpt (shown in listings) *</span>
                <textarea
                  value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                  rows={3} placeholder="A short summary of this post…"
                  style={{ ...S.input, resize: "vertical" }}
                />
                <span style={{ fontSize: "12px", color: excerpt.length > 160 ? "#f87171" : "rgba(255,255,255,0.3)" }}>
                  {excerpt.length}/160 chars
                </span>
              </label>
            </div>
          </div>

          {/* Content Editor */}
          <div style={S.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
              <p style={{ ...S.sectionTitle, marginBottom: 0 }}>✏️ Content (Markdown)</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                  ~{readingTime} min read
                </span>
                <button
                  onClick={() => setPreview((v) => !v)}
                  style={{ ...S.btnSecondary, padding: "6px 14px", fontSize: "12px" }}
                >
                  {preview ? "✏️ Write" : "👁 Preview"}
                </button>
              </div>
            </div>

            {/* Toolbar */}
            {!preview && (
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px", padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                {TOOLBAR.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => applyToolbar(t)}
                    title={t.placeholder}
                    style={{
                      background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px", padding: "4px 9px", cursor: "pointer",
                      color: "rgba(255,255,255,0.7)", fontSize: "12px", fontWeight: 600,
                      fontFamily: "monospace",
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {preview ? (
              <div
                className="blog-preview-content"
                dangerouslySetInnerHTML={{ __html: markdownToHtml(content) || "<p style='color:rgba(255,255,255,0.3)'>Nothing to preview yet…</p>" }}
                style={{ minHeight: "400px" }}
              />
            ) : (
              <textarea
                ref={taRef}
                value={content} onChange={(e) => setContent(e.target.value)}
                rows={24}
                placeholder={`Write your blog post in Markdown…\n\n# Heading 1\n\n## Heading 2\n\nRegular paragraph text.\n\n**Bold** and *italic* and \`inline code\`\n\n> This is a blockquote\n\n\`\`\`\ncode block\n\`\`\`\n\n- list item\n- another item`}
                style={{ ...S.input, resize: "vertical", fontFamily: "monospace", fontSize: "13px", lineHeight: 1.7, minHeight: "400px" }}
              />
            )}
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

          {/* Publish Settings */}
          <div style={S.card}>
            <p style={S.sectionTitle}>🚀 Publish Settings</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

              {/* Status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                <span style={{
                  width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
                  background: status === "published" ? "#34d399" : "#FFB800",
                }} />
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff", fontFamily: "Nunito, sans-serif" }}>
                  {status === "published" ? "Published" : "Draft"}
                </span>
              </div>

              {/* Featured toggle */}
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <div
                  onClick={() => setIsFeatured((v) => !v)}
                  style={{
                    width: "40px", height: "22px", borderRadius: "11px", flexShrink: 0,
                    background: isFeatured ? "linear-gradient(135deg,#FF6200,#FF8534)" : "rgba(255,255,255,0.1)",
                    position: "relative", cursor: "pointer", transition: "background 0.25s",
                  }}
                >
                  <div style={{
                    position: "absolute", top: "3px",
                    left: isFeatured ? "21px" : "3px",
                    width: "16px", height: "16px", borderRadius: "50%", background: "#fff",
                    transition: "left 0.25s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                  }} />
                </div>
                <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontFamily: "Nunito, sans-serif" }}>
                  Featured Post
                </span>
              </label>

              {/* Author */}
              <label style={S.lbl}>
                <span style={S.lblText}>Author Name</span>
                <input
                  value={authorName} onChange={(e) => setAuthorName(e.target.value)}
                  style={S.input}
                  placeholder="Civilezy Team"
                />
              </label>
            </div>
          </div>

          {/* Category & Tags */}
          <div style={S.card}>
            <p style={S.sectionTitle}>🏷 Category & Tags</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={S.lbl}>
                <span style={S.lblText}>Category *</span>
                <select
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  style={{ ...S.input, cursor: "pointer" }}
                >
                  <option value="">Select category…</option>
                  {BLOG_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label style={S.lbl}>
                <span style={S.lblText}>Tags (comma separated)</span>
                <input
                  value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="psc, civil, kerala, exam"
                  style={S.input}
                />
                {tagsInput && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                    {tagsInput.split(",").filter((t) => t.trim()).map((t) => (
                      <span key={t} style={{ background: "rgba(255,133,52,0.12)", border: "1px solid rgba(255,133,52,0.25)", borderRadius: "20px", padding: "2px 10px", fontSize: "11px", color: "#FF8534" }}>
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Featured Image */}
          <div style={S.card}>
            <p style={S.sectionTitle}>🖼 Featured Image</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {imagePreview ? (
                <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", aspectRatio: "16/9" }}>
                  <Image src={imagePreview} alt="Featured" fill style={{ objectFit: "cover" }} />
                  <button
                    onClick={() => { setImagePreview(""); setImageFile(null); setImageUrl(""); }}
                    style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.7)", border: "none", borderRadius: "6px", color: "#fff", padding: "4px 8px", cursor: "pointer", fontSize: "12px" }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="featured-image-upload"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                    gap: "8px", padding: "28px 16px", borderRadius: "10px",
                    border: "2px dashed rgba(255,255,255,0.12)", cursor: "pointer",
                    background: "rgba(0,0,0,0.2)", transition: "border-color 0.2s",
                  }}
                >
                  <span style={{ fontSize: "28px" }}>📸</span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Click to upload image</span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>PNG, JPG, WebP · Max 5 MB</span>
                </label>
              )}
              <input
                id="featured-image-upload" type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange} style={{ display: "none" }}
              />
              {imagePreview && (
                <label htmlFor="featured-image-upload" style={{ ...S.btnSecondary, textAlign: "center", cursor: "pointer", fontSize: "13px" }}>
                  Change Image
                </label>
              )}

              <label style={S.lbl}>
                <span style={S.lblText}>Or paste image URL</span>
                <input
                  value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value); }}
                  placeholder="https://…"
                  style={{ ...S.input, fontSize: "12px" }}
                />
              </label>
            </div>
          </div>

          {/* SEO */}
          <div style={S.card}>
            <p style={S.sectionTitle}>🔍 SEO Settings</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <label style={S.lbl}>
                <span style={S.lblText}>SEO Title</span>
                <input
                  value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                  style={S.input} placeholder="Page title for search engines"
                />
                <span style={{ fontSize: "12px", color: seoTitle.length > 60 ? "#f87171" : "rgba(255,255,255,0.3)" }}>
                  {seoTitle.length}/60 chars
                </span>
              </label>
              <label style={S.lbl}>
                <span style={S.lblText}>Meta Description</span>
                <textarea
                  value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)}
                  rows={3} placeholder="Search engine description…"
                  style={{ ...S.input, resize: "vertical" }}
                />
                <span style={{ fontSize: "12px", color: seoDesc.length > 160 ? "#f87171" : "rgba(255,255,255,0.3)" }}>
                  {seoDesc.length}/160 chars
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom action bar */}
      <div style={{ position: "sticky", bottom: "20px", display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px", padding: "16px 20px", background: "rgba(6,13,26,0.96)", backdropFilter: "blur(12px)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.08)", flexWrap: "wrap" }}>
        {error && <span style={{ fontSize: "13px", color: "#f87171", flex: 1, alignSelf: "center" }}>⚠️ {error}</span>}
        <button style={S.btnSecondary} onClick={() => handleSave("draft")} disabled={saving}>
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <button style={S.btnPrimary} onClick={() => handleSave("published")} disabled={saving}>
          {saving ? "Publishing…" : status === "published" ? "Update Post" : "🚀 Publish"}
        </button>
      </div>

      {/* Delete confirmation */}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#0B1929", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Delete Blog Post?</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", marginBottom: "24px", lineHeight: 1.6 }}>
              This will permanently delete &ldquo;{title}&rdquo;. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button style={S.btnSecondary} onClick={() => setConfirmDelete(false)}>Cancel</button>
              <button style={{ ...S.btnDanger, background: "rgba(239,68,68,0.15)" }} onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting…" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .blog-form-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 20px;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .blog-form-grid { grid-template-columns: 1fr; }
        }
        /* Preview content styles */
        .blog-preview-content {
          color: rgba(255,255,255,0.82);
          font-family: "Nunito", sans-serif;
          font-size: 15px;
          line-height: 1.85;
          padding: 20px;
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .blog-preview-content .md-h1 { font-family: "Rajdhani", sans-serif; font-size: 2rem; font-weight: 700; color: #fff; margin: 28px 0 16px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; }
        .blog-preview-content .md-h2 { font-family: "Rajdhani", sans-serif; font-size: 1.55rem; font-weight: 700; color: #fff; margin: 24px 0 14px; }
        .blog-preview-content .md-h3 { font-family: "Rajdhani", sans-serif; font-size: 1.25rem; font-weight: 700; color: #e2e8f0; margin: 20px 0 12px; }
        .blog-preview-content .md-h4 { font-family: "Rajdhani", sans-serif; font-size: 1.05rem; font-weight: 700; color: #e2e8f0; margin: 16px 0 10px; }
        .blog-preview-content .md-p { margin: 0 0 16px; }
        .blog-preview-content .md-blockquote { border-left: 3px solid #FF8534; margin: 20px 0; padding: 12px 20px; background: rgba(255,133,52,0.06); border-radius: 0 8px 8px 0; color: rgba(255,255,255,0.7); }
        .blog-preview-content .md-pre { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 16px 20px; overflow-x: auto; margin: 16px 0; }
        .blog-preview-content .md-pre code { font-family: monospace; font-size: 13px; color: #a3e635; }
        .blog-preview-content .md-code { background: rgba(255,255,255,0.08); border-radius: 4px; padding: 2px 6px; font-family: monospace; font-size: 13px; color: #60a5fa; }
        .blog-preview-content .md-ul, .blog-preview-content .md-ol { margin: 12px 0 16px 20px; display: flex; flex-direction: column; gap: 6px; }
        .blog-preview-content .md-ul li::marker { color: #FF8534; }
        .blog-preview-content .md-hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 28px 0; }
        .blog-preview-content .md-link { color: #FF8534; text-decoration: underline; }
        .blog-preview-content .md-img { max-width: 100%; border-radius: 10px; margin: 16px 0; display: block; }
      `}</style>
    </div>
  );
}
