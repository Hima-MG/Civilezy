import { COURSES } from "@/data/courseData";
import CoursePage from "@/components/courses/CoursePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Surveyor Civil PSC Course | CivilEzy — Kerala's #1 Civil Engineering Platform",
  description: "Surveyor grade Civil PSC preparation on CivilEzy. Dedicated syllabus for KWA, Survey & Land Records, Tech Education, Groundwater Dept. Land Acts, GPS, Total Station covered. Starting ₹1,800/month.",
  openGraph: {
    title: "Surveyor Civil PSC Course | CivilEzy",
    url: "https://civilezy.in/courses/surveyor",
    siteName: "CivilEzy",
    type: "website",
  },
};

export default function SurveyorCoursePage() {
  return <CoursePage data={COURSES.surveyor} />;
}
