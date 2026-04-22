import { COURSES } from "@/data/courseData";
import CoursePage from "@/components/courses/CoursePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Civil PSC Diploma Course | CivilEzy — Kerala's #1 Civil Engineering Platform",
  description: "Diploma level Civil PSC preparation on CivilEzy. Pool-mapped syllabus for PWD, Irrigation, LSGD, KWA, Harbour, KSEB. Malayalam audio lessons, smart quiz & game arena. Starting ₹2,000/month.",
  openGraph: {
    title: "Civil PSC Diploma Course | CivilEzy",
    url: "https://civilezy.in/courses/diploma",
    siteName: "CivilEzy",
    type: "website",
  },
};

export default function DiplomaCoursePage() {
  return <CoursePage data={COURSES.diploma} />;
}
