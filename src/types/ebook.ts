import type { Timestamp } from "firebase/firestore";

export interface Promotion {
  enabled: boolean;
  offerType: "discount" | "launch" | "bundle" | "limited";
  badgeText: string;
  bannerText: string;
  originalPrice: number;
  offerPrice: number;
  couponCode: string;
  couponEnabled: boolean;
  expiryDate: Timestamp | null;
  featured: boolean;
  showCountdown: boolean;
  showBanner: boolean;
  bannerColor: "orange" | "red" | "green" | "purple";
  discountPercentage: number;
}

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
  productCategory?: "single" | "bundle" | "ultimate";
  promotion?: Promotion;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type EbookInput = Omit<Ebook, "id" | "createdAt" | "updatedAt">;
