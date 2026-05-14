import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projects, getProject } from "@/lib/projects";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  // All locale × slug combinations.
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

  return (
    <article className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-20 pb-32">
      <Link
        href="/projects"
        className="inline-block font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)] hover:text-[color:var(--accent)] mb-8"
      >
        ← Projects
      </Link>

      <header className="mb-16">
        <div className="flex items-baseline gap-4 mb-6 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--fg-muted)]">
          <span>{project.year}</span>
          <span className="opacity-30">/</span>
          <span>{project.role[lang]}</span>
          <span className="opacity-30">/</span>
          <span className="text-[color:var(--accent)]">{project.status}</span>
        </div>
        <h1 className="text-display" style={{ fontSize: "var(--step-4)" }}>
          {project.title[lang]}
        </h1>
        <p
          className="mt-8 max-w-3xl text-[color:var(--fg-muted)]"
          style={{ fontSize: "var(--step-1)", lineHeight: 1.55 }}
        >
          {project.tagline[lang]}
        </p>
      </header>

      {/* Result strip */}
      <div className="grid md:grid-cols-[200px_1fr] gap-6 py-8 border-y border-[color:var(--border)]">
        <p className="text-eyebrow">{lang === "zh" ? "结果" : "Result"}</p>
        <p className="text-display" style={{ fontSize: "var(--step-2)", lineHeight: 1.3 }}>
          {project.result[lang]}
        </p>
      </div>

      {/* Stub body — S3 swaps for full MDX */}
      <div className="mt-16 grid md:grid-cols-[200px_minmax(0,680px)] gap-6">
        <p className="text-eyebrow">{lang === "zh" ? "完整案例" : "Full case"}</p>
        <div className="prose-niney">
          <p className="text-[color:var(--fg-muted)]" style={{ fontSize: "var(--step-0)", lineHeight: 1.8 }}>
            {lang === "zh"
              ? "完整案例研究正在整理中（背景 / 用户洞察 / 设计取舍 / 落地节奏 / 复盘），将在 Sprint 3 上线。如果你想先聊这个项目，"
              : "The full case study (context / insights / trade-offs / launch cadence / retro) is in the works and lands in Sprint 3. If you'd like to chat about this one first, "}
            <Link
              href="/contact"
              className="underline decoration-[color:var(--accent)] decoration-2 underline-offset-4 text-[color:var(--fg)] hover:text-[color:var(--accent)]"
            >
              {lang === "zh" ? "直接联系我" : "reach out"}
            </Link>
            {lang === "zh" ? "。" : "."}
          </p>
        </div>
      </div>
    </article>
  );
}
