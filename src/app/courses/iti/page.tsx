import { COURSES } from "@/data/courseData";
import CoursePage from "@/components/courses/CoursePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "PSC Civil ITI Course Kerala | Civilezy" },
  description: "ITI level Civil PSC preparation on CivilEzy. Pool-mapped syllabus for KWA, PWD, LSGD, Irrigation. Malayalam audio lessons, smart quiz system & game arena. Starting ₹1,800/month.",
  openGraph: {
    title: "Civil PSC ITI Course | CivilEzy",
    url: "https://civilezy.in/courses/iti",
    siteName: "CivilEzy",
    type: "website",
  },
};

export default function ITICoursePage() {
  return <CoursePage data={COURSES.iti} />;
}
