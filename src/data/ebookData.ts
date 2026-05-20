export interface EbookData {
  slug: string;
  title: string;
  subtitle: string;
  badge: string;
  level: string;
  category: string;
  price: number;
  priceDisplay: string;
  validity: string;
  examDate: string;
  targetExams: string[];
  modules: string[];
  features: string[];
  previewLink: string;
  purchaseLink: string;
  tagline: string;
  isNew?: boolean;
  examBadge?: string;
}

export const EBOOKS: EbookData[] = [
  {
    slug: "overseer-gr1-instructor",
    title: "Quick Revision E-Book",
    subtitle: "Overseer GR.1 / Instructor",
    badge: "DIPLOMA CIVIL LEVEL",
    level: "Diploma Civil Level",
    category: "Diploma",
    price: 2000,
    priceDisplay: "₹2,000",
    validity: "Valid Upto 30-06-2026",
    examDate: "2026-06-30",
    targetExams: ["Overseer GR.1", "Instructor"],
    modules: [
      "Surveying I",
      "Surveying II",
      "Construction Materials",
      "Construction Technology",
      "Theory of Structures",
      "Quantity Surveying",
      "Irrigation Engineering",
      "Geotechnical Engineering",
      "Transportation Engineering",
      "Environmental Engineering",
    ],
    features: [
      "Syllabus Based",
      "Save Time, Study Smart",
      "Easy to Revise",
      "Perfect for Fast Preparation",
      "Clear Exam-Oriented Revision",
      "20 Model Exams Available",
    ],
    previewLink:
      "https://learn.civilezy.in/checkout/?product_id=6085&product_type=membership&price_id=285895",
    purchaseLink:
      "https://learn.civilezy.in/checkout?product_id=6085&product_type=membership&price_id=285895",
    tagline: "Smart Revision Today, Success Tomorrow!",
    isNew: true,
    examBadge: "Most Useful for June 30 Exam",
  },
];

export function getEbookBySlug(slug: string): EbookData | undefined {
  return EBOOKS.find((e) => e.slug === slug);
}
