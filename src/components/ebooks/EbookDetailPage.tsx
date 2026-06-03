"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEbookBySlug } from "@/lib/ebooks";
import type { Ebook } from "@/types/ebook";
import OfferCard from "./OfferCard";

interface Props {
  slug: string;
}

export default function EbookDetailPage({ slug }: Props) {
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    getEbookBySlug(slug)
      .then((data) => {
        if (!data) setNotFound(true);
        else setEbook(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingState />;
  if (notFound || !ebook) return <NotFoundState />;

  return <EbookContent ebook={ebook} />;
}

// ── Loading ───────────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020817",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Nunito, sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "44px", height: "44px",
          border: "3px solid rgba(255,98,0,0.2)",
          borderTopColor: "#FF6200",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Loading e-book…
        </p>
      </div>
    </div>
  );
}

// ── Not found ─────────────────────────────────────────────────────────────────

function NotFoundState() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#020817",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "Nunito, sans-serif", padding: "40px 20px",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>📭</div>
        <h1 style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "28px", fontWeight: 700, color: "#fff", margin: "0 0 10px",
        }}>
          E-Book Not Found
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", margin: "0 0 24px" }}>
          This e-book may have been removed or the link is incorrect.
        </p>
        <Link href="/ebooks" style={{
          display: "inline-block",
          padding: "11px 28px",
          background: "linear-gradient(135deg, #FF6200, #FF8534)",
          borderRadius: "12px", color: "#fff",
          fontSize: "14px", fontWeight: 700,
          textDecoration: "none", fontFamily: "Nunito, sans-serif",
        }}>
          Browse All E-Books →
        </Link>
      </div>
    </div>
  );
}

// ── Main content ──────────────────────────────────────────────────────────────

function EbookContent({ ebook }: { ebook: Ebook }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #020817 0%, #04152d 40%, #020817 100%)",
      paddingBottom: "120px",
      fontFamily: "Nunito, sans-serif",
    }}>
      {/* Breadcrumb */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto", padding: "24px 20px 0",
      }}>
        <nav style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
          <Link href="/" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Home</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <Link href="/ebooks" style={{ color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>E-Books</Link>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.7)" }}>{ebook.title}</span>
        </nav>
      </div>

      {/* ── Hero section ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 20px 0" }}>
        <HeroSection ebook={ebook} />
      </div>

      {/* ── Below-fold sections ── */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>

        {/* Overview */}
        {ebook.description && (
          <Section title="Overview" icon="📋">
            <p style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.7)",
              lineHeight: 1.8,
              margin: 0,
            }}>
              {ebook.description}
            </p>
          </Section>
        )}

        {/* Modules */}
        {ebook.modules?.length > 0 && (
          <Section title="Included Modules" icon="📦">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "12px",
            }}>
              {ebook.modules.map((mod, i) => (
                <div key={i} style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "14px 16px",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <span style={{
                    width: "28px", height: "28px",
                    background: "rgba(255,98,0,0.15)",
                    border: "1px solid rgba(255,98,0,0.25)",
                    borderRadius: "8px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "11px", fontWeight: 700,
                    color: "#FF8534",
                    fontFamily: "Rajdhani, sans-serif",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                    {mod}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Features */}
        {ebook.features?.length > 0 && (
          <Section title="Features" icon="✨">
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "10px",
            }}>
              {ebook.features.map((feat, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "12px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "10px",
                }}>
                  <span style={{
                    fontSize: "14px", color: "#22c55e", flexShrink: 0,
                  }}>
                    ✓
                  </span>
                  <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Preview CTA */}
        {ebook.previewUrl && (
          <Section title="Free Preview" icon="👁️">
            <div style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "16px",
              padding: "28px 32px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap", gap: "20px",
            }}>
              <div>
                <h3 style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "20px", fontWeight: 700, color: "#fff", margin: "0 0 6px",
                }}>
                  Try Before You Buy
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  Get a free preview of the content before purchasing.
                </p>
              </div>
              <a
                href={ebook.previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "12px 28px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: "12px",
                  color: "#fff", fontSize: "14px", fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "Nunito, sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                <span>👁️</span> View Free Preview
              </a>
            </div>
          </Section>
        )}

        {/* Purchase CTA */}
        {ebook.purchaseUrl && (
          <Section title="Get This E-Book" icon="🛒">
            <div style={{
              background: "linear-gradient(135deg, rgba(255,98,0,0.12), rgba(255,133,52,0.08))",
              border: "1px solid rgba(255,98,0,0.25)",
              borderRadius: "20px",
              padding: "32px",
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap", gap: "24px",
            }}>
              <div>
                <h3 style={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: "24px", fontWeight: 700, color: "#fff", margin: "0 0 6px",
                }}>
                  {ebook.title}
                </h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", margin: "0 0 12px" }}>
                  {ebook.exam} · {ebook.level}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span style={{
                    fontFamily: "Rajdhani, sans-serif",
                    fontSize: "32px", fontWeight: 700, color: "#FF8534",
                  }}>
                    ₹{ebook.price.toLocaleString("en-IN")}
                  </span>
                  {ebook.validityDate && (
                    <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)" }}>
                      · Valid till {ebook.validityDate}
                    </span>
                  )}
                </div>
              </div>
              <a
                href={ebook.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  padding: "16px 36px",
                  background: "linear-gradient(135deg, #FF6200, #FF8534)",
                  borderRadius: "14px",
                  color: "#fff", fontSize: "16px", fontWeight: 700,
                  textDecoration: "none",
                  fontFamily: "Nunito, sans-serif",
                  boxShadow: "0 6px 28px rgba(255,98,0,0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                <span>🛒</span> Purchase Now
              </a>
            </div>
          </Section>
        )}
      </div>

      {/* ── Sticky mobile CTA ── */}
      {ebook.purchaseUrl && <StickyCTA ebook={ebook} />}
    </div>
  );
}

