"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPublishedEbooks } from "@/lib/ebooks";
import type { Ebook } from "@/types/ebook";
import EbookCard from "./EbookCard";
import EarlyBirdCampaign from "./EarlyBirdCampaign";

const FILTERS = ["All", "ITI", "Diploma", "B.Tech", "Surveyor"] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Maps any ebook/bundle into one of the five primary categories.
 * Does NOT rely on slugs — works off level + title text.
 */
function getCategory(ebook: Ebook): Filter {
  const lvl   = (ebook.level ?? "").toLowerCase();
  const title = (ebook.title ?? "").toLowerCase();

  if (lvl.includes("iti"))
    return "ITI";
  if (lvl.includes("diploma") || title.includes("instructor"))
    return "Diploma";
  if (
    lvl.includes("b.tech") ||
    title.includes("assistant engineer") ||
    title.includes("ae civil") ||
    (title.includes(" ae ") && !title.includes("kwa"))
  )
    return "B.Tech";
  if (
    lvl.includes("surveyor") ||
    title.includes("kwa") ||
    title.includes("draftsman")
  )
    return "Surveyor";

  return "All";          // uncategorised items appear under "All" only
}

function matchesFilter(ebook: Ebook, filter: Filter): boolean {
  if (filter === "All") return true;
  return getCategory(ebook) === filter;
}

function matchesSearch(ebook: Ebook, q: string): boolean {
  if (!q.trim()) return true;
  const lower = q.toLowerCase();
  return (
    ebook.title.toLowerCase().includes(lower) ||
    ebook.exam.toLowerCase().includes(lower) ||
    ebook.level.toLowerCase().includes(lower) ||
    (ebook.description?.toLowerCase().includes(lower) ?? false)
  );
}

