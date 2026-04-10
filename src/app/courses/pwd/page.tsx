import { redirect } from "next/navigation";
import { COURSE_LINKS } from "@/lib/constants";

export default function PWDCoursePage() {
  redirect(COURSE_LINKS.pwd);
}