// ── Hero section ──────────────────────────────────────────────────────────────

function HeroSection({ ebook }: { ebook: Ebook }) {
  const [coverErr, setCoverErr] = useState(false);

  return (
    <>
      <style>{`
        .detail-hero { display: grid; grid-template-columns: 300px 1fr; gap: 48px; align-items: start; margin-bottom: 60px; }
        @media (max-width: 800px) { .detail-hero { grid-template-columns: 1fr; gap: 28px; } }
        .detail-cover-wrap { position: sticky; top: 100px; }
        @media (max-width: 800px) { .detail-cover-wrap { position: static; } }
      `}</style>
      <div className="detail-hero">
        {/* Left: cover */}
        <div className="detail-cover-wrap">
          <div style={{
            position: "relative",
            width: "100%",
            paddingBottom: "133%",
            borderRadius: "20px",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0B1E3D, #04152d)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}>
            {ebook.coverImage && !coverErr ? (
              <Image
                src={ebook.coverImage}
                alt={ebook.title}
                fill
                sizes="300px"
                style={{ objectFit: "cover" }}
                priority
                onError={() => {
                  console.warn(`[EbookDetailPage] Cover failed to load for "${ebook.title}":`, ebook.coverImage);
                  setCoverErr(true);
                }}
              />
            ) : (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, #0B1E3D, #162E5C)",
              }}>
                <span style={{ fontSize: "80px" }}>📖</span>
              </div>
            )}
          </div>

          {ebook.previewUrl && (
            <a
              href={ebook.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", width: "100%", marginTop: "14px",
                padding: "12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "14px",
                color: "rgba(255,255,255,0.8)",
                fontSize: "14px", fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Nunito, sans-serif",
                boxSizing: "border-box",
              }}
            >
              <span>👁️</span> Free Preview
            </a>
          )}
        </div>

        {/* Right: info */}
        <div style={{ paddingTop: "8px" }}>
          {/* Badges */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "4px 12px",
              borderRadius: "20px",
              background: "rgba(255,98,0,0.15)",
              border: "1px solid rgba(255,98,0,0.3)",
              color: "#FF8534",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {ebook.level}
            </span>
            {ebook.featured && (
              <span style={{
                fontSize: "11px", fontWeight: 700, padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(255,184,0,0.12)",
                border: "1px solid rgba(255,184,0,0.25)",
                color: "#FFB800",
                fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}>
                ⭐ Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 700, color: "#fff",
            margin: "0 0 8px", lineHeight: 1.15,
          }}>
            {ebook.title}
          </h1>

          <p style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.55)",
            margin: "0 0 6px",
          }}>
            {ebook.exam}
          </p>

          {ebook.description && (
            <p style={{
              fontSize: "14px",
              color: "rgba(255,255,255,0.5)",
              margin: "0 0 24px",
              lineHeight: 1.65,
            }}>
              {ebook.description}
            </p>
          )}

          {/* Key features */}
          {ebook.features?.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {ebook.features.slice(0, 6).map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#22c55e", fontSize: "14px", flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price block */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            padding: "20px 24px",
            marginBottom: "20px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "4px" }}>
              <span style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "36px", fontWeight: 700, color: "#FF8534",
              }}>
                ₹{ebook.price.toLocaleString("en-IN")}
              </span>
            </div>
            {ebook.validityDate && (
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
                Valid till {ebook.validityDate}
              </div>
            )}
          </div>

          {/* Early Bird Offer card */}
          <OfferCard ebook={ebook} />

          {/* Purchase button (shown only if no offer, or as fallback) */}
          {ebook.purchaseUrl && !ebook.offerEnabled && (
            <a
              href={ebook.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "10px",
                width: "100%", boxSizing: "border-box",
                padding: "16px",
                background: "linear-gradient(135deg, #FF6200, #FF8534)",
                borderRadius: "14px",
                color: "#fff", fontSize: "16px", fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Nunito, sans-serif",
                boxShadow: "0 6px 28px rgba(255,98,0,0.4)",
              }}
            >
              <span>🛒</span> Purchase Now — ₹{ebook.price.toLocaleString("en-IN")}
            </a>
          )}
        </div>
      </div>
    </>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "20px",
        paddingBottom: "14px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <h2 style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "22px", fontWeight: 700, color: "#fff", margin: 0,
        }}>
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