export default function EbooksListing() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    getPublishedEbooks()
      .then(setEbooks)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const featuredEbooks = useMemo(
    () => ebooks.filter((e) => e.featured),
    [ebooks]
  );

  const filteredEbooks = useMemo(
    () =>
      ebooks.filter(
        (e) => matchesFilter(e, activeFilter) && matchesSearch(e, search)
      ),
    [ebooks, activeFilter, search]
  );

  const isFiltering = search.trim() !== "" || activeFilter !== "All";
  const heroEbook = !isFiltering && featuredEbooks.length > 0 ? featuredEbooks[0] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #020817 0%, #04152d 50%, #020817 100%)",
      paddingTop: "80px",
      paddingBottom: "80px",
      fontFamily: "Nunito, sans-serif",
    }}>
      {/* ── Shared keyframes + filter chip styles ── */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Filter row */
        .eb-filter-row {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }
        @media (max-width: 560px) {
          .eb-filter-row {
            flex-wrap: nowrap;
            overflow-x: auto;
            justify-content: flex-start;
            padding-bottom: 4px;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .eb-filter-row::-webkit-scrollbar { display: none; }
        }

        /* Filter chip — base */
        .eb-chip {
          min-width: 84px;
          padding: 9px 22px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.5);
          font-size: 14px;
          font-weight: 700;
          font-family: Rajdhani, sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
                      border-color 0.2s ease, background 0.2s ease, color 0.2s ease;
          flex-shrink: 0;
          text-align: center;
          white-space: nowrap;
          line-height: 1;
          outline: none;
        }
        .eb-chip:hover {
          transform: scale(1.03);
          border-color: rgba(255,98,0,0.45);
          background: rgba(255,98,0,0.08);
          color: rgba(255,255,255,0.85);
        }
        /* Active chip */
        .eb-chip.eb-chip--active {
          background: linear-gradient(135deg, #FF6200, #FF8534);
          border-color: transparent;
          color: #fff;
          box-shadow: 0 4px 18px rgba(255,98,0,0.38), 0 2px 8px rgba(0,0,0,0.3);
        }
        .eb-chip.eb-chip--active:hover {
          transform: scale(1.03);
          box-shadow: 0 6px 24px rgba(255,98,0,0.55), 0 2px 8px rgba(0,0,0,0.3);
        }
      `}</style>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px" }}>

        {/* ── Page header ── */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,98,0,0.12)",
            border: "1px solid rgba(255,98,0,0.25)",
            borderRadius: "20px", padding: "5px 16px",
            marginBottom: "16px",
          }}>
            <span style={{ fontSize: "14px" }}>📚</span>
            <span style={{
              fontSize: "12px", fontWeight: 700, color: "#FF8534",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              E-Book Marketplace
            </span>
          </div>

          <h1 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 700, color: "#fff",
            margin: "0 0 12px", lineHeight: 1.1,
          }}>
            Quick Revision{" "}
            <span style={{ color: "#FF8534" }}>E-Books</span>
          </h1>
          <p style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.55)",
            margin: 0,
          }}>
            Smart Revision. Better Results.
          </p>
        </div>

        {/* ── Search + filters ── */}
        <div style={{
          maxWidth: "720px",
          margin: "0 auto 48px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "16px",
              top: "50%", transform: "translateY(-50%)",
              fontSize: "16px", pointerEvents: "none",
            }}>
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search by title, exam or level…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 44px",
                background: searchFocused
                  ? "rgba(255,255,255,0.07)"
                  : "rgba(255,255,255,0.04)",
                border: `1px solid ${searchFocused ? "rgba(255,98,0,0.4)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "14px",
                color: "#fff",
                fontSize: "15px",
                outline: "none",
                fontFamily: "Nunito, sans-serif",
                transition: "all 0.2s",
                boxShadow: searchFocused ? "0 0 0 3px rgba(255,98,0,0.1)" : "none",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: "14px",
                  top: "50%", transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.1)",
                  border: "none", borderRadius: "50%",
                  width: "24px", height: "24px",
                  color: "rgba(255,255,255,0.6)",
                  cursor: "pointer", fontSize: "12px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div className="eb-filter-row">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`eb-chip${activeFilter === f ? " eb-chip--active" : ""}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── Campaign offer section (dynamic, shown when not filtering) ── */}
        {!isFiltering && <EarlyBirdCampaign />}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 20px", color: "rgba(255,255,255,0.35)" }}>
            <div style={{
              width: "40px", height: "40px",
              border: "3px solid rgba(255,98,0,0.2)",
              borderTopColor: "#FF6200",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 16px",
            }} />
            <p style={{ fontSize: "14px", margin: 0 }}>Loading e-books…</p>
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && filteredEbooks.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            maxWidth: "480px", margin: "0 auto",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
            <h3 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "22px", fontWeight: 700, color: "#fff", margin: "0 0 8px",
            }}>
              {ebooks.length === 0 ? "No E-Books Yet" : "No Results Found"}
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", margin: "0 0 20px" }}>
              {ebooks.length === 0
                ? "E-books will appear here once published."
                : "Try a different search term or filter."}
            </p>
            {isFiltering && (
              <button
                onClick={() => { setSearch(""); setActiveFilter("All"); }}
                style={{
                  padding: "10px 24px",
                  background: "rgba(255,98,0,0.15)",
                  border: "1px solid rgba(255,98,0,0.3)",
                  borderRadius: "10px",
                  color: "#FF8534", fontSize: "14px", fontWeight: 700,
                  fontFamily: "Nunito, sans-serif", cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* ── Content ── */}
        {!loading && filteredEbooks.length > 0 && (
          <>
            {/* Featured hero */}
            {heroEbook && (
              <div style={{ marginBottom: "56px" }}>
                <SectionLabel text="Featured" />
                <Link href={`/ebooks/${heroEbook.slug}`} style={{ textDecoration: "none" }}>
                  <FeaturedHeroCard ebook={heroEbook} />
                </Link>
              </div>
            )}

            {/* Grid heading */}
            <SectionLabel
              text={isFiltering
                ? `${filteredEbooks.length} Result${filteredEbooks.length !== 1 ? "s" : ""}${activeFilter !== "All" ? ` · ${activeFilter}` : ""}${search ? ` · "${search}"` : ""}`
                : `All E-Books (${filteredEbooks.length})`}
            />

            {/* Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "24px",
            }}>
              {filteredEbooks.map((ebook) => (
                <EbookCard key={ebook.id} ebook={ebook} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      marginBottom: "20px",
    }}>
      <span style={{
        width: "4px", height: "18px",
        background: "linear-gradient(180deg, #FF6200, #FF8534)",
        borderRadius: "2px", display: "inline-block", flexShrink: 0,
      }} />
      <span style={{
        fontSize: "12px", fontWeight: 700,
        color: "rgba(255,255,255,0.5)",
        fontFamily: "Rajdhani, sans-serif",
        letterSpacing: "0.1em", textTransform: "uppercase",
      }}>
        {text}
      </span>
    </div>
  );
}

function FeaturedHeroCard({ ebook }: { ebook: Ebook }) {
  const [hovered, setHovered] = useState(false);
  const [coverErr, setCoverErr] = useState(false);

  return (
    <>
      <style>{`
        .featured-hero { display: grid; grid-template-columns: 260px 1fr; }
        @media (max-width: 680px) { .featured-hero { grid-template-columns: 1fr; } }
      `}</style>
      <div
        className="featured-hero"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "rgba(255,98,0,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${hovered ? "rgba(255,98,0,0.35)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: "24px",
          overflow: "hidden",
          transition: "all 0.3s ease",
          boxShadow: hovered
            ? "0 24px 80px rgba(255,98,0,0.18), 0 8px 32px rgba(0,0,0,0.4)"
            : "0 8px 40px rgba(0,0,0,0.3)",
        }}
      >
        {/* Cover */}
        <div style={{
          position: "relative",
          background: "linear-gradient(135deg, #0B1E3D, #04152d)",
          minHeight: "300px",
          overflow: "hidden",
        }}>
          {ebook.coverImage && !coverErr ? (
            <Image
              src={ebook.coverImage}
              alt={ebook.title}
              fill
              sizes="260px"
              style={{ objectFit: "cover" }}
              onError={() => {
                console.warn(`[EbooksListing] Featured cover failed to load for "${ebook.title}":`, ebook.coverImage);
                setCoverErr(true);
              }}
            />
          ) : (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #0B1E3D, #162E5C)",
            }}>
              <span style={{ fontSize: "72px" }}>📖</span>
            </div>
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 50%, rgba(2,8,23,0.4))",
          }} />
        </div>

        {/* Info */}
        <div style={{
          padding: "32px 36px",
          display: "flex", flexDirection: "column", gap: "14px",
          justifyContent: "center",
        }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "4px 12px",
              borderRadius: "20px",
              background: "rgba(255,98,0,0.15)",
              border: "1px solid rgba(255,98,0,0.3)",
              color: "#FF8534",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              ⭐ Featured
            </span>
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "4px 12px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              {ebook.level}
            </span>
          </div>

          <div>
            <h2 style={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "clamp(20px, 3vw, 28px)",
              fontWeight: 700, color: "#fff",
              margin: "0 0 5px", lineHeight: 1.2,
            }}>
              {ebook.title}
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
              {ebook.exam}
            </p>
          </div>

          {ebook.description && (
            <p style={{
              fontSize: "14px", color: "rgba(255,255,255,0.6)",
              margin: 0, lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {ebook.description}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {ebook.features.slice(0, 4).map((f, i) => (
              <span key={i} style={{
                fontSize: "11px", color: "rgba(255,184,0,0.9)",
                background: "rgba(255,184,0,0.08)",
                border: "1px solid rgba(255,184,0,0.18)",
                padding: "3px 10px", borderRadius: "20px",
                fontWeight: 600, fontFamily: "Nunito, sans-serif",
              }}>
                ✓ {f}
              </span>
            ))}
          </div>

          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "12px",
            paddingTop: "4px",
          }}>
            <div>
              <span style={{
                fontFamily: "Rajdhani, sans-serif",
                fontSize: "28px", fontWeight: 700, color: "#FF8534",
              }}>
                ₹{ebook.price.toLocaleString("en-IN")}
              </span>
              {ebook.validityDate && (
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>
                  Valid till {ebook.validityDate}
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              {ebook.previewUrl && (
                <a
                  href={ebook.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    padding: "10px 18px",
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: "12px",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "13px", fontWeight: 700,
                    textDecoration: "none",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  Free Preview
                </a>
              )}
              <span style={{
                padding: "10px 22px",
                background: "linear-gradient(135deg, #FF6200, #FF8534)",
                borderRadius: "12px", color: "#fff",
                fontSize: "13px", fontWeight: 700,
                fontFamily: "Nunito, sans-serif",
                boxShadow: "0 4px 20px rgba(255,98,0,0.35)",
                whiteSpace: "nowrap",
              }}>
                View Details →
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
