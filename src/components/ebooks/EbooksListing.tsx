"use client";

import { useRouter } from "next/navigation";
import { EBOOKS, type EbookData } from "@/data/ebookData";

export default function EbooksListing() {
  return (
    <main style={{ background: "#040C18", minHeight: "100vh", paddingTop: "70px" }}>
      {/* Hero */}
      <section
        style={{
          background: "linear-gradient(135deg, #091729 0%, #0B1E3D 50%, #0D2347 100%)",
          borderBottom: "1px solid rgba(245,158,11,0.2)",
          padding: "64px 5% 56px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: "20px",
            padding: "4px 18px",
            fontSize: "12px",
            fontWeight: 700,
            color: "#F59E0B",
            letterSpacing: "0.8px",
            marginBottom: "20px",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          KERALA PSC CIVIL ENGINEERING
        </div>
        <h1
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "clamp(32px,5vw,56px)",
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            margin: "0 0 18px",
          }}
        >
          Quick Revision{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F59E0B, #FCD34D)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            E-Books
          </span>
        </h1>
        <p
          style={{
            fontSize: "clamp(15px,2vw,18px)",
            color: "rgba(255,255,255,0.75)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: 1.7,
            fontFamily: "Nunito, sans-serif",
          }}
        >
          Concise, syllabus-based revision guides crafted for Kerala PSC Civil Engineering exams.
          Study smart, save time, score more.
        </p>
      </section>

      {/* Ebook Cards */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "60px 5%" }}>
        <div className="ebooks-grid">
          {EBOOKS.map((ebook) => (
            <EbookCard key={ebook.slug} ebook={ebook} />
          ))}
          <ComingSoonCard />
        </div>
      </section>

      <style>{`
        .ebooks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 28px;
        }
        .ebook-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 16px 40px rgba(245,158,11,0.22) !important;
        }
        .ebook-card:focus-visible {
          outline: 2px solid #F59E0B;
          outline-offset: 3px;
        }
        @media (max-width: 640px) {
          .ebooks-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}

function EbookCard({ ebook }: { ebook: EbookData }) {
  const router = useRouter();

  return (
    <div
      className="ebook-card"
      onClick={() => router.push(`/ebooks/${ebook.slug}`)}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") router.push(`/ebooks/${ebook.slug}`); }}
      aria-label={`${ebook.title} for ${ebook.subtitle} — ${ebook.priceDisplay}`}
      style={{
        background: "linear-gradient(145deg, #1A1200, #2D2000)",
        border: "1px solid rgba(245,158,11,0.35)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 4px 30px rgba(245,158,11,0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* Badges */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", padding: "16px 16px 0" }}>
        {ebook.isNew && (
          <span
            style={{
              background: "rgba(16,185,129,0.2)",
              border: "1px solid rgba(16,185,129,0.4)",
              color: "#34D399",
              fontSize: "10px",
              fontWeight: 800,
              padding: "3px 10px",
              borderRadius: "20px",
              letterSpacing: "0.5px",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            NEW
          </span>
        )}
        {ebook.examBadge && (
          <span
            style={{
              background: "rgba(245,158,11,0.15)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#FCD34D",
              fontSize: "10px",
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: "20px",
              letterSpacing: "0.3px",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            {ebook.examBadge}
          </span>
        )}
      </div>

      {/* Book cover */}
      <BookCover ebook={ebook} />

      {/* Card body */}
      <div style={{ padding: "0 20px 20px" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(245,158,11,0.15)",
            border: "1px solid rgba(245,158,11,0.25)",
            color: "#F59E0B",
            fontSize: "10px",
            fontWeight: 800,
            padding: "3px 10px",
            borderRadius: "6px",
            letterSpacing: "0.8px",
            marginBottom: "10px",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          {ebook.badge}
        </div>

        <h2
          style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "22px",
            fontWeight: 700,
            color: "#ffffff",
            margin: "0 0 4px",
            lineHeight: 1.2,
          }}
        >
          {ebook.title}
        </h2>
        <p
          style={{
            fontFamily: "Nunito, sans-serif",
            fontSize: "14px",
            color: "rgba(255,255,255,0.65)",
            margin: "0 0 14px",
          }}
        >
          For {ebook.subtitle}
        </p>

        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.5)",
            fontFamily: "Nunito, sans-serif",
            marginBottom: "16px",
          }}
        >
          📚 {ebook.modules.length} Comprehensive Modules &nbsp;·&nbsp; 📝 20 Model Exams
        </div>

        <div
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#F59E0B",
            fontFamily: "Rajdhani, sans-serif",
            marginBottom: "4px",
          }}
        >
          {ebook.priceDisplay}
        </div>
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "Nunito, sans-serif",
            marginBottom: "18px",
          }}
        >
          {ebook.validity}
        </div>

        {/* CTAs — stopPropagation so they don't trigger card click */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <a
            href={ebook.previewLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "block",
              textAlign: "center",
              background: "linear-gradient(135deg, #F59E0B, #D97706)",
              color: "#1A0F00",
              fontFamily: "Nunito, sans-serif",
              fontSize: "14px",
              fontWeight: 800,
              padding: "11px 0",
              borderRadius: "50px",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(245,158,11,0.35)",
            }}
          >
            👁 View Free Preview
          </a>
          <a
            href={ebook.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              display: "block",
              textAlign: "center",
              background: "linear-gradient(135deg, #FF6200, #FF8534)",
              color: "#ffffff",
              fontFamily: "Nunito, sans-serif",
              fontSize: "14px",
              fontWeight: 700,
              padding: "11px 0",
              borderRadius: "50px",
              textDecoration: "none",
              boxShadow: "0 4px 18px rgba(255,98,0,0.3)",
            }}
          >
            Purchase E-Book →
          </a>
        </div>
      </div>
    </div>
  );
}

function BookCover({ ebook }: { ebook: EbookData }) {
  return (
    <div
      style={{
        margin: "14px 20px 18px",
        borderRadius: "12px",
        background: "linear-gradient(135deg, #0B1E3D 0%, #1A2F5A 50%, #0D2347 100%)",
        border: "1px solid rgba(245,158,11,0.3)",
        padding: "28px 20px",
        position: "relative",
        overflow: "hidden",
        minHeight: "160px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B)",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-30px", right: "-30px",
          width: "120px", height: "120px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        style={{
          fontSize: "11px",
          fontWeight: 800,
          color: "#F59E0B",
          letterSpacing: "1.5px",
          fontFamily: "Nunito, sans-serif",
          marginBottom: "8px",
        }}
      >
        CIVILEZY PRESENTS
      </div>
      <div
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
          marginBottom: "6px",
        }}
      >
        {ebook.title}
      </div>
      <div
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: "13px",
          color: "rgba(255,255,255,0.65)",
        }}
      >
        For {ebook.subtitle}
      </div>
      <div
        style={{
          marginTop: "14px",
          fontSize: "11px",
          fontFamily: "Nunito, sans-serif",
          color: "rgba(245,158,11,0.7)",
          fontStyle: "italic",
        }}
      >
        &ldquo;{ebook.tagline}&rdquo;
      </div>
    </div>
  );
}

function ComingSoonCard() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px dashed rgba(255,255,255,0.12)",
        borderRadius: "20px",
        padding: "48px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        minHeight: "300px",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          marginBottom: "4px",
        }}
      >
        📖
      </div>
      <p
        style={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "20px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.35)",
          margin: 0,
        }}
      >
        More E-Books Coming Soon
      </p>
      <p
        style={{
          fontFamily: "Nunito, sans-serif",
          fontSize: "13px",
          color: "rgba(255,255,255,0.2)",
          margin: 0,
          maxWidth: "200px",
          lineHeight: 1.6,
        }}
      >
        ITI, B.Tech &amp; Surveyor level revision guides in the works
      </p>
    </div>
  );
}
