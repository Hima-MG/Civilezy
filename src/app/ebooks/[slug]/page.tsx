export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import EbookDetailPage from "@/components/ebooks/EbookDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return {
    title: `${title} – E-Book | CivilEzy`,
    description: `Kerala PSC Civil Engineering Quick Revision E-Book. Syllabus-based content for ${title}.`,
    openGraph: {
      title: `${title} – E-Book | CivilEzy`,
      url: `https://civilezy.in/ebooks/${slug}`,
      siteName: "CivilEzy",
    },
  };
}

export default async function EbookDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <EbookDetailPage slug={slug} />;
}
