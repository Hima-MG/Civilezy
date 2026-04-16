import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function SurveyorCoursePage() {
  redirect(EXTERNAL_URLS.checkout.surveyor);
}
