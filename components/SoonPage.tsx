import { useTranslations } from "next-intl";

export default function SoonPage({ label }: { label: string }) {
  const t = useTranslations("soon");
  return (
    <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-32 md:py-48">
      <p className="text-eyebrow mb-6">{label}</p>
      <h1 className="text-display" style={{ fontSize: "var(--step-3)" }}>
        {t("title")}
        <span className="text-[color:var(--accent)]">.</span>
      </h1>
      <p className="mt-6 max-w-xl text-[color:var(--fg-muted)]">{t("body")}</p>
    </section>
  );
}
