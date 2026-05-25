"use client";

import { useEffect } from "react";
import { incrementViews } from "@/lib/blog";

export default function ViewCounter({ blogId }: { blogId: string }) {
  useEffect(() => {
    if (!blogId) return;
    const key = `viewed_${blogId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    incrementViews(blogId).catch(() => {});
  }, [blogId]);

  return null;
}
