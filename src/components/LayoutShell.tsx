"use client";

import { useAnnouncementBar } from "@/contexts/AnnouncementContext";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const { barHeight } = useAnnouncementBar();
  return (
    <main
      className="overflow-x-hidden"
      style={{ paddingTop: `${70 + barHeight}px`, paddingBottom: "96px" }}
    >
      {children}
    </main>
  );
}
