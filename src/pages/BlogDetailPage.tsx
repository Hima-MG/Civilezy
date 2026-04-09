import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { BLOG_POSTS, getBlogBySlug, type BlogSection } from "@/data/blogs";
import { SITE } from "@/lib/constants";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogBySlug(slug) : undefined;

  if (!post) return <Navigate to="/blog" replace />;

  const related = BLOG_POSTS.filter(p => p.slug !== post.slug).slice(0, 2);
  const postUrl = `${SITE.url}/blog/${post.slug}`;

  return (
    <div style={{ background: "#080F1E", minHeight: "100vh" }}>
      <Helmet>
        <title>{post.title} | Civilezy</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords.join(", ")} />
        <link rel="canonical" href={postUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            author: { "@type": "Organization", name: SITE.name, url: SITE.url },
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
            mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
            keywords: post.keywords.join(", "),
          })}
        </script>
      </Helmet>

      {/* Article header */}
      <div style={{
        background:"linear-gradient(180deg,#080F1E 0%,#0B1E3D 100%)",
        padding:"56px 5% 48px",
        position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", inset:0, opacity:0.03, pointerEvents:"none", backgroundImage:"linear-gradient(rgba(255,98,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,0,0.5) 1px,transparent 1px)", backgroundSize:"60px 60px" }} />

        <div style={{ maxWidth:"760px", margin:"0 auto", position:"relative", zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"20px", fontSize:"13px", color:"rgba(255,255,255,0.45)" }}>
            <Link to="/" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none" }}>Home</Link>
            <span>/</span>
            <Link to="/blog" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"none" }}>Blog</Link>
            <span>/</span>
            <span style={{ color:"#FF8534" }}>{post.category}</span>
          </div>

          {/* Category + read time */}
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"16px" }}>
            <span style={{ background:"rgba(255,98,0,0.12)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"20px", padding:"4px 14px", fontSize:"12px", fontWeight:700, color:"#FF8534" }}>
              {post.category}
            </span>
            <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.4)" }}>{post.readTime}</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(26px,4vw,46px)", fontWeight:700, lineHeight:1.15, color:"#fff", marginBottom:"16px" }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div style={{ display:"flex", alignItems:"center", gap:"16px", fontSize:"13px", color:"rgba(255,255,255,0.45)" }}>
            <span>Civilezy Editorial</span>
            <span>•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-IN", { day:"numeric", month:"long", year:"numeric" })}
            </time>
          </div>
        </div>
      </div>

      {/* Article body + sidebar */}
      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"52px 5% 80px", display:"grid", gridTemplateColumns:"1fr 320px", gap:"48px", alignItems:"start" }}
        className="blog-layout"
      >
        {/* Main content */}
        <article>
          {post.content.map((section, i) => (
            <ContentBlock key={i} section={section} />
          ))}

          {/* End-of-article CTA */}
          <div style={{
            marginTop:"56px",
            background:"linear-gradient(135deg,#1A0800,#2A1000)",
            border:"2px solid rgba(255,98,0,0.35)",
            borderRadius:"20px",
            padding:"36px 32px",
            textAlign:"center",
            boxShadow:"0 0 40px rgba(255,98,0,0.1)",
          }}>
            <div style={{ display:"flex", justifyContent:"center", gap:"20px", flexWrap:"wrap", marginBottom:"20px" }}>
              {[
                { rank:"Rank #3", name:"Arun S.", dept:"KWA AE 2024" },
                { rank:"Rank #7", name:"Meera K.", dept:"PWD Overseer 2024" },
                { rank:"Rank #12", name:"Sreejith P.", dept:"LSGD AE 2024" },
              ].map(s => (
                <div key={s.name} style={{ background:"rgba(255,184,0,0.08)", border:"1px solid rgba(255,184,0,0.2)", borderRadius:"10px", padding:"8px 14px", fontSize:"12px" }}>
                  <span style={{ color:"#FFB800", fontWeight:800 }}>{s.rank}</span>
                  <span style={{ color:"rgba(255,255,255,0.55)" }}> · {s.name} · {s.dept}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize:"32px", marginBottom:"10px" }}>🏆</div>
            <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(22px,3vw,32px)", fontWeight:700, color:"#fff", marginBottom:"10px" }}>
              Join 98+ Students Who Got Government Jobs
            </h2>
            <p style={{ fontSize:"15px", color:"rgba(255,255,255,0.65)", lineHeight:1.7, marginBottom:"24px" }}>
              This guide is just the beginning. Civilezy gives you pool-mapped content,
              smart analytics, Malayalam audio, and 100+ mock tests — everything built
              specifically for Kerala PSC Civil Engineering.
            </p>
            <div style={{ display:"flex", justifyContent:"center", gap:"14px", flexWrap:"wrap" }}>
              <a
                href="https://lms.civilezy.com/free-test"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", textDecoration:"none", padding:"14px 28px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"16px", fontWeight:800, boxShadow:"0 6px 24px rgba(255,98,0,0.4)", transition:"transform 0.2s, box-shadow 0.2s" }}
              >
                🚀 Start Free — No Sign-up
              </a>
              <Link
                to="/game-arena"
                style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(255,255,255,0.06)", color:"white", textDecoration:"none", padding:"13px 26px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"15px", fontWeight:700, border:"1px solid rgba(255,255,255,0.15)" }}
              >
                🎮 Try Game Arena
              </Link>
            </div>
            <p style={{ fontSize:"12px", color:"rgba(255,255,255,0.3)", marginTop:"14px" }}>
              ✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Kerala PSC-specific
            </p>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="blog-sidebar">
          <div style={{ background:"linear-gradient(135deg,#1A0800,#2A1000)", border:"1px solid rgba(255,98,0,0.3)", borderRadius:"18px", padding:"24px", marginBottom:"24px" }}>
            <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, marginBottom:"8px" }}>
              Ready to Rank?
            </div>
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)", lineHeight:1.6, marginBottom:"20px" }}>
              Join 5,200+ students on Civilezy. Pool-mapped content built exclusively for Kerala PSC Civil Engineering.
            </p>
            <a
              href="https://lms.civilezy.com/free-test"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:"block", textAlign:"center", background:"linear-gradient(135deg,#FF6200,#FF4500)", color:"white", textDecoration:"none", padding:"12px 16px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"14px", fontWeight:800, boxShadow:"0 4px 18px rgba(255,98,0,0.4)", marginBottom:"10px" }}
            >
              🚀 Start Free Test
            </a>
            <Link
              to="/pricing"
              style={{ display:"block", textAlign:"center", background:"transparent", color:"rgba(255,255,255,0.65)", textDecoration:"none", padding:"10px 16px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"13px", fontWeight:600, border:"1px solid rgba(255,255,255,0.15)" }}
            >
              View Course Plans →
            </Link>
          </div>

          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"18px", padding:"20px", marginBottom:"24px" }}>
            {[
              { num:"5,200+", label:"Active Students" },
              { num:"98+", label:"Rank Holders" },
              { num:"100+", label:"Mock Tests Available" },
              { num:"4.9★", label:"Average Rating" },
            ].map(s => (
              <div key={s.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.6)" }}>{s.label}</span>
                <span style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"18px", fontWeight:700, background:"linear-gradient(135deg,#FF6200,#FFB800)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{s.num}</span>
              </div>
            ))}
          </div>

          {related.length > 0 && (
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"18px", padding:"20px" }}>
              <div style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"16px", fontWeight:700, color:"#FF8534", marginBottom:"14px", letterSpacing:"0.3px" }}>
                RELATED ARTICLES
              </div>
              {related.map(r => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  style={{ display:"block", padding:"12px 0", borderBottom:"1px solid rgba(255,255,255,0.06)", textDecoration:"none" }}
                >
                  <div style={{ fontSize:"12px", color:"#FF8534", fontWeight:700, marginBottom:"4px" }}>{r.category}</div>
                  <div style={{ fontSize:"13px", color:"rgba(255,255,255,0.8)", lineHeight:1.45, fontWeight:600 }}>{r.title}</div>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-layout {
            grid-template-columns: 1fr !important;
          }
          .blog-sidebar {
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}

// Content block renderer
function ContentBlock({ section }: { section: BlogSection }) {
  const bodyColor = "rgba(255,255,255,0.85)";
  const mutedColor = "rgba(255,255,255,0.6)";

  switch (section.type) {
    case "h2":
      return (
        <h2 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(22px,3vw,30px)", fontWeight:700, color:"#fff", margin:"40px 0 14px", paddingBottom:"10px", borderBottom:"1px solid rgba(255,98,0,0.2)" }}>
          {section.text}
        </h2>
      );
    case "h3":
      return (
        <h3 style={{ fontFamily:"Rajdhani, sans-serif", fontSize:"clamp(18px,2.5vw,22px)", fontWeight:700, color:"#FF8534", margin:"28px 0 10px" }}>
          {section.text}
        </h3>
      );
    case "p":
      return (
        <p style={{ fontSize:"16px", color:bodyColor, lineHeight:1.8, margin:"0 0 20px" }}>
          {section.text}
        </p>
      );
    case "ul":
      return (
        <ul style={{ listStyle:"none", padding:0, margin:"0 0 24px", display:"flex", flexDirection:"column", gap:"10px" }}>
          {section.items?.map((item, i) => (
            <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"12px", fontSize:"15px", color:bodyColor, lineHeight:1.65 }}>
              <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"#FF6200", flexShrink:0, marginTop:"8px", display:"block" }} />
              {item}
            </li>
          ))}
        </ul>
      );
    case "tip":
      return (
        <div style={{ background:"rgba(255,184,0,0.08)", border:"1px solid rgba(255,184,0,0.25)", borderRadius:"14px", padding:"16px 20px", margin:"8px 0 24px", fontSize:"15px", color:"rgba(255,255,255,0.85)", lineHeight:1.7 }}>
          {section.text}
        </div>
      );
    case "cta-inline":
      return (
        <div style={{ background:"rgba(255,98,0,0.06)", border:"1px solid rgba(255,98,0,0.2)", borderRadius:"14px", padding:"18px 20px", margin:"8px 0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:"16px", flexWrap:"wrap" }}>
          <p style={{ fontSize:"14px", color:mutedColor, lineHeight:1.6, margin:0, flex:1 }}>
            {section.text}
          </p>
          <Link
            to={section.linkHref || "/"}
            style={{ flexShrink:0, display:"inline-flex", alignItems:"center", gap:"6px", background:"linear-gradient(135deg,#FF6200,#FF8534)", color:"white", textDecoration:"none", padding:"10px 20px", borderRadius:"50px", fontFamily:"Nunito, sans-serif", fontSize:"13px", fontWeight:800, boxShadow:"0 4px 14px rgba(255,98,0,0.35)", whiteSpace:"nowrap" }}
          >
            {section.linkText}
          </Link>
        </div>
      );
    default:
      return null;
  }
}
