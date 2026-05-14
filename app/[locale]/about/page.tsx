import { getTranslations, setRequestLocale } from "next-intl/server";
import TimelineRow, { type TimelineEntry } from "@/components/TimelineRow";

type Belief = { title: string; body: string };

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const paragraphs = t.raw("about.paragraphs") as string[];
  const timeline = t.raw("timeline") as TimelineEntry[];
  const beliefs = t.raw("about.beliefs") as Belief[];

  return (
    <>
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-24 pb-12">
        <p className="text-eyebrow mb-6">{t("about.label")}</p>
        <h1 className="text-display" style={{ fontSize: "var(--step-3)" }}>
          {t("about.title")}
          <span className="text-[color:var(--accent)]">.</span>
        </h1>
      </section>

      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pb-16">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <p
            className="text-display text-[color:var(--fg)]"
            style={{ fontSize: "var(--step-2)", lineHeight: 1.25 }}
          >
            <span className="text-[color:var(--accent)]">"</span>
            {t("about.intro")}
            <span className="text-[color:var(--accent)]">"</span>
          </p>
          <div
            className="space-y-5 text-[color:var(--fg)]/85"
            style={{ fontSize: "var(--step-0)", lineHeight: 1.7 }}
          >
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-20">
        <h2 className="text-eyebrow mb-10">{t("about.experienceLabel")}</h2>
        <ol>
          {timeline.map((row) => (
            <TimelineRow key={row.year} entry={row} variant="about" />
          ))}
        </ol>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-20">
        <h2 className="text-eyebrow mb-10">{t("about.beliefsLabel")}</h2>
        <ol className="grid gap-px md:grid-cols-2 bg-[color:var(--border)]">
          {beliefs.map((b, i) => (
            <li
              key={i}
              className="bg-[color:var(--bg)] p-8 md:p-10 hover:bg-[color:var(--paper-deep)] transition-colors"
            >
              <span className="font-mono text-xs text-[color:var(--accent)]">
                / {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="text-display mt-4 mb-3"
                style={{ fontSize: "var(--step-1)", lineHeight: 1.25 }}
              >
                {b.title}
              </h3>
              <p className="text-sm text-[color:var(--fg-muted)] leading-relaxed">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
