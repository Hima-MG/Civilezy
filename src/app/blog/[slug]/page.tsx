import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { BLOGS, getBlogBySlug, type BlogSection } from "@/data/blogData";

type Props = { params: { slug: string } };

// ── generateStaticParams ──────────────────────────────────────────────────────
export function generateStaticParams() {
  return BLOGS.map((b) => ({ slug: b.slug }));
}

// ── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogBySlug(params.slug);
  if (!post) return {};

  const url = `https://civilezy.in/blog/${post.slug}`;

  return {
    title:       { absolute: `${post.title} | Civilezy` },
    description: post.description,
    keywords:    post.keywords,
    alternates:  { canonical: url },
    openGraph: {
      type:        "article",
      locale:      "en_IN",
      url,
      siteName:    "CivilEzy",
      title:       post.title,
      description: post.description,
      images: [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card:        "summary_large_image",
      title:       post.title,
      description: post.description,
      images:      ["https://civilezy.in/civilezy_logo_orange.png"],
    },
    robots: { index: true, follow: true },
  };
}

// ── Inline CTA ────────────────────────────────────────────────────────────────
function InlineCTA() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(255,98,0,0.12), rgba(255,98,0,0.05))",
        border: "1px solid rgba(255,98,0,0.25)",
        borderRadius: "16px",
        padding: "28px 28px",
        margin: "40px 0",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        flexWrap: "wrap",
      }}
    >
      <div style={{ flex: 1, minWidth: "200px" }}>
        <p style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", margin: "0 0 6px" }}>
          🎮 Practice PSC questions now
        </p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.5 }}>
          Free mock tests on CivilEzy — Kerala Civil PSC-specific, timed, with live leaderboard.
        </p>
      </div>
      <Link
        href="/game-arena"
        style={{
          display: "inline-block",
          background: "linear-gradient(135deg,#FF6200,#FF4500)",
          color: "#fff",
          padding: "11px 26px",
          borderRadius: "50px",
          fontFamily: "Nunito, sans-serif",
          fontSize: "14px",
          fontWeight: 800,
          textDecoration: "none",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Start Practice →
      </Link>
    </div>
  );
}

