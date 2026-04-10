import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StickyCTA from "@/components/sections/StickyCTA";

export const metadata: Metadata = {
  title: {
    default:  "CivilEzy | Kerala's #1 Civil Engineering PSC Platform",
    template: "%s | CivilEzy",
  },
  description:
    "Kerala's only PSC Civil Engineering platform with Smart Lessons, Malayalam Audio Lessons, Smart Quiz System, Short Video Lessons (40–50 min), and Game Arena. ITI / Diploma / AE prep.",
  keywords: [
    "Kerala PSC Civil Engineering",
    "PSC AE Kerala",
    "Diploma Civil PSC",
    "ITI Civil PSC preparation",
    "Kerala PSC mock test civil",
    "KWA AE preparation",
    "PWD Overseer Kerala PSC",
    "civil engineering PSC Malayalam",
  ],
  metadataBase: new URL("https://civilezy.in"),
  openGraph: {
    type:        "website",
    locale:      "en_IN",
    url:         "https://civilezy.in",
    siteName:    "CivilEzy",
    title:       "CivilEzy | Kerala's #1 Civil Engineering PSC Platform",
    description: "Kerala's only PSC Civil Engineering platform.",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "CivilEzy | Kerala's #1 Civil Engineering PSC Platform",
    description: "Kerala's only PSC Civil Engineering platform.",
  },
  robots: { index: true, follow: true },
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
      </head>
      <body className="overflow-x-hidden">
        <Navbar />
        <main
          className="overflow-x-hidden"
          style={{ paddingTop: "70px", paddingBottom: "96px" }}
        >
          {children}
        </main>
        <StickyCTA />

        {/* ── Google Analytics ── replace G-XXXXXXXXXX with your ID ── */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}