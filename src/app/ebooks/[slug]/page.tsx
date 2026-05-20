import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EBOOKS, getEbookBySlug } from "@/data/ebookData";
import EbookDetailPage from "@/components/ebooks/EbookDetailPage";

export function generateStaticParams() {
  return EBOOKS.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const ebook = getEbookBySlug(params.slug);
  if (!ebook) return {};
  return {
    title: `${ebook.title} – ${ebook.subtitle}`,
    description: `${ebook.title} for ${ebook.subtitle}. ${ebook.level} | ${ebook.features.slice(0, 3).join(", ")} | ${ebook.priceDisplay} | ${ebook.validity}`,
    openGraph: {
      title: `${ebook.title} – ${ebook.subtitle}`,
      description: `Kerala PSC quick revision guide for ${ebook.subtitle}. Covers ${ebook.modules.length} modules and includes 20 model exams.`,
      url: `https://civilezy.in/ebooks/${ebook.slug}`,
      siteName: "CivilEzy",
    },
  };
}

export default function EbookDetailRoute({
  params,
}: {
  params: { slug: string };
}) {
  const ebook = getEbookBySlug(params.slug);
  if (!ebook) notFound();

  return <EbookDetailPage ebook={ebook} />;
}