// ── Section renderer ──────────────────────────────────────────────────────────
function renderSection(section: BlogSection, index: number) {
  if (section.isCTA) return <InlineCTA key={index} />;

  return (
    <div key={index} style={{ marginBottom: "40px" }}>
      {section.heading && (
        <h2
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(1.25rem, 2.5vw, 1.65rem)",
            fontWeight: 700,
            color: "#fff",
            margin: "0 0 18px",
            paddingBottom: "12px",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            lineHeight: 1.25,
          }}
        >
          {section.heading}
        </h2>
      )}

      {section.body?.map((para, i) => (
        <p
          key={i}
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.72)",
            lineHeight: 1.85,
            margin: "0 0 16px",
          }}
        >
          {para}
        </p>
      ))}

      {section.list && (
        <ul style={{ margin: "8px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
          {section.list.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: "12px",
                fontFamily: "Nunito, sans-serif",
                fontSize: "0.96rem",
                color: "rgba(255,255,255,0.68)",
                lineHeight: 1.7,
              }}
            >
              <span style={{ color: "#FF6200", fontWeight: 700, flexShrink: 0, marginTop: "2px" }}>▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function BlogSlugPage({ params }: Props) {
  const post = getBlogBySlug(params.slug);
  if (!post) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline:    post.title,
    description: post.description,
    author:      { "@type": "Organization", name: "CivilEzy by Wincentre" },
    publisher: {
      "@type": "Organization",
      name: "CivilEzy",
      logo: { "@type": "ImageObject", url: "https://civilezy.in/civilezy_logo_orange.png" },
    },
    datePublished:   post.date,
    dateModified:    "2026-04-22",
    mainEntityOfPage: `https://civilezy.in/blog/${post.slug}`,
  };

  const otherPosts = BLOGS.filter((b) => b.slug !== post.slug).slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", padding: "0 0 100px" }}>

        {/* ─── ARTICLE HERO ── */}
        <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "70px 5% 56px" }}>
          <div style={{ maxWidth: "820px", margin: "0 auto" }}>

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" style={{ marginBottom: "24px", fontSize: "13px", color: "rgba(255,255,255,0.45)", display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none" }}>Blog</Link>
              <span aria-hidden="true">/</span>
              <span style={{ color: "#FF8534" }}>{post.category}</span>
            </nav>

            {/* Category badge */}
            <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: "#FF8534", marginBottom: "18px" }}>
              {post.category}
            </span>

            <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.9rem, 4.5vw, 3rem)", fontWeight: 700, lineHeight: 1.18, color: "#fff", marginBottom: "20px" }}>
              {post.title}
            </h1>

            <p style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.72, marginBottom: "28px" }}>
              {post.description}
            </p>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "13px", color: "rgba(255,255,255,0.45)" }}>
              <span>By <strong style={{ color: "rgba(255,255,255,0.7)" }}>Wincentre Expert Team</strong></span>
              <span>·</span>
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </div>

        {/* ─── ARTICLE BODY + SIDEBAR ── */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 5% 0" }} className="article-layout">

          {/* Main article */}
          <article>
            {post.content.map((section, i) => renderSection(section, i))}

            {/* Final CTA */}
            <div style={{ background: "linear-gradient(135deg, rgba(255,98,0,0.12), rgba(255,98,0,0.05))", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "18px", padding: "40px 32px", margin: "48px 0", textAlign: "center" }}>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
                Practice PSC Questions on CivilEzy Game Arena
              </h3>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.97rem", marginBottom: "26px", maxWidth: "500px", margin: "0 auto 26px", lineHeight: 1.7 }}>
                Kerala&apos;s only Civil PSC-specific mock test platform. Timed MCQs, live leaderboard, pool-mapped syllabus — free to start.
              </p>
              <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/game-arena" style={{ display: "inline-block", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "13px 32px", borderRadius: "50px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", fontFamily: "Nunito, sans-serif" }}>
                  🎮 Enter Game Arena — Free
                </Link>
                <Link href="/courses/iti" style={{ display: "inline-block", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "13px 32px", borderRadius: "50px", fontWeight: 600, fontSize: "1rem", textDecoration: "none", fontFamily: "Nunito, sans-serif" }}>
                  Explore Courses →
                </Link>
              </div>
            </div>

            {/* Internal links */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "40px" }}>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "1px" }}>
                Explore More
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  { href: "/game-arena", label: "🎮 Game Arena — Free PSC Practice", sub: "Timed MCQs · Live Leaderboard · Kerala Civil PSC-specific" },
                  { href: "/civil-psc-coaching-kerala", label: "🏛️ Civil PSC Coaching Kerala", sub: "Powered by Wincentre · 4.8⭐ · 1000+ Govt. Jobs" },
                  { href: "/pricing", label: "📚 Course Plans — ITI / Diploma / B.Tech / Surveyor", sub: "Starting ₹1,800/month · Pool-mapped syllabus" },
                ].map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "16px 20px", textDecoration: "none", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}
                  >
                    <div>
                      <div style={{ fontSize: "0.93rem", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>{l.label}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{l.sub}</div>
                    </div>
                    <span style={{ color: "#FF8534", fontSize: "1.1rem", flexShrink: 0 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside aria-label="Quick links" style={{ position: "sticky", top: "100px", alignSelf: "flex-start" }}>

            {/* Game Arena CTA */}
            <div style={{ background: "linear-gradient(135deg, #FF6200, #CC3D00)", borderRadius: "18px", padding: "28px 24px", textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "2rem", marginBottom: "10px" }}>🎮</div>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Practice Now — Free</h3>
              <p style={{ fontSize: "0.87rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.65, marginBottom: "20px" }}>Kerala PSC Civil mock tests. Live leaderboard. Real questions.</p>
              <Link href="/game-arena" style={{ display: "block", background: "#fff", color: "#FF6200", padding: "12px 20px", borderRadius: "10px", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif" }}>
                Enter Game Arena →
              </Link>
            </div>

            {/* Related posts */}
            {otherPosts.length > 0 && (
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px", marginBottom: "24px" }}>
                <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "16px" }}>Related Articles</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {otherPosts.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/blog/${p.slug}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "3px", lineHeight: 1.4 }}>{p.title}</div>
                      <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{p.category} · {p.readTime}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Course plans */}
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "24px" }}>
              <h3 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>Course Plans</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", marginBottom: "16px", lineHeight: 1.65 }}>ITI · Diploma · B.Tech · Surveyor<br />Starting ₹1,800/month</p>
              <Link href="/pricing" style={{ display: "block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", color: "#FF8534", padding: "11px 18px", borderRadius: "10px", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none", textAlign: "center" }}>
                View All Courses →
              </Link>
            </div>
          </aside>
        </div>
      </main>

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
      `}</style>
    </>
  );
}
