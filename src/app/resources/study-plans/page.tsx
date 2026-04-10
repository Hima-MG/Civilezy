import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function StudyPlansPage() {
  redirect(EXTERNAL_URLS.base);
}
