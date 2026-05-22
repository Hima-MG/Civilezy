"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface SupportContextValue {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const SupportContext = createContext<SupportContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function SupportProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SupportContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </SupportContext.Provider>
  );
}

export const useSupportModal = () => useContext(SupportContext);
