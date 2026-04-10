import { redirect } from "next/navigation";
import { COURSE_LINKS } from "@/lib/constants";

export default function ITICoursePage() {
  redirect(COURSE_LINKS.iti);
}
