import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Rajdhani, Nunito } from "next/font/google";
import "./globals.css";

// ─── Font optimisation ──────────────────────────────────────────────────────
// next/font/google self-hosts fonts at build time — eliminates the
// render-blocking fonts.googleapis.com / fonts.gstatic.com round-trips.
// CSS variables match what globals.css already references:
//   body       → var(--font-nunito)
//   h1–h5      → var(--font-rajdhani)
const rajdhani = Rajdhani({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700"],
  variable: "--font-rajdhani",
  display:  "swap",
  preload:  true,
});

const nunito = Nunito({
  subsets:  ["latin"],
  weight:   ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display:  "swap",
  preload:  true,
});
// ───────────────────────────────────────────────────────────────────────────

import Navbar from "@/components/Navbar";
import StickyCTA from "@/components/sections/StickyCTA";
import AnnouncementBar from "@/components/AnnouncementBar";
import LayoutShell from "@/components/LayoutShell";
import LeadCapturePopup from "@/components/LeadCapturePopup";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import TechnicalSupportModal from "@/components/support/TechnicalSupportModal";
import FloatingSupportButton from "@/components/support/FloatingSupportButton";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnnouncementProvider } from "@/contexts/AnnouncementContext";
import { SupportProvider } from "@/contexts/SupportContext";

export const metadata: Metadata = {
  title: {
    default:  "CivilEzy | #1 Kerala PSC Civil Engineering Coaching — ITI, Diploma, AE",
    template: "%s | CivilEzy",
  },
  description:
    "Kerala's top PSC Civil Engineering platform with Game Arena, smart lessons, mock tests, and rank tracking. ITI, Diploma, B.Tech/AE & Surveyor courses. Powered by Wincentre (4.8⭐, 1000+ selections).",
  keywords: [
    "Kerala PSC Civil Engineering coaching",
    "#1 civil psc coaching kerala",
    "best civil engineering psc coaching kerala",
    "kerala psc civil engineering course",
    "psc civil mock test kerala",
    "psc ae kerala coaching",
    "diploma civil psc kerala",
    "iti civil psc preparation",
    "kwa ae preparation kerala",
    "pwd overseer kerala psc",
    "civil engineering psc malayalam",
    "wincentre psc coaching thrissur",
    "civil psc game arena",
  ],
  metadataBase: new URL("https://civilezy.in"),
  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         "https://civilezy.in",
    siteName:    "CivilEzy",
    title:       "CivilEzy | #1 Kerala PSC Civil Engineering Coaching — ITI, Diploma, AE",
    description: "Kerala's top PSC Civil Engineering platform with Game Arena, smart lessons, mock tests, and rank tracking. Powered by Wincentre (4.8⭐, 1000+ selections).",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "CivilEzy Kerala PSC Civil Engineering Coaching Platform" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "CivilEzy | #1 Kerala PSC Civil Engineering Coaching — ITI, Diploma, AE",
    description: "Kerala's top PSC Civil Engineering platform with Game Arena, smart lessons, mock tests, and rank tracking. Powered by Wincentre (4.8⭐, 1000+ selections).",
    images:      ["https://civilezy.in/civilezy_logo_orange.png"],
  },
  alternates:  { canonical: "https://civilezy.in" },
  robots:      { index: true, follow: true },
};

const globalSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://civilezy.in/#website",
  name: "CivilEzy",
  alternateName: "CivilEzy by Wincentre",
  url: "https://civilezy.in",
  description: "Kerala's #1 Civil Engineering PSC coaching platform powered by Wincentre (4.8⭐, 445+ reviews, Thrissur). Game Arena, mock tests, leaderboard, Malayalam audio lessons.",
  publisher: {
    "@type": "Organization",
    "@id": "https://civilezy.in/#organization",
    name: "CivilEzy by Wincentre",
    url: "https://civilezy.in",
    logo: {
      "@type": "ImageObject",
      url: "https://civilezy.in/civilezy_logo_orange.png",
      width: 240,
      height: 68,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-90723-45630",
      contactType: "customer support",
      availableLanguage: ["English", "Malayalam"],
    },
    sameAs: [
      "https://www.youtube.com/@CivilEzy-youtube",
      "https://www.instagram.com/civilezy_by_wincentre",
      "https://www.facebook.com",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "445",
      bestRating: "5",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${nunito.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="overflow-x-hidden">
        <AuthProvider>
          <AnnouncementProvider>
            <SupportProvider>
              <AnnouncementBar />
              <Navbar />
              <LayoutShell>{children}</LayoutShell>
              <StickyCTA />
              <WhatsAppWidget />
              <LeadCapturePopup />
              <TechnicalSupportModal />
              <FloatingSupportButton />
            </SupportProvider>
          </AnnouncementProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
