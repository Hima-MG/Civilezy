import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/sections/Footer";
import { getPublishedBlogsAdmin, getFeaturedBlogsAdmin } from "@/lib/blog-admin";
import { BLOG_CATEGORIES, getCategoryMeta } from "@/types/blog";
import type { Blog } from "@/types/blog";

export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "Civil Engineering Blog | Civilezy — Exam Prep & PSC Insights" },
  description:
    "Expert guides on Kerala PSC AE, BTech engineering, exam preparation, career guidance, and civil engineering topics. Written by Wincentre experts.",
  keywords: [
    "civil engineering blog kerala",
    "kerala psc ae blog",
    "civil engineering exam preparation",
    "psc civil engineering tips",
    "kerala psc coaching blog",
  ],
  alternates: { canonical: "https://civilezy.in/blogs" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://civilezy.in/blogs",
    siteName: "CivilEzy",
    title: "Civil Engineering Blog | Civilezy",
    description: "Expert civil engineering insights and exam preparation guides for Kerala PSC aspirants.",
    images: [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630 }],
  },
};

function BlogCard({ blog }: { blog: Blog }) {
  const meta = getCategoryMeta(blog.category);
  const date = blog.publishedAt
    ? (() => { try { return (blog.publishedAt as unknown as { toDate(): Date }).toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } })()
    : "";

  return (
    <Link
      href={`/blogs/${blog.slug}`}
      style={{ textDecoration: "none", display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "18px", overflow: "hidden", transition: "border-color 0.2s, transform 0.2s" }}
      className="blog-card"
    >
      {/* Featured image */}
      <div style={{ aspectRatio: "16/9", background: "rgba(255,255,255,0.04)", position: "relative", overflow: "hidden" }}>
        {blog.featuredImage ? (
          <Image src={blog.featuredImage} alt={blog.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0B1E3D, #060D1A)", fontSize: "48px" }}>
            📝
          </div>
        )}
        {blog.isFeatured && (
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "linear-gradient(135deg,#FF6200,#FF8534)", borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, color: "#fff" }}>
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px 22px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "12px", flexWrap: "wrap" }}>
          <span style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`, borderRadius: "20px", padding: "3px 10px", fontSize: "11px", fontWeight: 700, whiteSpace: "nowrap" }}>
            {blog.category}
          </span>
          {blog.readingTime > 0 && (
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
              {blog.readingTime} min read
            </span>
          )}
        </div>

        <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "18px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "10px", flex: 1 }}>
          {blog.title}
        </h3>

        {blog.excerpt && (
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, marginBottom: "16px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
            {blog.excerpt}
          </p>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "14px", marginTop: "auto" }}>
          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
            <span>{blog.authorName || "Civilezy Team"}</span>
            {date && <span style={{ margin: "0 6px" }}>·</span>}
            {date && <span>{date}</span>}
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#FF8534" }}>Read →</span>
        </div>
      </div>
    </Link>
  );
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const [allBlogs, featuredBlogs] = await Promise.all([
    getPublishedBlogsAdmin(48),
    getFeaturedBlogsAdmin(1),
  ]);

  const activeCategory = searchParams.category ?? "";
  const displayed = activeCategory
    ? allBlogs.filter((b) => b.category === activeCategory)
    : allBlogs;

  const heroFeatured = featuredBlogs[0] ?? allBlogs[0];
  const gridBlogs = displayed.filter((b) => b.id !== heroFeatured?.id);

  return (
    <>
      <main style={{ background: "#040C18", color: "#fff", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <section style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 55%, #060D1A 100%)", padding: "80px 5% 60px" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

            {/* Badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "5px 16px", marginBottom: "22px" }}>
              <span style={{ fontSize: "14px" }}>📰</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#FF8534", letterSpacing: "0.5px" }}>CIVILEZY BLOG</span>
            </div>

            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", fontWeight: 700, lineHeight: 1.15, marginBottom: "16px", maxWidth: "700px" }}>
              Civil Engineering Insights &{" "}
              <span style={{ background: "linear-gradient(135deg, #FF6200, #FFB800)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                Exam Preparation
              </span>
            </h1>
            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.72, maxWidth: "620px", marginBottom: "32px" }}>
              Tips, career guidance, AE coaching strategies, BTech resources, and civil engineering updates — written by Wincentre experts with 1000+ govt job selections.
            </p>

            {/* Category pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Link
                href="/blogs"
                style={{
                  padding: "7px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s",
                  background: !activeCategory ? "rgba(255,98,0,0.18)" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${!activeCategory ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                  color: !activeCategory ? "#FF8534" : "rgba(255,255,255,0.6)",
                }}
              >
                All Posts
              </Link>
              {BLOG_CATEGORIES.map((cat) => {
                const m = getCategoryMeta(cat);
                const active = activeCategory === cat;
                return (
                  <Link
                    key={cat}
                    href={`/blogs?category=${encodeURIComponent(cat)}`}
                    style={{
                      padding: "7px 18px", borderRadius: "100px", fontSize: "13px", fontWeight: 600,
                      textDecoration: "none", transition: "all 0.2s",
                      background: active ? m.bg : "rgba(255,255,255,0.05)",
                      border: `1px solid ${active ? m.border : "rgba(255,255,255,0.1)"}`,
                      color: active ? m.color : "rgba(255,255,255,0.6)",
                    }}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 5% 80px" }}>

          {/* ── Featured post ── */}
          {!activeCategory && heroFeatured && (
            <section style={{ margin: "52px 0 48px" }}>
              <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
                Featured Post
              </h2>
              <Link
                href={`/blogs/${heroFeatured.slug}`}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px", overflow: "hidden", textDecoration: "none", transition: "border-color 0.2s" }}
                className="featured-post-card"
              >
                <div style={{ position: "relative", minHeight: "280px", background: "linear-gradient(135deg, #0B1E3D, #060D1A)" }}>
                  {heroFeatured.featuredImage ? (
                    <Image src={heroFeatured.featuredImage} alt={heroFeatured.title} fill style={{ objectFit: "cover" }} sizes="50vw" />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "64px" }}>📝</div>
                  )}
                </div>
                <div style={{ padding: "36px 32px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  {(() => {
                    const m = getCategoryMeta(heroFeatured.category);
                    const date = heroFeatured.publishedAt ? (() => { try { return (heroFeatured.publishedAt as unknown as { toDate(): Date }).toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }); } catch { return ""; } })() : "";
                    return (
                      <>
                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                          <span style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}`, borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700 }}>{heroFeatured.category}</span>
                          {heroFeatured.readingTime > 0 && <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>{heroFeatured.readingTime} min read</span>}
                        </div>
                        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.25, marginBottom: "14px" }}>{heroFeatured.title}</h2>
                        {heroFeatured.excerpt && <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.72, marginBottom: "24px" }}>{heroFeatured.excerpt}</p>}
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>{heroFeatured.authorName || "Civilezy Team"}{date ? ` · ${date}` : ""}</span>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#FF8534", marginLeft: "auto" }}>Read post →</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </Link>
            </section>
          )}

          {/* ── Grid ── */}
          <section>
            {activeCategory && (
              <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "24px" }}>
                {activeCategory} <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "16px", fontWeight: 400 }}>({displayed.length})</span>
              </h2>
            )}
            {!activeCategory && (
              <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>
                Latest Posts
              </h2>
            )}

            {gridBlogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px" }}>
                  {activeCategory ? `No posts in "${activeCategory}" yet.` : "No blog posts published yet. Check back soon!"}
                </p>
                <Link href="/blogs" style={{ display: "inline-block", marginTop: "16px", color: "#FF8534", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}>← View all posts</Link>
              </div>
            ) : (
              <div className="blogs-grid">
                {gridBlogs.map((blog) => <BlogCard key={blog.id} blog={blog} />)}
              </div>
            )}
          </section>

          {/* ── Game Arena CTA ── */}
          <div style={{ background: "linear-gradient(135deg, rgba(255,98,0,0.1), rgba(255,98,0,0.04))", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "20px", padding: "40px 36px", textAlign: "center", marginTop: "60px" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🎮</div>
            <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
              Stop Reading, Start Practicing
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
              Knowledge converts to marks only with practice. CivilEzy&apos;s Game Arena gives you timed MCQs, instant feedback, and a live leaderboard — free.
            </p>
            <Link href="/game-arena" style={{ display: "inline-block", background: "linear-gradient(135deg,#FF6200,#FF8534)", color: "#fff", padding: "14px 36px", borderRadius: "50px", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}>
              Enter Game Arena →
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        .blogs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .blog-card:hover { border-color: rgba(255,98,0,0.3) !important; transform: translateY(-4px); }
        .featured-post-card:hover { border-color: rgba(255,98,0,0.3) !important; }
        @media (max-width: 1024px) { .blogs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 768px) {
          .blogs-grid { grid-template-columns: 1fr; }
          .featured-post-card { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
