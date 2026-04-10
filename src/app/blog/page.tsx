import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/data/blogs";
import BlogCard from "@/components/ui/BlogCard";
import { SITE, EXTERNAL_URLS } from "@/lib/constants";

const PAGE_URL = `${SITE.url}/blog`;

export const metadata: Metadata = {
  title:       "PSC Civil Engineering Blog — Kerala PSC Tips, Guides & Strategy",
  description: "Expert articles on Kerala PSC Civil Engineering preparation. Syllabus guides, exam strategies, KWA AE tips, and more for ITI, Diploma and AE candidates.",
  keywords: [
    "Kerala PSC Civil Engineering blog",
    "PSC AE preparation tips",
    "Diploma Civil PSC guide",
    "ITI Civil PSC strategy",
    "Kerala PSC exam tips 2025",
  ],
  authors:     [{ name: SITE.name, url: SITE.url }],
  metadataBase: new URL(SITE.url),
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title:       "PSC Civil Engineering Blog | CivilEzy",
    description: "Expert guides for Kerala PSC Civil Engineering aspirants.",
    url:         PAGE_URL,
    siteName:    SITE.name,
    type:        "website",
    locale:      "en_IN",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "PSC Civil Engineering Blog | CivilEzy",
    description: "Expert guides for Kerala PSC Civil Engineering aspirants.",
    site:        "@civilezy",
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function BlogListPage() {
  return (
    <div style={{ background: "#080F1E", minHeight: "100vh" }}>

      {/* ── Page Hero ──────────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(180deg,#080F1E 0%,#0B1E3D 100%)",
        padding: "64px 5% 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Grid texture */}
        <div style={{
          position:"absolute", inset:0, opacity:0.03, pointerEvents:"none",
          backgroundImage:"linear-gradient(rgba(255,98,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,0,0.5) 1px,transparent 1px)",
          backgroundSize:"60px 60px",
        }} />

        <div style={{ maxWidth:"700px", margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{ display:"inline-block", background:"rgba(255,98,0,0.15)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 16px", fontSize:"12px", fontWeight:700, color:"#FF8534", letterSpacing:"0.5px", marginBottom:"16px" }}>
            PSC PREPARATION BLOG
          </div>
          <h1 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(30px,5vw,52px)", fontWeight:700, lineHeight:1.1, color:"#fff", marginBottom:"16px" }}>
            Kerala PSC Civil Engineering{" "}
            <span style={{ background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Guides & Strategies
            </span>
          </h1>
          <p style={{ fontSize:"17px", color:"rgba(255,255,255,0.7)", lineHeight:1.7, margin:0 }}>
            Syllabus breakdowns, exam strategies, and insider tips to help you
            rank in Kerala PSC Civil Engineering — ITI, Diploma, and AE level.
          </p>
        </div>
      </div>

      {/* ── Blog card grid ─────────────────────────────────────────── */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"60px 5% 80px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:"28px" }}>
          {BLOG_POSTS.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* ── Bottom CTA ──────────────────────────────────────────── */}
        <div style={{
          marginTop:"60px", textAlign:"center",
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,98,0,0.2)",
          borderRadius:"20px", padding:"40px 24px",
        }}>
          <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(22px,3vw,34px)", fontWeight:700, color:"#fff", marginBottom:"12px" }}>
            Ready to Start Preparing?
          </h2>
          <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.6)", marginBottom:"24px" }}>
            Reading guides is good. Practising with real PSC questions is better.
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:"14px", flexWrap:"wrap" }}>
            <a
              href={EXTERNAL_URLS.freeTest}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:800, boxShadow:"0 6px 24px rgba(255,98,0,0.4)" }}
            >
              🚀 Sign Up for 48 Hr Free Demo
            </a>
            <Link
              href="/game-arena"
              style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"transparent", color:"white", textDecoration:"none", padding:"13px 26px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"15px", fontWeight:700, border:"2px solid rgba(255,255,255,0.2)" }}
            >
              🎮 Try Game Arena
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}