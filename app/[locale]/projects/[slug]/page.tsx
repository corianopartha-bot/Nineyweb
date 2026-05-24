import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projects, getProject } from "@/lib/projects";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    projects.map((p) => ({ locale, slug: p.slug }))
  );
}

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();
  const lang = (locale === "en" ? "en" : "zh") as "zh" | "en";

  const labels =
    lang === "zh"
      ? {
          back: "← 返回项目",
          result: "结果",
          designLogic: "设计逻辑",
          modules: "核心模块",
          value: "产品价值",
          loop: "工作流",
          context: "项目概况",
        }
      : {
          back: "← All projects",
          result: "Result",
          designLogic: "Design logic",
          modules: "Core modules",
          value: "Product value",
          loop: "Working loop",
          context: "Overview",
        };

  return (
    <article className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-20 pb-32">
      <Link
        href="/projects"
        className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] mb-8"
      >
        {labels.back}
      </Link>

      {/* ───── Spotlight hero card ───── */}
      <section className="rounded-sm border border-[color:var(--border)] bg-[color:var(--paper-deep)]/40 p-8 md:p-12">
        {/* Tags + meta */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {project.tags[lang].map((tag, i) => (
            <span
              key={tag}
              className={`font-mono text-[10px] uppercase tracking-[0.18em] px-3 py-1 border ${
                i === 0
                  ? "border-[color:var(--accent)] text-[color:var(--accent)] bg-[color:var(--accent-tint)]"
                  : "border-[color:var(--border)] text-[color:var(--fg-muted)]"
              }`}
            >
              {tag}
            </span>
          ))}
          <span className="ml-auto font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)]">
            {project.year} · {project.role[lang]} ·{" "}
            <span className="text-[color:var(--accent)]">{project.status}</span>
          </span>
        </div>

        <h1
          className="text-display"
          style={{ fontSize: "var(--step-4)", lineHeight: 1.05 }}
        >
          {project.title[lang]}
        </h1>

        <p
          className="mt-6 max-w-3xl text-[color:var(--fg-muted)]"
          style={{ fontSize: "var(--step-1)", lineHeight: 1.55 }}
        >
          {project.tagline[lang]}
        </p>

        {/* Mini-card grid */}
        <div className="mt-10 grid md:grid-cols-2 gap-px bg-[color:var(--border)]">
          {project.miniCards.map((card) => (
            <div
              key={card.kicker.zh}
              className="bg-[color:var(--bg)] p-6 md:p-8"
            >
              <p className="text-eyebrow mb-3">{card.kicker[lang]}</p>
              <p
                className="text-[color:var(--fg)]/85"
                style={{ fontSize: "var(--step-0)", lineHeight: 1.7 }}
              >
                {card.body[lang]}
              </p>
            </div>
          ))}
        </div>

        {/* 4-step loop */}
        <div className="mt-10">
          <p className="text-eyebrow mb-5">{labels.loop}</p>
          <ol className="grid md:grid-cols-4 gap-px bg-[color:var(--border)]">
            {project.loop.map((step) => (
              <li
                key={step.index}
                className="bg-[color:var(--bg)] p-6 flex flex-col gap-3 min-h-[160px]"
              >
                <span
                  className="text-display text-[color:var(--accent)]"
                  style={{ fontSize: "var(--step-2)", lineHeight: 1 }}
                >
                  {step.index}
                </span>
                <p
                  className="text-[color:var(--fg)]/85"
                  style={{ fontSize: "var(--step--1)", lineHeight: 1.65 }}
                >
                  {step.body[lang]}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───── Result strip ───── */}
      <div className="mt-12 grid md:grid-cols-[200px_1fr] gap-6 py-8 border-y border-[color:var(--border)]">
        <p className="text-eyebrow">{labels.result}</p>
        <p
          className="text-display"
          style={{ fontSize: "var(--step-2)", lineHeight: 1.3 }}
        >
          {project.result[lang]}
        </p>
      </div>

      {/* ───── Side-grid trio ───── */}
      <section className="mt-16 grid lg:grid-cols-[1.2fr_1fr_1fr] gap-px bg-[color:var(--border)]">
        {/* 设计逻辑 */}
        <div className="bg-[color:var(--bg)] p-8 md:p-10">
          <p className="text-eyebrow mb-4">{labels.designLogic}</p>
          <h3
            className="text-display mb-4"
            style={{ fontSize: "var(--step-1)", lineHeight: 1.25 }}
          >
            {project.designLogic.heading[lang]}
          </h3>
          <p
            className="text-[color:var(--fg-muted)]"
            style={{ fontSize: "var(--step-0)", lineHeight: 1.75 }}
          >
            {project.designLogic.body[lang]}
          </p>
        </div>

        {/* 核心模块 */}
        <div className="bg-[color:var(--bg)] p-8 md:p-10">
          <p className="text-eyebrow mb-4">{labels.modules}</p>
          <ul className="space-y-3">
            {project.modules[lang].map((m, i) => (
              <li
                key={i}
                className="flex gap-3 text-[color:var(--fg)]/85"
                style={{ fontSize: "var(--step--1)", lineHeight: 1.65 }}
              >
                <span className="font-mono text-xs text-[color:var(--accent)] mt-1 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 产品价值 */}
        <div className="bg-[color:var(--bg)] p-8 md:p-10">
          <p className="text-eyebrow mb-4">{labels.value}</p>
          <ul className="space-y-3">
            {project.value[lang].map((v, i) => (
              <li
                key={i}
                className="flex gap-3 text-[color:var(--fg)]/85"
                style={{ fontSize: "var(--step--1)", lineHeight: 1.65 }}
              >
                <span className="font-mono text-xs text-[color:var(--accent)] mt-1 shrink-0">
                  /
                </span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
