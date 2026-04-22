import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Game Arena — Free Kerala PSC Civil Engineering Mock Test | CivilEzy" },
  description:
    "Practice Kerala PSC Civil Engineering questions free in CivilEzy's Game Arena. Timed rounds, live leaderboard, instant feedback. ITI, Diploma, B.Tech/AE & Surveyor topics.",
  keywords: [
    "kerala psc civil engineering mock test free",
    "civil psc practice questions online",
    "psc civil game arena",
    "kerala psc civil engineering quiz",
    "free civil psc test kerala",
    "iti civil psc mock test",
    "diploma civil psc practice",
    "ae civil psc questions",
    "civil engineering psc leaderboard",
  ],
  alternates: { canonical: "https://civilezy.in/game-arena" },
  openGraph: {
    title:       "Game Arena — Free Kerala PSC Civil Engineering Mock Test | CivilEzy",
    description: "Timed mock tests, live leaderboard, instant feedback — free for all Kerala PSC Civil Engineering aspirants.",
    url:         "https://civilezy.in/game-arena",
    siteName:    "CivilEzy",
    type:        "website",
    locale:      "en_IN",
    images:      [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: "CivilEzy Game Arena PSC Civil Mock Test" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Game Arena — Free PSC Civil Mock Test | CivilEzy",
    description: "Practice Kerala PSC Civil Engineering questions free. Timed, scored, with live leaderboard.",
    images:      ["https://civilezy.in/civilezy_logo_orange.png"],
  },
  robots: { index: true, follow: true },
};

export default function GameArenaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
