import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { EXTERNAL_URLS } from "@/lib/constants";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  redirect(EXTERNAL_URLS.login);
}
