import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Footer from "@/components/sections/Footer";
import {
  getBlogBySlugAdmin,
  getRelatedBlogsAdmin,
  getAllPublishedSlugsAdmin,
} from "@/lib/blog-admin";
import { markdownToHtml, extractTOC } from "@/lib/markdownToHtml";
import { getCategoryMeta } from "@/types/blog";
import type { Blog } from "@/types/blog";
import ViewCounter from "./ViewCounter";

export const revalidate = 60;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugsAdmin();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogBySlugAdmin(params.slug);
  if (!post) return {};
  const url = `https://civilezy.in/blogs/${post.slug}`;
  return {
    title: { absolute: `${post.seoTitle || post.title} | Civilezy Blog` },
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "en_IN",
      url,
      siteName: "CivilEzy",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage
        ? [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }]
        : [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : ["https://civilezy.in/civilezy_logo_orange.png"],
    },
  };
}

function RelatedCard({ blog }: { blog: Blog }) {
  const m = getCategoryMeta(blog.category);
  return (
    <Link href={`/blogs/${blog.slug}`} style={{ textDecoration: "none", display: "flex", gap: "12px", padding: "14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", transition: "border-color 0.2s" }} className="related-card">
      <div style={{ width: "64px", height: "48px", flexShrink: 0, borderRadius: "8px", overflow: "hidden", background: "rgba(255,255,255,0.06)", position: "relative" }}>
        {blog.featuredImage ? (
          <Image src={blog.featuredImage} alt={blog.title} fill style={{ objectFit: "cover" }} sizes="64px" />
        ) : (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>📝</div>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}`, borderRadius: "20px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, display: "inline-block", marginBottom: "5px" }}>{blog.category}</span>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#fff", lineHeight: 1.35, margin: 0, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{blog.title}</p>
      </div>
    </Link>
  );
}

export default async function BlogDetailPage({ params }: Props) {
  const post = await getBlogBySlugAdmin(params.slug);
  if (!post) notFound();

  const [related] = await Promise.all([
    getRelatedBlogsAdmin(post.category, post.id!, 3),
  ]);

  const htmlContent = markdownToHtml(post.content);
  const toc = extractTOC(post.content);
  const catMeta = getCategoryMeta(post.category);

  const date = post.publishedAt
    ? (() => { try { return (post.publishedAt as unknown as { toDate(): Date }).toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }); } catch { return ""; } })()
    : "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seoDescription || post.excerpt,
    image: post.featuredImage || "https://civilezy.in/civilezy_logo_orange.png",
    author: { "@type": "Organization", name: post.authorName || "CivilEzy" },
    publisher: {
      "@type": "Organization",
      name: "CivilEzy",
      logo: { "@type": "ImageObject", url: "https://civilezy.in/civilezy_logo_orange.png" },
    },
    datePublished: date,
    dateModified: date,
    mainEntityOfPage: `https://civilezy.in/blogs/${post.slug}`,
    keywords: post.tags?.join(", "),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ViewCounter blogId={post.id!} />

      <main style={{ background: "#040C18", color: "#fff", minHeight: "100vh" }}>

        {/* ── Hero ── */}
        <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "60px 5% 48px" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "24px", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
              <span>/</span>
              <Link href="/blogs" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Blog</Link>
              <span>/</span>
              <span style={{ color: "#FF8534" }}>{post.category}</span>
            </nav>

            <span style={{ background: catMeta.bg, color: catMeta.color, border: `1px solid ${catMeta.border}`, borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, display: "inline-block", marginBottom: "18px" }}>
              {post.category}
            </span>

            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.8rem, 4.5vw, 2.8rem)", fontWeight: 700, lineHeight: 1.18, color: "#fff", marginBottom: "18px" }}>
              {post.title}
            </h1>

            {post.excerpt && (
              <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.72, marginBottom: "24px" }}>
                {post.excerpt}
              </p>
            )}

            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "rgba(255,255,255,0.45)", alignItems: "center" }}>
              <span>By <strong style={{ color: "rgba(255,255,255,0.7)" }}>{post.authorName || "Civilezy Team"}</strong></span>
              {date && <><span>·</span><span>{date}</span></>}
              {post.readingTime > 0 && <><span>·</span><span>{post.readingTime} min read</span></>}
              <span>·</span>
              <span>👁 {post.views ?? 0} views</span>
            </div>

            {/* Tags */}
            {post.tags?.length > 0 && (
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "18px" }}>
                {post.tags.map((tag) => (
                  <span key={tag} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "20px", padding: "3px 12px", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Featured image ── */}
        {post.featuredImage && (
          <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 5%" }}>
            <div style={{ borderRadius: "16px", overflow: "hidden", aspectRatio: "16/9", position: "relative", marginTop: "-20px" }}>
              <Image src={post.featuredImage} alt={post.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 860px) 100vw, 860px" priority />
            </div>
          </div>
        )}

        {/* ── Article + Sidebar ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "52px 5% 80px" }} className="article-layout">

          {/* Article */}
          <article>
            <div
              className="blog-article-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Share */}
            <div style={{ marginTop: "48px", padding: "24px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px" }}>
              <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>Share this post</p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { label: "WhatsApp", bg: "rgba(37,211,102,0.12)", color: "#25D366", border: "rgba(37,211,102,0.25)", href: `https://wa.me/?text=${encodeURIComponent(post.title + " https://civilezy.in/blogs/" + post.slug)}` },
                  { label: "Telegram", bg: "rgba(0,136,204,0.12)", color: "#0088cc", border: "rgba(0,136,204,0.25)", href: `https://t.me/share/url?url=${encodeURIComponent("https://civilezy.in/blogs/" + post.slug)}&text=${encodeURIComponent(post.title)}` },
                  { label: "Twitter/X", bg: "rgba(255,255,255,0.06)", color: "#e2e8f0", border: "rgba(255,255,255,0.15)", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent("https://civilezy.in/blogs/" + post.slug)}` },
                ].map((s) => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div style={{ marginTop: "48px" }}>
                <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "18px" }}>Related Articles</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {related.map((r) => <RelatedCard key={r.id} blog={r} />)}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside style={{ position: "sticky", top: "90px", alignSelf: "flex-start" }}>

            {/* TOC */}
            {toc.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "22px", marginBottom: "20px" }}>
                <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: "14px" }}>Contents</p>
                <nav aria-label="Table of contents">
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
                    {toc.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          style={{
                            display: "block",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.55)",
                            textDecoration: "none",
                            lineHeight: 1.45,
                            paddingLeft: item.level > 1 ? `${(item.level - 1) * 12}px` : "0",
                            paddingBottom: "4px",
                            borderLeft: item.level === 1 ? "2px solid rgba(255,133,52,0.4)" : item.level === 2 ? "2px solid rgba(255,255,255,0.1)" : "none",
                            paddingLeft2: "8px",
                          } as React.CSSProperties}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            )}

            {/* Game Arena CTA */}
            <div style={{ background: "linear-gradient(135deg,#FF6200,#CC3D00)", borderRadius: "16px", padding: "24px", textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🎮</div>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.1rem", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>Practice Now — Free</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.82)", lineHeight: 1.65, marginBottom: "16px" }}>Kerala PSC Civil mock tests. Live leaderboard. Real questions.</p>
              <Link href="/game-arena" style={{ display: "block", background: "#fff", color: "#FF6200", padding: "11px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "14px", textDecoration: "none" }}>
                Enter Game Arena →
              </Link>
            </div>

            {/* Course CTA */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "22px" }}>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>Course Plans</h3>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, marginBottom: "16px" }}>ITI · Diploma · B.Tech · Surveyor<br />Starting ₹1,800/month</p>
              <Link href="/pricing" style={{ display: "block", background: "rgba(255,98,0,0.1)", border: "1px solid rgba(255,98,0,0.2)", color: "#FF8534", padding: "10px 16px", borderRadius: "10px", fontWeight: 600, fontSize: "13px", textDecoration: "none", textAlign: "center" }}>
                View Plans →
              </Link>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      <style>{`
        .article-layout {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 60px;
          align-items: flex-start;
        }
        @media (max-width: 1024px) {
          .article-layout { grid-template-columns: 1fr; }
          aside { position: static !important; }
        }
        .related-card:hover { border-color: rgba(255,98,0,0.3) !important; }

        /* ─── Article content styles ─────────────────────────────── */
        .blog-article-content {
          color: rgba(255,255,255,0.82);
          font-family: "Nunito", sans-serif;
          font-size: 1rem;
          line-height: 1.88;
        }
        .blog-article-content .md-h1 {
          font-family: "Rajdhani", sans-serif; font-size: 2rem; font-weight: 700;
          color: #fff; margin: 40px 0 18px; padding-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .blog-article-content .md-h2 {
          font-family: "Rajdhani", sans-serif; font-size: 1.6rem; font-weight: 700;
          color: #fff; margin: 36px 0 16px;
        }
        .blog-article-content .md-h3 {
          font-family: "Rajdhani", sans-serif; font-size: 1.25rem; font-weight: 700;
          color: #e2e8f0; margin: 28px 0 12px;
        }
        .blog-article-content .md-h4 {
          font-family: "Rajdhani", sans-serif; font-size: 1.05rem; font-weight: 700;
          color: #e2e8f0; margin: 22px 0 10px;
        }
        .blog-article-content .md-p { margin: 0 0 18px; }
        .blog-article-content .md-blockquote {
          border-left: 4px solid #FF8534; margin: 28px 0; padding: 16px 24px;
          background: rgba(255,133,52,0.06); border-radius: 0 12px 12px 0;
          color: rgba(255,255,255,0.75); font-style: italic;
        }
        .blog-article-content .md-blockquote p { margin: 0; }
        .blog-article-content .md-pre {
          background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 20px 24px; overflow-x: auto; margin: 20px 0;
        }
        .blog-article-content .md-pre code { font-family: "Fira Code", "Courier New", monospace; font-size: 13.5px; color: #a3e635; line-height: 1.75; }
        .blog-article-content .md-code {
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px; padding: 2px 7px;
          font-family: "Fira Code", monospace; font-size: 13px; color: #60a5fa;
        }
        .blog-article-content .md-ul, .blog-article-content .md-ol {
          margin: 14px 0 18px 24px; display: flex; flex-direction: column; gap: 8px;
        }
        .blog-article-content .md-ul li::marker { color: #FF8534; }
        .blog-article-content .md-ol li::marker { color: #FF8534; font-weight: 700; }
        .blog-article-content .md-hr {
          border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 36px 0;
        }
        .blog-article-content .md-link { color: #FF8534; text-decoration: underline; text-underline-offset: 3px; }
        .blog-article-content .md-link:hover { color: #FFB800; }
        .blog-article-content .md-img {
          max-width: 100%; border-radius: 12px; margin: 24px 0; display: block;
          border: 1px solid rgba(255,255,255,0.08);
        }
      `}</style>
    </>
  );
}
