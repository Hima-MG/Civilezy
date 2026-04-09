import { redirect } from "next/navigation";
import { EXTERNAL_URLS } from "@/lib/constants";

export default function LoginPage() {
  redirect(EXTERNAL_URLS.login);
}
