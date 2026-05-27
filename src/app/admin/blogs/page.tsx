"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { listAllBlogs, publishBlog, unpublishBlog, deleteBlog } from "@/lib/blog";
import { getCategoryMeta } from "@/types/blog";
import type { Blog } from "@/types/blog";

const ROWS_PER_PAGE = 10;

function StatusBadge({ status }: { status: Blog["status"] }) {
  const map = {
    published: { color: "#34d399", bg: "rgba(52,211,153,0.1)", label: "Published" },
    draft:     { color: "#FFB800", bg: "rgba(255,184,0,0.1)",  label: "Draft"     },
    archived:  { color: "#94a3b8", bg: "rgba(148,163,184,0.1)", label: "Archived" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}40`, borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>
      {s.label}
    </span>
  );
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs]         = useState<Blog[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage]           = useState(1);
  const [actionId, setActionId]   = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [error, setError]         = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await listAllBlogs();
      setBlogs(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = blogs.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = !q || b.title.toLowerCase().includes(q) || b.slug.toLowerCase().includes(q);
    const matchCat    = !catFilter || b.category === catFilter;
    const matchStatus = !statusFilter || b.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage   = Math.min(page, totalPages);
  const paginated  = filtered.slice((safePage - 1) * ROWS_PER_PAGE, safePage * ROWS_PER_PAGE);
  const categories = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)));

  async function doAction(id: string, action: "publish" | "unpublish" | "delete") {
    setActionId(id);
    setError("");
    try {
      if (action === "publish")   await publishBlog(id);
      if (action === "unpublish") await unpublishBlog(id);
      if (action === "delete")    await deleteBlog(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionId(null);
      setConfirmId(null);
    }
  }

  function fmtDate(ts: Blog["publishedAt"] | Blog["createdAt"]) {
    if (!ts) return "—";
    try { return (ts as { toDate(): Date }).toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return "—"; }
  }

  return (
    <div style={{ padding: "28px 24px 60px", fontFamily: "Nunito, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
          <div>
            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "28px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
              📰 Blog Manager
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
              {blogs.length} total · {blogs.filter((b) => b.status === "published").length} published · {blogs.filter((b) => b.status === "draft").length} drafts
            </p>
          </div>
          <Link
            href="/admin/blogs/create"
            style={{ background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff", textDecoration: "none", borderRadius: "10px", padding: "11px 22px", fontWeight: 700, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "7px", boxShadow: "0 4px 16px rgba(255,98,0,0.3)", whiteSpace: "nowrap" }}
          >
            + New Blog
          </Link>
        </div>

        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "12px 16px", color: "#f87171", fontSize: "13px", marginBottom: "20px" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
          <input
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="🔍  Search blogs…"
            style={{ flex: "1 1 240px", background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "Nunito, sans-serif" }}
          />
          <select
            value={catFilter} onChange={(e) => { setCatFilter(e.target.value); setPage(1); }}
            style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: catFilter ? "#fff" : "rgba(255,255,255,0.45)", fontSize: "14px", outline: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
          >
            <option value="">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: statusFilter ? "#fff" : "rgba(255,255,255,0.45)", fontSize: "14px", outline: "none", cursor: "pointer", fontFamily: "Nunito, sans-serif" }}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          {(search || catFilter || statusFilter) && (
            <button onClick={() => { setSearch(""); setCatFilter(""); setStatusFilter(""); setPage(1); }}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", padding: "10px 14px", color: "rgba(255,255,255,0.55)", fontSize: "13px", cursor: "pointer" }}>
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>
          {loading ? (
            <div style={{ padding: "60px", textAlign: "center", color: "rgba(255,255,255,0.35)" }}>Loading…</div>
          ) : paginated.length === 0 ? (
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>{blogs.length === 0 ? "No blogs yet. Create your first post!" : "No results match your filters."}</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                  {["Image", "Title & Slug", "Category", "Status", "Views", "Date", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "Rajdhani, sans-serif", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((blog) => {
                  const catMeta = getCategoryMeta(blog.category);
                  const busy = actionId === blog.id;
                  return (
                    <tr key={blog.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.025)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>

                      {/* Image */}
                      <td style={{ padding: "12px 14px", width: "68px" }}>
                        <div style={{ width: "60px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
                          {blog.featuredImage ? (
                            <Image src={blog.featuredImage} alt={blog.title} width={60} height={40} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📝</div>
                          )}
                        </div>
                      </td>

                      {/* Title */}
                      <td style={{ padding: "12px 14px", maxWidth: "260px" }}>
                        <div style={{ fontWeight: 700, color: "#fff", fontSize: "14px", lineHeight: 1.35, marginBottom: "3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {blog.isFeatured && <span style={{ fontSize: "11px", marginRight: "6px" }}>⭐</span>}
                          {blog.title}
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          /blogs/{blog.slug}
                        </div>
                      </td>

                      {/* Category */}
                      <td style={{ padding: "12px 14px" }}>
                        {blog.category ? (
                          <span style={{ background: catMeta.bg, color: catMeta.color, border: `1px solid ${catMeta.border}`, borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>
                            {blog.category}
                          </span>
                        ) : <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "12px" }}>—</span>}
                      </td>

                      {/* Status */}
                      <td style={{ padding: "12px 14px" }}><StatusBadge status={blog.status} /></td>

                      {/* Views */}
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.5)", fontSize: "13px", whiteSpace: "nowrap" }}>
                        👁 {blog.views ?? 0}
                      </td>

                      {/* Date */}
                      <td style={{ padding: "12px 14px", color: "rgba(255,255,255,0.4)", fontSize: "12px", whiteSpace: "nowrap" }}>
                        {fmtDate(blog.publishedAt ?? blog.createdAt)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <Link href={`/admin/blogs/edit/${blog.id}`}
                            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "7px", padding: "5px 10px", color: "#fff", fontSize: "12px", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
                            ✏️ Edit
                          </Link>
                          {blog.status === "published" ? (
                            <a href={`/blogs/${blog.slug}`} target="_blank" rel="noopener noreferrer"
                              style={{ background: "rgba(96,165,250,0.1)", border: "1px solid rgba(96,165,250,0.2)", borderRadius: "7px", padding: "5px 10px", color: "#60a5fa", fontSize: "12px", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }}>
                              👁 View
                            </a>
                          ) : (
                            <span
                              title="Publish the blog first to view it publicly"
                              style={{ background: "rgba(96,165,250,0.04)", border: "1px solid rgba(96,165,250,0.08)", borderRadius: "7px", padding: "5px 10px", color: "rgba(96,165,250,0.35)", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", cursor: "not-allowed" }}>
                              👁 View
                            </span>
                          )}
                          {blog.status === "published" ? (
                            <button disabled={busy} onClick={() => doAction(blog.id!, "unpublish")}
                              style={{ background: "rgba(255,184,0,0.1)", border: "1px solid rgba(255,184,0,0.2)", borderRadius: "7px", padding: "5px 10px", color: "#FFB800", fontSize: "12px", cursor: busy ? "default" : "pointer", fontWeight: 600, opacity: busy ? 0.5 : 1, whiteSpace: "nowrap" }}>
                              Unpublish
                            </button>
                          ) : (
                            <button disabled={busy} onClick={() => doAction(blog.id!, "publish")}
                              style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "7px", padding: "5px 10px", color: "#34d399", fontSize: "12px", cursor: busy ? "default" : "pointer", fontWeight: 600, opacity: busy ? 0.5 : 1, whiteSpace: "nowrap" }}>
                              Publish
                            </button>
                          )}
                          <button disabled={busy} onClick={() => setConfirmId(blog.id!)}
                            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "7px", padding: "5px 10px", color: "#f87171", fontSize: "12px", cursor: busy ? "default" : "pointer", fontWeight: 600, opacity: busy ? 0.5 : 1 }}>
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "20px" }}>
            <button disabled={safePage === 1} onClick={() => setPage((p) => p - 1)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "7px 14px", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: safePage === 1 ? "default" : "pointer", opacity: safePage === 1 ? 0.4 : 1 }}>
              ← Prev
            </button>
            <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
              Page {safePage} of {totalPages}
            </span>
            <button disabled={safePage === totalPages} onClick={() => setPage((p) => p + 1)}
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "7px 14px", color: "rgba(255,255,255,0.6)", fontSize: "13px", cursor: safePage === totalPages ? "default" : "pointer", opacity: safePage === totalPages ? 0.4 : 1 }}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
          <div style={{ background: "#0B1929", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "20px", padding: "32px", maxWidth: "420px", width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "40px", marginBottom: "14px" }}>⚠️</div>
            <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Delete this post?</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", marginBottom: "24px" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "11px 22px", color: "rgba(255,255,255,0.65)", fontSize: "14px", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={() => doAction(confirmId, "delete")} disabled={actionId === confirmId}
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "11px 22px", color: "#f87171", fontSize: "14px", cursor: "pointer", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
                {actionId === confirmId ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