// ── Sticky mobile CTA ─────────────────────────────────────────────────────────

function StickyCTA({ ebook }: { ebook: Ebook }) {
  return (
    <>
      <style>{`
        .sticky-cta { display: none; }
        @media (max-width: 800px) { .sticky-cta { display: flex; } }
      `}</style>
      <div
        className="sticky-cta"
        style={{
          position: "fixed", bottom: 0, left: 0, right: 0,
          zIndex: 100,
          padding: "12px 16px",
          background: "rgba(2,8,23,0.95)",
          borderTop: "1px solid rgba(255,98,0,0.2)",
          backdropFilter: "blur(16px)",
          alignItems: "center", gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "14px", fontWeight: 700, color: "#fff",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {ebook.title}
          </div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#FF8534", fontFamily: "Rajdhani, sans-serif" }}>
            ₹{ebook.price.toLocaleString("en-IN")}
          </div>
        </div>
        <a
          href={ebook.purchaseUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "12px 24px",
            background: "linear-gradient(135deg, #FF6200, #FF8534)",
            borderRadius: "12px",
            color: "#fff", fontSize: "14px", fontWeight: 700,
            textDecoration: "none",
            fontFamily: "Nunito, sans-serif",
            boxShadow: "0 4px 16px rgba(255,98,0,0.4)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Buy Now
        </a>
      </div>
    </>
  );
}
