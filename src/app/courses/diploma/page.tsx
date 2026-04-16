import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function DiplomaCoursePage() {
  redirect(EXTERNAL_URLS.checkout.diploma);
}
