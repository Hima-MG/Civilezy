import { redirect } from "next/navigation";
import { COURSE_LINKS } from "@/lib/constants";

export default function KWACoursePage() {
  redirect(COURSE_LINKS.kwa);
}
