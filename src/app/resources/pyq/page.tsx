import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function PYQPage() {
  redirect(EXTERNAL_URLS.freeTest);
}
