"use client";

import Link from "next/link";

const WA_LINK = "https://wa.me/919876543210";

const FOOTER_LINKS = {
  Courses: [
    { label: "ITI Civil PSC",    href: "/courses/iti"     },
    { label: "Diploma Civil PSC",href: "/courses/diploma"  },
    { label: "AE / B.Tech PSC",  href: "/courses/ae"      },
    { label: "KWA AE Prep",      href: "/courses/kwa-ae"  },
    { label: "PWD Overseer",     href: "/courses/pwd"     },
  ],
  Resources: [
    { label: "Previous Year Questions", href: "/resources/pyq"          },
    { label: "Study Plans",             href: "/resources/study-plans"   },
    { label: "PSC Notifications",       href: "/resources/notifications" },
    { label: "Rank Holder Stories",     href: "/resources/stories"       },
    { label: "Free Mock Test",          href: "/mock-tests"              },
  ],
  Company: [
    { label: "About Us",        href: "/about"          },
    { label: "Contact",         href: "/contact"        },
    { label: "WhatsApp Support",href: WA_LINK           },
    { label: "Privacy Policy",  href: "/privacy"        },
    { label: "Refund Policy",   href: "/refund"         },
  ],
} as const;

const SOCIAL = [
  { emoji: "💬", title: "WhatsApp", href: WA_LINK },
  { emoji: "▶",  title: "YouTube",  href: "#"     },
  { emoji: "📷", title: "Instagram",href: "#"     },
  { emoji: "✈",  title: "Telegram", href: "#"     },
] as const;

export default function Footer() {
  return (
    <>
      <footer
        style={{
          background:  "#040C18",
          borderTop:   "1px solid rgba(255,255,255,0.06)",
          padding:     "50px 5% 30px",
        }}
      >
        <div className="footer-layout">
          {/* Brand column */}
          <div style={{ maxWidth: "280px" }}>
            <Link
              href="/"
              style={{
                display:        "flex",
                alignItems:     "center",
                gap:            "10px",
                fontFamily:     "Rajdhani, sans-serif",
                fontSize:       "22px",
                fontWeight:     700,
                textDecoration: "none",
                color:          "#ffffff",
                marginBottom:   "12px",
              }}
            >
              <span
                style={{
                  width:          "36px",
                  height:         "36px",
                  borderRadius:   "10px",
                  background:     "linear-gradient(135deg, #FF6200, #FFB347)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "18px",
                  fontWeight:     800,
                  color:          "white",
                  boxShadow:      "0 4px 15px rgba(255,98,0,0.4)",
                  flexShrink:     0,
                }}
              >
                C
              </span>
              Civil<span style={{ color: "#FF8534" }}>ezy</span>
            </Link>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
              Kerala&apos;s only dedicated Civil Engineering PSC platform. Pool-based mock tests,
              Malayalam content, expert-built questions. From confused to confident rank holder.
            </p>

            <div style={{ marginTop: "16px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Kerala PSC", "Civil Engineering", "ITI | Diploma | AE"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    background:   "rgba(255,98,0,0.1)",
                    border:       "1px solid rgba(255,98,0,0.2)",
                    borderRadius: "20px",
                    padding:      "4px 12px",
                    fontSize:     "12px",
                    color:        "#FF8534",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {(Object.entries(FOOTER_LINKS) as [string, readonly { label: string; href: string }[]][]).map(
            ([heading, links]) => (
              <div key={heading}>
                <h4
                  style={{
                    fontFamily:   "Rajdhani, sans-serif",
                    fontSize:     "17px",
                    fontWeight:   700,
                    marginBottom: "16px",
                    color:        "#ffffff",
                  }}
                >
                  {heading}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        style={{
                          color:          "rgba(255,255,255,0.55)",
                          textDecoration: "none",
                          fontSize:       "14px",
                          transition:     "color 0.2s",
                        }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#FF8534"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop:      "1px solid rgba(255,255,255,0.06)",
            paddingTop:     "24px",
            display:        "flex",
            justifyContent: "space-between",
            alignItems:     "center",
            flexWrap:       "wrap",
            gap:            "12px",
            marginTop:      "40px",
          }}
        >
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
            © 2025 Civilezy. All rights reserved. Made with ❤️ for Kerala PSC aspirants.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {SOCIAL.map((s) => (
              <a
                key={s.title}
                href={s.href}
                title={s.title}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width:          "36px",
                  height:         "36px",
                  borderRadius:   "10px",
                  background:     "rgba(255,255,255,0.05)",
                  border:         "1px solid rgba(255,255,255,0.1)",
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       "16px",
                  cursor:         "pointer",
                  transition:     "all 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background   = "rgba(255,98,0,0.2)";
                  el.style.borderColor  = "rgba(255,98,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background  = "rgba(255,255,255,0.05)";
                  el.style.borderColor = "rgba(255,255,255,0.1)";
                }}
              >
                {s.emoji}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      <a
        href={WA_LINK}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat on WhatsApp"
        style={{
          position:       "fixed",
          bottom:         "28px",
          right:          "28px",
          zIndex:         999,
          width:          "56px",
          height:         "56px",
          borderRadius:   "50%",
          background:     "#25D366",
          boxShadow:      "0 6px 25px rgba(37,211,102,0.5)",
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          fontSize:       "28px",
          transition:     "transform 0.2s, box-shadow 0.2s",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "scale(1.1)";
          el.style.boxShadow = "0 10px 35px rgba(37,211,102,0.6)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement;
          el.style.transform = "scale(1)";
          el.style.boxShadow = "0 6px 25px rgba(37,211,102,0.5)";
        }}
      >
        💬
      </a>

      {/* Footer responsive styles */}
      <style>{`
        .footer-layout {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }
        @media (max-width: 900px) {
          .footer-layout { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .footer-layout { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}