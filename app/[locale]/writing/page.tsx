import { setRequestLocale } from "next-intl/server";
import SoonPage from "@/components/SoonPage";

export default async function WritingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SoonPage label="WRITING" />;
}
