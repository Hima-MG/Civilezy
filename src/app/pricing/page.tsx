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
  openGraph: {
    title:       "Pricing — Kerala PSC Civil Engineering Courses | CivilEzy",
    description: "Flexible course plans for Kerala PSC Civil Engineering. ITI, Diploma, BTech/AE and Surveyor. Monthly and annual options.",
    url:         "https://civilezy.in/pricing",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Pricing — Kerala PSC Civil Engineering Courses | CivilEzy",
    description: "Flexible course plans for Kerala PSC Civil Engineering. ITI, Diploma, BTech/AE and Surveyor.",
  },
};

export default function PricingPage() {
  return <PricingSection />;
}
