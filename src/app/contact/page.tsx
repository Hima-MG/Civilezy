import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function ContactPage() {
  redirect(EXTERNAL_URLS.contact);
}
