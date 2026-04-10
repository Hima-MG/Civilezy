import { redirect } from "next/navigation";
import { COURSE_LINKS } from "@/lib/constants";

export default function SurveyorCoursePage() {
  redirect(COURSE_LINKS.surveyor);
}
