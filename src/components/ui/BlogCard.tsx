
import { Link } from "react-router-dom";
import type { BlogPost } from "@/data/blogs";

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <article
      style={{
        background:    "rgba(255,255,255,0.04)",
        border:        "1px solid rgba(255,255,255,0.08)",
        borderRadius:  "20px",
        overflow:      "hidden",
        transition:    "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
        display:       "flex",
        flexDirection: "column",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget;
        el.style.transform   = "translateY(-6px)";
        el.style.borderColor = "rgba(255,98,0,0.3)";
        el.style.boxShadow   = "0 12px 40px rgba(255,98,0,0.1)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget;
        el.style.transform   = "translateY(0)";
        el.style.borderColor = "rgba(255,255,255,0.08)";
        el.style.boxShadow   = "none";
      }}
    >
      {/* Category + read time */}
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ background: "rgba(255,98,0,0.12)", border: "1px solid rgba(255,98,0,0.25)", borderRadius: "20px", padding: "3px 12px", fontSize: "11px", fontWeight: 700, color: "#FF8534" }}>
          {post.category}
        </span>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
          {post.readTime}
        </span>
      </div>

      {/* Title + description */}
      <div style={{ padding: "14px 24px 20px", flex: 1 }}>
        <h2 style={{ fontFamily: "Rajdhani, sans-serif", fontSize: "20px", fontWeight: 700, lineHeight: 1.25, marginBottom: "10px", color: "#fff" }}>
          {post.title}
        </h2>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.65, margin: 0 }}>
          {post.description}
        </p>
      </div>

      {/* Footer */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
          {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </span>
        <Link
          to={`/blog/${post.slug}`}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "linear-gradient(135deg,#FF6200,#FF8534)",
            color: "white", textDecoration: "none",
            padding: "8px 18px", borderRadius: "50px",
            fontSize: "13px", fontWeight: 700,
            boxShadow: "0 4px 14px rgba(255,98,0,0.35)",
          }}
        >
          Read More →
        </Link>
      </div>
    </article>
  );
}