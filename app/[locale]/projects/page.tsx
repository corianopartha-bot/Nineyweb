import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { projects } from "@/lib/projects";

export default async function ProjectsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const lang = (locale === "en" ? "en" : "zh") as "zh" | "en";

  return (
    <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-24 pb-24">
      <p className="text-eyebrow mb-6">PROJECTS</p>
      <h1 className="text-display mb-16" style={{ fontSize: "var(--step-3)" }}>
        {t("sections.selectedProjects")}
        <span className="text-[color:var(--accent)]">.</span>
      </h1>

      <ul className={`grid ${projects.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-px bg-[color:var(--border)]`}>
        {projects.map((p, i) => (
          <li key={p.slug} className="bg-[color:var(--bg)]">
            <Link
              href={`/projects/${p.slug}`}
              className="aspect-[4/5] p-8 flex flex-col justify-between hover:bg-[color:var(--paper-deep)] transition-colors group"
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
                  className="text-display mb-3 group-hover:text-[color:var(--accent)] transition-colors"
                  style={{ fontSize: "var(--step-2)", lineHeight: 1.15 }}
                >
                  {p.title[lang]}
                </h3>
                <p className="text-sm text-[color:var(--fg-muted)] leading-relaxed">
                  {p.tagline[lang]}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
