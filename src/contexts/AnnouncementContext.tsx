"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AnnouncementCtx {
  barHeight: number;
  setBarHeight: (h: number) => void;
}

const Ctx = createContext<AnnouncementCtx>({ barHeight: 0, setBarHeight: () => {} });

export function AnnouncementProvider({ children }: { children: ReactNode }) {
  const [barHeight, setBarHeight] = useState(0);
  return (
    <Ctx.Provider value={{ barHeight, setBarHeight }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAnnouncementBar = () => useContext(Ctx);
