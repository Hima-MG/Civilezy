import type { Metadata } from "next";
import PricingSection from "@/components/sections/PricingSection";
import PricingComparison from "@/components/sections/PricingComparison";

export const metadata: Metadata = {
  title: { absolute: "Kerala PSC Civil Engineering Course Pricing | CivilEzy" },
  description:
    "Affordable Kerala PSC Civil Engineering course plans — ITI ₹1,800/mo, Diploma ₹2,000/mo, B.Tech/AE ₹2,500/mo, Surveyor ₹1,800/mo. Monthly & annual options. Try demo course before enrolling.",
  keywords: [
    "kerala psc civil engineering course price",
    "civil psc coaching fees kerala",
    "iti civil psc course fee",
    "diploma civil psc price kerala",
    "ae civil psc coaching cost",
    "kerala psc civil engineering monthly plan",
    "civil engineering psc affordable course",
    "wincentre coaching fee",
    "PSC civil engineering demo course Kerala",
    "CivilEzy demo course access",
  ],
  alternates: { canonical: "https://civilezy.in/pricing" },
  openGraph: {
    title:       "Kerala PSC Civil Engineering Course Pricing | CivilEzy",
    description: "ITI ₹1,800/mo · Diploma ₹2,000/mo · B.Tech/AE ₹2,500/mo · Surveyor ₹1,800/mo. Demo course available. Powered by Wincentre (4.8⭐).",
    url:         "https://civilezy.in/pricing",
    siteName:    "CivilEzy",
    type:        "website",
    locale:      "en_IN",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "CivilEzy Kerala PSC Civil Engineering Course Pricing" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Kerala PSC Civil Engineering Course Pricing | CivilEzy",
    description: "ITI ₹1,800/mo · Diploma ₹2,000/mo · B.Tech/AE ₹2,500/mo · Surveyor ₹1,800/mo. Try demo course before enrolling.",
    images:      ["https://civilezy.in/civilezy_logo_orange.png"],
  },
  robots: { index: true, follow: true },
};

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <PricingComparison />
    </>
  );
}
