import type { Metadata } from "next";
import EbooksListing from "@/components/ebooks/EbooksListing";

export const metadata: Metadata = {
  title: "E-Books – Quick Revision Guides",
  description:
    "Kerala PSC Civil Engineering Quick Revision E-Books. Syllabus-based, concise revision guides for Overseer GR.1, Instructor and more. Free preview available.",
  openGraph: {
    title: "E-Books – Quick Revision Guides | CivilEzy",
    description:
      "Kerala PSC Civil Engineering Quick Revision E-Books. Syllabus-based, concise revision guides for Overseer GR.1, Instructor and more.",
    url: "https://civilezy.in/ebooks",
    siteName: "CivilEzy",
  },
};

export default function EbooksPage() {
  return <EbooksListing />;
}
