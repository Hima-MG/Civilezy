import type { Timestamp } from "firebase/firestore";

export interface Ebook {
  id: string;
  title: string;
  slug: string;
  exam: string;
  level: string;
  description: string;
  coverImage: string;
  price: number;
  validityDate: string;
  previewUrl: string;
  purchaseUrl: string;
  features: string[];
  modules: string[];
  featured: boolean;
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type EbookInput = Omit<Ebook, "id" | "createdAt" | "updatedAt">;
