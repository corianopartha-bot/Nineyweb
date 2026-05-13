import { setRequestLocale } from "next-intl/server";
import SoonPage from "@/components/SoonPage";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SoonPage label="CONTACT" />;
}
