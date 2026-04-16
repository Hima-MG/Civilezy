import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function StoriesPage() {
  redirect(EXTERNAL_URLS.dashboard);
}
