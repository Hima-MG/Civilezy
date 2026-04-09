import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function PrivacyPolicyPage() {
  redirect(EXTERNAL_URLS.privacy);
}
