import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import HeroPulse from "@/components/HeroPulse";
import Ticker from "@/components/Ticker";
import Chips from "@/components/Chips";
import TimelineRow, { type TimelineEntry } from "@/components/TimelineRow";
import { projects } from "@/lib/projects";
import { listPostsMeta } from "@/lib/posts";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lang = (locale === "en" ? "en" : "zh") as "zh" | "en";

  const ticker = t.raw("ticker") as string[];
  const chips = t.raw("exploringChips") as string[];
  const timeline = t.raw("timeline") as TimelineEntry[];
  const recent = timeline.slice(0, 3);
  const featuredProjects = projects.slice(0, 3);
  const featuredPosts = (await listPostsMeta(locale)).slice(0, 3);

  return (
    <>
      {/* ───── Hero ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-20 md:pt-28 pb-20">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <p className="text-eyebrow mb-8">{t("hero.intro")}</p>
            <h1 className="text-display" style={{ fontSize: "var(--step-4)" }}>
              {t("site.tagline")}
              <span className="caret" aria-hidden />
            </h1>

            <div className="mt-10 grid gap-3 max-w-2xl text-[color:var(--fg-muted)]">
              <p style={{ fontSize: "var(--step-1)" }}>{t("hero.lineA")}</p>
              <p style={{ fontSize: "var(--step-1)" }}>{t("hero.lineB")}</p>
              <p style={{ fontSize: "var(--step-1)" }}>{t("hero.lineC")}</p>
            </div>

            <div className="mt-12">
              <p className="text-eyebrow mb-3">{t("home.exploring")}</p>
              <Chips items={chips} />
            </div>
          </div>

          <div className="hidden lg:flex justify-center text-[color:var(--fg)]">
            <HeroPulse />
          </div>
        </div>
      </section>

      <Ticker items={ticker} />

      {/* ───── Recent Experience ───── */}
      <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-eyebrow">{t("home.recent")}</h2>
          <Link
            href="/about"
            className="font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)]"
          >
            {t("home.viewFullCv")} →
          </Link>
        </div>
        <ol>
          {recent.map((row) => (
            <TimelineRow key={row.year} entry={row} variant="home" />
          ))}
        </ol>
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── Selected Writing ───── */}
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

        {featuredPosts.length === 0 ? (
          <p className="text-[color:var(--fg-muted)] font-mono text-sm">
            // {lang === "zh" ? "还没有发布文章" : "no posts yet"}
          </p>
        ) : (
          <ul className="divide-y divide-[color:var(--border)]">
            {featuredPosts.map((p, i) => (
              <li key={p.slug}>
                <Link
                  href={`/writing/${p.slug}`}
                  className="py-8 grid md:grid-cols-[80px_minmax(0,1fr)_auto] items-baseline gap-4 group hover:bg-[color:var(--paper-deep)] -mx-3 px-3 rounded-sm transition-colors"
                >
                  <span className="font-mono text-xs text-[color:var(--fg-muted)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="text-display group-hover:text-[color:var(--accent)] transition-colors"
                    style={{ fontSize: "var(--step-2)", lineHeight: 1.2 }}
                  >
                    {p.title}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-muted)]">
                    {p.date} · {p.readingTime}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="rule mx-auto max-w-[var(--container)]" />

      {/* ───── Selected Projects ───── */}
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

        <ul className="grid md:grid-cols-3 gap-px bg-[color:var(--border)]">
          {featuredProjects.map((p, i) => (
            <li key={p.slug} className="bg-[color:var(--bg)]">
              <Link
                href={`/projects/${p.slug}`}
                className="aspect-[4/5] p-6 flex flex-col justify-between hover:bg-[color:var(--paper-deep)] transition-colors group"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-xs text-[color:var(--accent)]">
                    P/{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs text-[color:var(--fg-muted)]">
                    {p.year}
                  </span>
                </div>
                <div>
                  <h3
                    className="text-display mb-2 group-hover:text-[color:var(--accent)] transition-colors"
                    style={{ fontSize: "var(--step-1)", lineHeight: 1.2 }}
                  >
                    {p.title[lang]}
                  </h3>
                  <p className="text-sm text-[color:var(--fg-muted)]">
                    {p.tagline[lang]}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
