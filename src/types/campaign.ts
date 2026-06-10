import type { Timestamp } from "firebase/firestore";

// ── Campaign Plan ──────────────────────────────────────────────────────────────

export interface CampaignPlan {
  id: string;
  title: string;
  originalPrice: number;
  offerPrice: number;
  couponCode?: string;
  previewUrl?: string;
  purchaseUrl?: string;
  showPreview?: boolean;
  badge?: string;
  featured?: boolean;
  order?: number;
}

// ── Campaign ───────────────────────────────────────────────────────────────────

export interface Campaign {
  id: string;
  title: string;
  subtitle?: string;
  enabled: boolean;
  featured?: boolean;
  bannerText?: string;
  badge?: string;
  description?: string;
  expiryDate?: Timestamp | null;
  backgroundStyle?: "glass" | "gradient" | "solid";
  theme?: "orange" | "red" | "green" | "blue" | "purple" | "gold";
  plans: CampaignPlan[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export type CampaignInput = Omit<Campaign, "id" | "createdAt" | "updatedAt">;
