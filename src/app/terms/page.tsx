import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function TermsPage() {
  redirect(EXTERNAL_URLS.legal.terms);
}
