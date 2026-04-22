import type { Metadata } from "next";
import Link from "next/link";
import { BLOGS } from "@/data/blogData";

export const metadata: Metadata = {
  title: { absolute: "Civil PSC Engineering Blog | Civilezy" },
  description:
    "Kerala PSC Civil Engineering preparation blog — study tips, syllabus guides, question banks, mock test strategies, and book recommendations for ITI, Diploma and B.Tech aspirants.",
  keywords: [
    "kerala psc civil engineering blog",
    "civil psc preparation guides kerala",
    "kerala psc civil engineering articles",
    "psc civil study resources kerala",
    "civil engineering psc tips 2025",
  ],
  alternates: { canonical: "https://civilezy.in/blog" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://civilezy.in/blog",
    siteName: "CivilEzy",
    title: "Civil PSC Engineering Blog | Civilezy",
    description:
      "Expert preparation guides for Kerala PSC Civil Engineering. Written by Wincentre – 4.8⭐, 445+ reviews, 1000+ govt job selections.",
  },
  robots: { index: true, follow: true },
};

const CATEGORY_COLOR: Record<string, { bg: string; border: string; text: string }> = {
  "Preparation Strategy": { bg: "rgba(255,98,0,0.1)",    border: "rgba(255,98,0,0.3)",    text: "#FF8534"  },
  "Question Bank":        { bg: "rgba(76,155,240,0.1)",  border: "rgba(76,155,240,0.3)",  text: "#4C9BF0"  },
  "Resources":            { bg: "rgba(50,200,100,0.1)",  border: "rgba(50,200,100,0.3)",  text: "#32C864"  },
  "Mock Tests":           { bg: "rgba(255,184,0,0.1)",   border: "rgba(255,184,0,0.3)",   text: "#FFB800"  },
  "Syllabus":             { bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.3)",  text: "#A855F7"  },
};

export default function BlogIndexPage() {
  const featured = BLOGS[0];
  const rest     = BLOGS.slice(1);

  return (
    <main style={{ background: "var(--navy)", color: "#fff", minHeight: "100vh", padding: "0 0 80px" }}>

      {/* ─── HEADER ── */}
      <div style={{ background: "linear-gradient(160deg, #040C18 0%, #0B1E3D 100%)", padding: "72px 5% 60px", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: "#FF8534", marginBottom: "20px" }}>
            By Wincentre Experts
          </span>
          <h1 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(2rem, 4.5vw, 3rem)", fontWeight: 700, color: "#fff", lineHeight: 1.18, marginBottom: "16px" }}>
            Kerala PSC Civil Engineering{" "}
            <span style={{ color: "#FF6200" }}>Blog & Guides</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.72 }}>
            Expert preparation guides written by Wincentre – 4.8⭐ rated institute with 445+ reviews and 1000+ government job selections across Kerala.
          </p>
        </div>
      </div>

      {/* ─── POSTS ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "64px 5% 0" }}>

        {/* Featured post */}
        {(() => {
          const cat = CATEGORY_COLOR[featured.category] ?? CATEGORY_COLOR["Preparation Strategy"];
          return (
            <Link
              href={`/blog/${featured.slug}`}
              style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "32px", alignItems: "center", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,98,0,0.2)", borderRadius: "20px", padding: "36px 32px", textDecoration: "none", marginBottom: "32px" }}
              className="featured-card"
            >
              <div>
                <div style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: cat.text }}>
                    {featured.category}
                  </span>
                  <span style={{ fontSize: "12px", background: "rgba(255,98,0,0.08)", padding: "4px 12px", borderRadius: "100px", border: "1px solid rgba(255,98,0,0.15)", color: "#FF8534", fontWeight: 600 }}>
                    Featured
                  </span>
                </div>
                <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.3rem, 2.8vw, 1.85rem)", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.28 }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize: "0.97rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.72, marginBottom: "20px" }}>{featured.excerpt}</p>
                <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                  <span>{featured.date}</span>
                  <span>·</span>
                  <span>{featured.readTime}</span>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  🎯
                </div>
                <span style={{ fontSize: "13px", color: "#FF8534", fontWeight: 700 }}>Read →</span>
              </div>
            </Link>
          );
        })()}

        {/* Other posts grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "60px" }}>
          {rest.map((post) => {
            const cat = CATEGORY_COLOR[post.category] ?? CATEGORY_COLOR["Preparation Strategy"];
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-card"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "18px", padding: "28px 24px", textDecoration: "none", display: "flex", flexDirection: "column", transition: "border-color 0.2s, transform 0.2s" }}
              >
                <span style={{ display: "inline-block", background: cat.bg, border: `1px solid ${cat.border}`, borderRadius: "100px", padding: "4px 14px", fontSize: "12px", fontWeight: 600, color: cat.text, marginBottom: "16px", alignSelf: "flex-start" }}>
                  {post.category}
                </span>
                <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.32, flex: 1 }}>
                  {post.title}
                </h2>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.58)", lineHeight: 1.7, marginBottom: "20px" }}>{post.excerpt}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px" }}>
                  <span style={{ color: "rgba(255,255,255,0.35)" }}>{post.date} · {post.readTime}</span>
                  <span style={{ color: "#FF8534", fontWeight: 700 }}>Read →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Game Arena CTA */}
        <div style={{ background: "linear-gradient(135deg, rgba(255,98,0,0.12), rgba(255,98,0,0.06))", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "20px", padding: "44px 40px", textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "14px" }}>🎮</div>
          <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 700, color: "#fff", marginBottom: "14px" }}>
            Stop Reading, Start Practicing
          </h2>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", marginBottom: "28px", maxWidth: "540px", margin: "0 auto 28px", lineHeight: 1.72 }}>
            Knowledge only converts to marks when you practice under exam conditions. CivilEzy&apos;s Game Arena gives you timed MCQs, instant feedback, and a live leaderboard — free.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/game-arena" style={{ display: "inline-block", background: "linear-gradient(135deg, #FF6200, #FF8534)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 700, fontSize: "1rem", textDecoration: "none", fontFamily: "Rajdhani, sans-serif" }}>
              Enter Game Arena →
            </Link>
            <Link href="/civil-psc-coaching-kerala" style={{ display: "inline-block", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", padding: "14px 34px", borderRadius: "10px", fontWeight: 600, fontSize: "1rem", textDecoration: "none" }}>
              About CivilEzy
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        .featured-card:hover { border-color: rgba(255,98,0,0.4) !important; }
        .blog-card:hover { border-color: rgba(255,98,0,0.3) !important; transform: translateY(-3px); }
      `}</style>
    </main>
  );
}
