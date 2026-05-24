import { getTranslations, setRequestLocale } from "next-intl/server";
import TimelineRow, { type TimelineEntry } from "@/components/TimelineRow";

type Advantage = { title: string; body: string };
type Honor = { year: string; title: string };
type SkillGroup = { group: string; items: string[] };
type Education = {
  label: string;
  school: string;
  degree: string;
  period: string;
};

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
  const advantages = t.raw("about.advantages") as Advantage[];
  const honors = t.raw("about.honors") as Honor[];
  const writings = t.raw("about.writings") as string[];
  const skills = t.raw("about.skills") as SkillGroup[];
  const education = t.raw("about.education") as Education;

  return (
    <>
      {/* ───── Title ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-24 pb-12">
        <p className="text-eyebrow mb-6">{t("about.label")}</p>
        <h1 className="text-display" style={{ fontSize: "var(--step-3)" }}>
          {t("about.title")}
          <span className="text-[color:var(--accent)]">.</span>
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)]">
          {t("about.realName")}
        </p>
      </section>

      {/* ───── Intro ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pb-16">
        <div className="grid md:grid-cols-[1fr_2fr] gap-10">
          <p
            className="text-display text-[color:var(--fg)]"
            style={{ fontSize: "var(--step-2)", lineHeight: 1.25 }}
          >
            <span className="text-[color:var(--accent)]">&ldquo;</span>
            {t("about.intro")}
            <span className="text-[color:var(--accent)]">&rdquo;</span>
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

      {/* ───── Education ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-16">
        <div className="grid md:grid-cols-[200px_1fr] gap-6 items-baseline">
          <p className="text-eyebrow">{education.label}</p>
          <div>
            <h3
              className="text-display"
              style={{ fontSize: "var(--step-2)", lineHeight: 1.2 }}
            >
              {education.school}
            </h3>
            <p className="mt-2 text-[color:var(--fg-muted)]">
              {education.degree}{" "}
              <span className="opacity-50">·</span> {education.period}
            </p>
          </div>
        </div>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── Experience ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-20">
        <h2 className="text-eyebrow mb-10">{t("about.experienceLabel")}</h2>
        <ol>
          {timeline.map((row) => (
            <TimelineRow key={row.year} entry={row} variant="about" />
          ))}
        </ol>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── 核心优势 ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-20">
        <h2 className="text-eyebrow mb-10">{t("about.advantagesLabel")}</h2>
        <ol className="grid gap-px md:grid-cols-2 bg-[color:var(--border)]">
          {advantages.map((a, i) => (
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
                {a.title}
              </h3>
              <p className="text-sm text-[color:var(--fg-muted)] leading-relaxed">
                {a.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── 荣誉 + 行业输出 ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-20">
        <div className="grid md:grid-cols-2 gap-px bg-[color:var(--border)]">
          {/* Honors */}
          <div className="bg-[color:var(--bg)] p-8 md:p-10">
            <h2 className="text-eyebrow mb-8">{t("about.honorsLabel")}</h2>
            <ul className="space-y-5">
              {honors.map((h, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-5 pb-5 border-b border-[color:var(--border)] last:border-0"
                >
                  <span className="font-mono text-sm text-[color:var(--accent)] tracking-wider shrink-0 w-12">
                    {h.year}
                  </span>
                  <span
                    className="text-display"
                    style={{ fontSize: "var(--step-1)", lineHeight: 1.3 }}
                  >
                    {h.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Writings */}
          <div className="bg-[color:var(--bg)] p-8 md:p-10">
            <h2 className="text-eyebrow mb-8">{t("about.writingsLabel")}</h2>
            <ol className="space-y-5">
              {writings.map((w, i) => (
                <li
                  key={i}
                  className="flex gap-4 pb-5 border-b border-[color:var(--border)] last:border-0"
                >
                  <span className="font-mono text-xs text-[color:var(--fg-muted)] mt-1 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-[color:var(--fg)]/90"
                    style={{ fontSize: "var(--step-0)", lineHeight: 1.55 }}
                  >
                    {w}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── 专业技能 ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-20">
        <h2 className="text-eyebrow mb-10">{t("about.skillsLabel")}</h2>
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-[color:var(--border)]">
          {skills.map((s, i) => (
            <li
              key={i}
              className="bg-[color:var(--bg)] p-6 md:p-8"
            >
              <p className="font-mono text-xs text-[color:var(--accent)] tracking-[0.18em] uppercase mb-4">
                / {String(i + 1).padStart(2, "0")}
              </p>
              <h3
                className="text-display mb-4"
                style={{ fontSize: "var(--step-1)", lineHeight: 1.25 }}
              >
                {s.group}
              </h3>
              <ul className="space-y-2">
                {s.items.map((item, j) => (
                  <li
                    key={j}
                    className="text-sm text-[color:var(--fg-muted)] leading-relaxed"
                  >
                    · {item}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
