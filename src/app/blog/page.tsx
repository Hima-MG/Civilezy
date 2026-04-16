import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function BlogPage() {
  redirect(EXTERNAL_URLS.blog);
}
