export type FaqCategory =
  | "General"
  | "Membership"
  | "Courses"
  | "ITI"
  | "Diploma"
  | "BTech"
  | "Surveyor"
  | "EBooks"
  | "Payments"
  | "Support"
  | "Technical"
  | "Study Circle";

export const FAQ_CATEGORIES: FaqCategory[] = [
  "General",
  "Membership",
  "Courses",
  "ITI",
  "Diploma",
  "BTech",
  "Surveyor",
  "EBooks",
  "Payments",
  "Support",
  "Technical",
  "Study Circle",
];

export interface AiFaq {
  id?: string;
  question: string;
  answer: string;
  category: FaqCategory;
  keywords: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  source?: "faq" | "ai" | "error";
  confidence?: number;
}

export interface UnansweredQuery {
  id?: string;
  question: string;
  userId: string;
  timestamp: string;
  status: "pending" | "reviewed" | "converted_to_faq";
  adminResponse?: string;
}

export interface ChatbotAnalytics {
  id?: string;
  date: string;
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
  faqHits: number;
  aiGeneratedAnswers: number;
}

export interface ChatApiResponse {
  response: string;
  source: "faq" | "ai" | "error";
  confidence: number;
  faqId?: string;
  error?: string;
}
