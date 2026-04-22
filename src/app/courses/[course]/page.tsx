import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COURSES } from "@/data/courseData";
import CoursePage from "@/components/courses/CoursePage";

type Props = { params: { course: string } };

// ── Per-course SEO config ─────────────────────────────────────────────────────
const SEO_CONFIG: Record<string, { title: string; description: string; keywords: string[] }> = {
  iti: {
    title:       "PSC Civil ITI Course Kerala | Civilezy",
    description: "Complete PSC Civil ITI course with live classes, quizzes, and structured preparation. Pool-mapped syllabus for KWA, PWD, LSGD & Irrigation. Powered by Wincentre (4.8⭐).",
    keywords: [
      "iti civil psc kerala",
      "kerala psc civil coaching",
      "civil engineering psc course",
      "psc mock test kerala",
      "iti overseer psc preparation",
      "draughtsman psc coaching kerala",
      "kwa psc preparation iti",
      "pwd overseer iti kerala",
      "lsgd overseer coaching",
      "civil iti psc malayalam",
      "wincentre iti coaching",
    ],
  },
  diploma: {
    title:       "PSC Civil Diploma Course Kerala | Civilezy",
    description: "Best PSC Civil Diploma course in Kerala. Covers PWD, Irrigation, LSGD, KWA, Harbour & KSEB pools. Malayalam audio lessons, live classes, smart quiz system. Powered by Wincentre (4.8⭐).",
    keywords: [
      "diploma civil psc kerala",
      "kerala psc civil coaching",
      "civil engineering psc course",
      "psc mock test kerala",
      "diploma overseer psc preparation",
      "pwd overseer diploma kerala",
      "irrigation overseer coaching",
      "lsgd overseer diploma",
      "harbour engineering psc",
      "civil diploma psc malayalam",
      "wincentre diploma coaching",
    ],
  },
  btech: {
    title:       "PSC Civil B.Tech AE Course Kerala | Civilezy",
    description: "Kerala's #1 Assistant Engineer (AE) PSC preparation course for B.Tech Civil graduates. Rank Booster lessons, AE mock tests, Malayalam audio. Covers PWD, Irrigation, LSGD, KWA & PCB. Powered by Wincentre (4.8⭐).",
    keywords: [
      "ae civil coaching kerala",
      "kerala psc civil coaching",
      "civil engineering psc course",
      "psc mock test kerala",
      "assistant engineer psc preparation",
      "btech civil psc kerala",
      "pwd ae coaching kerala",
      "irrigation ae psc preparation",
      "civil ae mock test kerala",
      "btech civil psc malayalam",
      "wincentre ae coaching",
    ],
  },
  surveyor: {
    title:       "PSC Surveyor Course Kerala | Civilezy",
    description: "Kerala's only dedicated Surveyor PSC preparation course. Covers KWA, Survey & Land Records, Technical Education & Groundwater Dept. GPS, Total Station, Land Acts. Powered by Wincentre (4.8⭐).",
    keywords: [
      "surveyor psc kerala",
      "kerala psc civil coaching",
      "civil engineering psc course",
      "psc mock test kerala",
      "surveyor grade psc preparation",
      "kwa surveyor coaching",
      "land records psc kerala",
      "total station psc questions",
      "surveyor grade 2 kerala",
      "surveyor psc malayalam",
      "wincentre surveyor coaching",
    ],
  },
};

// ── JSON-LD schema builder ────────────────────────────────────────────────────
function buildSchema(courseKey: string, data: (typeof COURSES)[string]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type":  "EducationalOrganization",
        "@id":    "https://civilezy.in/#organization",
        name:     "Civilezy",
        alternateName: "Civilezy by Wincentre",
        url:      "https://civilezy.in",
        logo: {
          "@type": "ImageObject",
          url:     "https://civilezy.in/civilezy_logo_orange.png",
          width:   240,
          height:  68,
        },
        parentOrganization: {
          "@type": "Organization",
          name:    "Wincentre",
          url:     "https://learn.civilezy.in",
        },
        contactPoint: {
          "@type":            "ContactPoint",
          telephone:          "+91-90745-57825",
          contactType:        "customer support",
          availableLanguage:  ["English", "Malayalam"],
        },
        aggregateRating: {
          "@type":       "AggregateRating",
          ratingValue:   "4.8",
          reviewCount:   "445",
          bestRating:    "5",
          worstRating:   "1",
        },
        sameAs: [
          "https://www.youtube.com/@CivilEzy-youtube",
          "https://www.instagram.com/civilezy_by_wincentre",
        ],
      },
      {
        "@type":       "Course",
        "@id":         `https://civilezy.in/courses/${courseKey}#course`,
        name:          data.title,
        description:   SEO_CONFIG[courseKey]?.description ?? data.subtitle,
        url:           `https://civilezy.in/courses/${courseKey}`,
        provider: {
          "@id": "https://civilezy.in/#organization",
        },
        inLanguage:    ["en", "ml"],
        courseMode:    ["online"],
        educationalLevel: "professional",
        audience: {
          "@type":         "Audience",
          audienceType:    "Kerala PSC Civil Engineering aspirants",
          geographicArea:  "Kerala, India",
        },
        offers: {
          "@type":          "Offer",
          price:            String(data.pricing.monthly),
          priceCurrency:    "INR",
          availability:     "https://schema.org/InStock",
          url:              data.pricing.checkoutUrl,
          priceSpecification: {
            "@type":        "UnitPriceSpecification",
            price:          String(data.pricing.monthly),
            priceCurrency:  "INR",
            unitText:       "MONTH",
          },
        },
      },
      {
        "@type":    "BreadcrumbList",
        "@id":      `https://civilezy.in/courses/${courseKey}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",    item: "https://civilezy.in" },
          { "@type": "ListItem", position: 2, name: "Courses", item: "https://civilezy.in/pricing" },
          { "@type": "ListItem", position: 3, name: data.title, item: `https://civilezy.in/courses/${courseKey}` },
        ],
      },
    ],
  };
}

// ── generateStaticParams ──────────────────────────────────────────────────────
export function generateStaticParams() {
  return Object.keys(COURSES).map((course) => ({ course }));
}

// ── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = COURSES[params.course];
  if (!data) return {};

  const seo  = SEO_CONFIG[params.course];
  const url  = `https://civilezy.in/courses/${params.course}`;

  return {
    title:       { absolute: seo.title },
    description: seo.description,
    keywords:    seo.keywords,

    alternates: { canonical: url },

    openGraph: {
      title:       seo.title,
      description: seo.description,
      url,
      siteName:    "CivilEzy",
      type:        "website",
      locale:      "en_IN",
      images: [{ url: "https://civilezy.in/civilezy_logo_orange.png", width: 1200, height: 630, alt: seo.title }],
    },

    twitter: {
      card:        "summary_large_image",
      title:       seo.title,
      description: seo.description,
      images:      ["https://civilezy.in/civilezy_logo_orange.png"],
    },

    robots: {
      index:          true,
      follow:         true,
      googleBot: { index: true, follow: true },
    },
  };
}

// ── Page component ────────────────────────────────────────────────────────────
export default function Page({ params }: Props) {
  const data = COURSES[params.course];
  if (!data) notFound();

  const schema = buildSchema(params.course, data);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <CoursePage data={data} courseKey={params.course} />
    </>
  );
}
