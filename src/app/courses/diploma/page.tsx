import { redirect } from "next/navigation";
import { COURSE_LINKS } from "@/lib/constants";

export default function DiplomaCoursePage() {
  redirect(COURSE_LINKS.diploma);
}
