"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getFeaturedEbooks } from "@/lib/ebooks";
import type { Ebook } from "@/types/ebook";
import EbookCard from "@/components/ebooks/EbookCard";

export default function FeaturedEbooks() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedEbooks()
      .then((data) => setEbooks(data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!loading && ebooks.length === 0) return null;

  return (
    <section style={{
      padding: "80px 20px",
      background: "linear-gradient(180deg, #020817 0%, #04152d 50%, #020817 100%)",
      fontFamily: "Nunito, sans-serif",
    }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px",
          marginBottom: "40px",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgba(255,98,0,0.12)",
              border: "1px solid rgba(255,98,0,0.25)",
              borderRadius: "20px", padding: "5px 14px",
              marginBottom: "12px",
            }}>
              <span style={{ fontSize: "13px" }}>📚</span>
              <span style={{
                fontSize: "11px", fontWeight: 700, color: "#FF8534",
                fontFamily: "Rajdhani, sans-serif",
                letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                E-Book Marketplace
              </span>
            </div>

            <h2 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700, color: "#fff",
              margin: "0 0 8px", lineHeight: 1.1,
            }}>
              Quick Revision{" "}
              <span style={{ color: "#FF8534" }}>E-Books</span>
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              Smart Revision. Better Results.
            </p>
          </div>

          <Link
            href="/ebooks"
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "11px 22px",
              background: "rgba(255,98,0,0.12)",
              border: "1px solid rgba(255,98,0,0.3)",
              borderRadius: "12px",
              color: "#FF8534", fontSize: "14px", fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              transition: "all 0.2s",
              whiteSpace: "nowrap",
            }}
          >
            View All E-Books →
          </Link>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "20px",
                height: "380px",
                animation: "pulse 1.5s ease-in-out infinite",
              }} />
            ))}
          </div>
        )}

        {/* Cards */}
        {!loading && ebooks.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "24px",
          }}>
            {ebooks.map((ebook) => (
              <EbookCard key={ebook.id} ebook={ebook} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        {!loading && ebooks.length > 0 && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link
              href="/ebooks"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                padding: "14px 32px",
                background: "linear-gradient(135deg, #FF6200, #FF8534)",
                borderRadius: "14px",
                color: "#fff", fontSize: "15px", fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Nunito, sans-serif",
                boxShadow: "0 6px 28px rgba(255,98,0,0.35)",
              }}
            >
              <span>📚</span> Browse All E-Books
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
