import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function NotificationsPage() {
  redirect(EXTERNAL_URLS.base);
}
