import { COURSES } from "@/data/courseData";
import CoursePage from "@/components/courses/CoursePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Civil PSC B.Tech Course | CivilEzy — Kerala's #1 Civil Engineering Platform",
  description: "B.Tech / AE level Civil PSC preparation on CivilEzy. Pool-mapped syllabus for PWD, Irrigation, LSGD, KWA, PCB. Rank Booster lessons, AE Mock Tests & Malayalam audio. Starting ₹2,500/month.",
  openGraph: {
    title: "Civil PSC B.Tech Course | CivilEzy",
    url: "https://civilezy.in/courses/btech",
    siteName: "CivilEzy",
    type: "website",
  },
};

export default function BTechCoursePage() {
  return <CoursePage data={COURSES.btech} />;
}
