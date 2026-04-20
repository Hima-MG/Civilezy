import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StickyCTA from "@/components/sections/StickyCTA";
import AnnouncementBar from "@/components/AnnouncementBar";
import LayoutShell from "@/components/LayoutShell";
import { AuthProvider } from "@/contexts/AuthContext";
import { AnnouncementProvider } from "@/contexts/AnnouncementContext";

export const metadata: Metadata = {
  title: {
    default:  "CivilEzy | Kerala's #1 Civil Engineering PSC Platform",
    template: "%s | CivilEzy",
  },
  description:
    "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  keywords: [
    "Kerala PSC Civil Engineering",
    "best civil engineering psc coaching kerala",
    "kerala psc civil engineering coaching",
    "psc civil mock test kerala",
    "PSC AE Kerala",
    "Diploma Civil PSC",
    "ITI Civil PSC preparation",
    "KWA AE preparation",
    "PWD Overseer Kerala PSC",
    "civil engineering PSC Malayalam",
    "Wincentre PSC coaching",
  ],
  metadataBase: new URL("https://civilezy.in"),
  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         "https://civilezy.in",
    siteName:    "CivilEzy",
    title:       "CivilEzy | Kerala's #1 Civil Engineering PSC Platform",
    description: "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "CivilEzy | Kerala's #1 Civil Engineering PSC Platform",
    description: "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  },
  robots: { index: true, follow: true },
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
      telephone: "+91-90745-57825",
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
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: "https://civilezy.in/blog?q={search_term_string}" },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Nunito:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }}
        />
      </head>
      <body className="overflow-x-hidden">
        <AuthProvider>
          <AnnouncementProvider>
            <AnnouncementBar />
            <Navbar />
            <LayoutShell>{children}</LayoutShell>
            <StickyCTA />
          </AnnouncementProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
