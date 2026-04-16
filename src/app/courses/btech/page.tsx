import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function BTechCoursePage() {
  redirect(EXTERNAL_URLS.checkout.btech);
}
