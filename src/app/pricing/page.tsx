import type { Metadata } from "next";
import PricingSection from "@/components/sections/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — Kerala PSC Civil Engineering Courses",
  description:
    "Course-based pricing for Kerala PSC Civil Engineering preparation. ITI, Diploma, BTech/AE and Surveyor plans. Monthly and annual options with installments.",
  keywords: [
    "Kerala PSC Civil Engineering course",
    "PSC AE coaching Kerala",
    "Diploma Civil PSC preparation",
    "ITI Civil PSC course",
    "Kerala PSC mock test price",
  ],
};

export default function PricingPage() {
  return (
    <>
      {/* ── Mini hero ─────────────────────────────────────────── */}
      {/* <div
        style={{
          background:
            "linear-gradient(180deg, #080F1E 0%, #0B1E3D 100%)",
          padding:    "64px 5% 0",
          textAlign:  "center",
          position:   "relative",
          overflow:   "hidden",
        }}
      > */}
        {/* Grid texture */}
        {/* <div
          style={{
            position:        "absolute",
            inset:           0,
            opacity:         0.03,
            backgroundImage:
              "linear-gradient(rgba(255,98,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,98,0,0.5) 1px, transparent 1px)",
            backgroundSize:  "60px 60px",
            pointerEvents:   "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "600px", margin: "0 auto" }}> */}
          {/* Tag */}
          {/* <div
            style={{
              display:       "inline-block",
              background:    "rgba(255,98,0,0.15)",
              border:        "1px solid rgba(255,98,0,0.3)",
              borderRadius:  "20px",
              padding:       "4px 16px",
              fontSize:      "12px",
              fontWeight:    700,
              color:         "#FF8534",
              letterSpacing: "0.5px",
              marginBottom:  "16px",
            }}
          >
            COURSE PLANS */}
          {/* </div>

          <h1
            style={{
              fontFamily:   "Rajdhani, sans-serif",
              fontSize:     "clamp(32px, 5vw, 52px)",
              fontWeight:   700,
              lineHeight:   1.1,
              color:        "#ffffff",
              marginBottom: "16px",
            }}
          >
            Choose Your{" "}
            <span
              style={{
                background:           "linear-gradient(135deg, #FF6200, #FFB800)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor:  "transparent",
                backgroundClip:       "text",
              }}
            >
              Course Plan
            </span>
          </h1>

          <p
            style={{
              fontSize:     "17px",
              color:        "rgba(255,255,255,0.7)",
              lineHeight:   1.7,
              marginBottom: 0,
            }}
          >
            Flexible plans designed for Kerala PSC Civil Engineering aspirants.
            Pay only for your exam pool.
          </p>
        </div> */}
      {/* </div> */}

      {/* ── Pricing section (no extra padding — section handles it) ── */}
      <PricingSection />
    </>
  );
}