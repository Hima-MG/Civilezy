"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SupportContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  unreadCount: number;
  setUnreadCount: (n: number) => void;
}

const SupportContext = createContext<SupportContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  unreadCount: 0,
  setUnreadCount: () => {},
});

export function SupportProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  return (
    <SupportContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export const useSupportModal = () => useContext(SupportContext);
