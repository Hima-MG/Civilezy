"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Ebook } from "@/types/ebook";

interface Props {
  ebook: Ebook;
}

export default function EbookCard({ ebook }: Props) {
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const displayFeatures = ebook.features.slice(0, 3);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,98,0,0.05)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? "rgba(255,98,0,0.30)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "20px",
        overflow: "hidden",
        transition: "all 0.3s ease",
        transform: hovered ? "translateY(-6px) scale(1.015)" : "translateY(0) scale(1)",
        boxShadow: hovered
          ? "0 24px 64px rgba(255,98,0,0.18), 0 8px 32px rgba(0,0,0,0.35)"
          : "0 4px 20px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Cover image */}
      <div style={{
        position: "relative",
        width: "100%",
        paddingBottom: "133%",
        background: "linear-gradient(135deg, #0B1E3D, #04152d)",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {ebook.coverImage && !imgErr ? (
          <Image
            src={ebook.coverImage}
            alt={ebook.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onError={() => {
              console.warn(`[EbookCard] Cover failed to load for "${ebook.title}":`, ebook.coverImage);
              setImgErr(true);
            }}
          />
        ) : (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #0B1E3D 0%, #162E5C 100%)",
            flexDirection: "column", gap: "12px",
          }}>
            <span style={{ fontSize: "56px" }}>📖</span>
            <span style={{
              fontSize: "11px", color: "rgba(255,255,255,0.3)",
              fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}>
              E-Book
            </span>
          </div>
        )}

        {/* Level badge */}
        <div style={{
          position: "absolute", top: "12px", left: "12px",
          background: "rgba(255,98,0,0.92)",
          color: "#fff", fontSize: "10px", fontWeight: 700,
          padding: "4px 10px", borderRadius: "20px",
          fontFamily: "Rajdhani, sans-serif", letterSpacing: "0.06em",
          textTransform: "uppercase",
          backdropFilter: "blur(8px)",
          boxShadow: "0 2px 8px rgba(255,98,0,0.4)",
        }}>
          {ebook.level}
        </div>

        {/* Overlay gradient on hover */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(2,8,23,0.5) 0%, transparent 60%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }} />
      </div>

      {/* Card body */}
      <div style={{
        padding: "16px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}>
        {/* Title + exam */}
        <div>
          <h3 style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "17px", fontWeight: 700,
            color: "#fff", margin: "0 0 3px",
            lineHeight: 1.25,
          }}>
            {ebook.title}
          </h3>
          <p style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.45)",
            margin: 0,
          }}>
            {ebook.exam}
          </p>
        </div>

        {/* Feature tags */}
        {displayFeatures.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
            {displayFeatures.map((f, i) => (
              <span key={i} style={{
                fontSize: "10px",
                color: "rgba(255,184,0,0.9)",
                background: "rgba(255,184,0,0.08)",
                border: "1px solid rgba(255,184,0,0.20)",
                padding: "3px 8px",
                borderRadius: "20px",
                fontWeight: 600,
                fontFamily: "Nunito, sans-serif",
              }}>
                ✓ {f}
              </span>
            ))}
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Price */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
          <span style={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "22px", fontWeight: 700,
            color: "#FF8534",
          }}>
            ₹{ebook.price.toLocaleString("en-IN")}
          </span>
          {ebook.validityDate && (
            <span style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
            }}>
              · Valid till {ebook.validityDate}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          {ebook.previewUrl && (
            <a
              href={ebook.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{
                flex: 1,
                textAlign: "center",
                padding: "9px 10px",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "10px",
                color: "rgba(255,255,255,0.75)",
                fontSize: "12px", fontWeight: 700,
                textDecoration: "none",
                fontFamily: "Nunito, sans-serif",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
            >
              Preview
            </a>
          )}
          <Link
            href={`/ebooks/${ebook.slug}`}
            style={{
              flex: 2,
              textAlign: "center",
              padding: "9px 10px",
              background: hovered
                ? "linear-gradient(135deg, #FF6200, #FF8534)"
                : "rgba(255,98,0,0.12)",
              border: "1px solid rgba(255,98,0,0.35)",
              borderRadius: "10px",
              color: hovered ? "#fff" : "#FF8534",
              fontSize: "12px", fontWeight: 700,
              textDecoration: "none",
              fontFamily: "Nunito, sans-serif",
              transition: "all 0.25s",
              whiteSpace: "nowrap",
              boxShadow: hovered ? "0 4px 16px rgba(255,98,0,0.3)" : "none",
            }}
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
