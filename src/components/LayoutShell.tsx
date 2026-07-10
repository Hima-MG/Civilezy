"use client";

import { usePathname } from "next/navigation";
import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { barHeight } = useAnnouncementBar();
  const pathname = usePathname();

  // The 96px bottom padding reserves space for the fixed StickyCTA bar. On
  // mobile that bar is shown on the Home page only (see StickyCTA /
  // .sticky-cta-mobile-hidden), so on every other page the reserved space is
  // collapsed via the same media query to avoid a blank strip at the bottom.
  const isHome = pathname === "/";

  return (
    <main
      className={
        isHome
          ? "overflow-x-hidden"
          : "overflow-x-hidden layout-no-sticky-mobile"
      }
      style={{ paddingTop: `${70 + barHeight}px`, paddingBottom: "96px" }}
    >
      {children}
    </main>
  );
}
