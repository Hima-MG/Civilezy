import type { Metadata } from "next";
import CourseRenewal from "@/components/sections/CourseRenewal";

export const metadata: Metadata = {
  title: { absolute: "Renew Your CivilEzy Membership | Kerala PSC Civil Engineering" },
  description:
    "Renew your CivilEzy Kerala PSC Civil Engineering membership. Step-by-step renewal guide for ITI, Diploma, B.Tech/AE, and Surveyor courses. Active members only.",
  keywords: [
    "civilezy membership renewal",
    "kerala psc civil engineering course renewal",
    "civilezy renew subscription",
    "iti civil psc course renewal",
    "diploma civil psc membership renew",
    "btech ae civil psc renew",
    "civilezy account renewal",
  ],
  alternates: { canonical: "https://civilezy.in/renew" },
  openGraph: {
    title:       "Renew Your CivilEzy Membership | Kerala PSC Civil Engineering",
    description: "Renew your active CivilEzy membership for ITI, Diploma, B.Tech/AE or Surveyor Kerala PSC courses. Simple 4-step process.",
    url:         "https://civilezy.in/renew",
    siteName:    "CivilEzy",
    type:        "website",
    locale:      "en_IN",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "CivilEzy Membership Renewal" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Renew Your CivilEzy Membership | Kerala PSC Civil Engineering",
    description: "Step-by-step membership renewal for CivilEzy Kerala PSC courses.",
    images:      ["https://civilezy.in/civilezy_logo_orange.png"],
  },
  robots: { index: true, follow: true },
};

export default function RenewPage() {
  return <CourseRenewal />;
}
