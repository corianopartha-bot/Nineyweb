import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-24 md:pt-36 pb-28">
        <p className="text-eyebrow mb-8">{t("hero.intro")}</p>
        <h1
          className="text-display"
          style={{ fontSize: "var(--step-4)" }}
        >
          {t("site.tagline")}
          <span className="caret" aria-hidden />
        </h1>

        <div className="mt-12 grid gap-3 max-w-2xl text-[color:var(--fg-muted)]">
          <p style={{ fontSize: "var(--step-1)" }}>{t("hero.lineA")}</p>
          <p style={{ fontSize: "var(--step-1)" }}>{t("hero.lineB")}</p>
          <p style={{ fontSize: "var(--step-1)" }}>{t("hero.lineC")}</p>
        </div>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── Selected Writing (placeholder) ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-eyebrow">{t("sections.selectedWriting")}</h2>
          <Link
            href="/writing"
            className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]"
          >
            {t("sections.viewAll")} →
          </Link>
        </div>

        <ul className="divide-y divide-[color:var(--border)]">
          {[1, 2, 3].map((n) => (
            <li key={n} className="py-8 grid md:grid-cols-[80px_1fr_auto] items-baseline gap-4">
              <span className="font-mono text-xs text-[color:var(--fg-muted)]">
                {String(n).padStart(2, "0")}
              </span>
              <h3
                className="text-display"
                style={{ fontSize: "var(--step-2)" }}
              >
                文章标题占位 — 等 S2 接 MDX
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-muted)]">
                Draft
              </span>
            </li>
          ))}
        </ul>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── Selected Projects (placeholder) ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-eyebrow">{t("sections.selectedProjects")}</h2>
          <Link
            href="/projects"
            className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]"
          >
            {t("sections.viewAll")} →
          </Link>
        </div>

        <ul className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <li
              key={n}
              className="aspect-[4/5] border border-[color:var(--border)] p-6 flex flex-col justify-between hover:border-[color:var(--accent)] transition-colors"
            >
              <span className="font-mono text-xs text-[color:var(--fg-muted)]">
                P/{String(n).padStart(2, "0")}
              </span>
              <div>
                <h3 className="text-display text-2xl mb-2">项目 {n}</h3>
                <p className="text-sm text-[color:var(--fg-muted)]">S3 接入</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
