import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function AboutPage() {
  redirect(EXTERNAL_URLS.about);
}
