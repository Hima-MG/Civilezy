"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBlogById } from "@/lib/blog";
import BlogForm from "@/components/admin/blog/BlogForm";
import type { Blog } from "@/types/blog";

export default function AdminBlogEditPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog]     = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    if (!id) return;
    getBlogById(id)
      .then((b) => {
        if (!b) setError("Blog post not found.");
        else setBlog(b);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load post"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)", fontFamily: "Nunito, sans-serif" }}>
      Loading post…
    </div>
  );

  if (error || !blog) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px" }}>
      <div style={{ fontSize: "40px" }}>❌</div>
      <p style={{ color: "#f87171", fontFamily: "Nunito, sans-serif" }}>{error || "Post not found"}</p>
    </div>
  );

  return <BlogForm mode="edit" initial={blog} />;
}
