import { redirect } from "next/navigation";
import { COURSE_LINKS } from "@/lib/constants";

export default function BTechCoursePage() {
  redirect(COURSE_LINKS.btech);
}
