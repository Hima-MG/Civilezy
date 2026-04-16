import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function ITICoursePage() {
  redirect(EXTERNAL_URLS.checkout.iti);
}
