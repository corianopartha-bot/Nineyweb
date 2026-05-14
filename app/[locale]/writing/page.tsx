import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { listPostsMeta } from "@/lib/posts";

export default async function WritingIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const posts = await listPostsMeta(locale);
  const lang = locale === "en" ? "en" : "zh";

  return (
    <section className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pt-24 pb-32">
      <p className="text-eyebrow mb-6">WRITING</p>
      <h1 className="text-display mb-16" style={{ fontSize: "var(--step-3)" }}>
        {lang === "zh" ? "写作" : "Writing"}
        <span className="text-[color:var(--accent)]">.</span>
      </h1>

      {posts.length === 0 ? (
        <p className="text-[color:var(--fg-muted)] font-mono text-sm">
          // {lang === "zh" ? "还没有发布文章" : "no posts yet"}
        </p>
      ) : (
        <ul className="divide-y divide-[color:var(--border)]">
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Link
                href={`/writing/${p.slug}`}
                className="py-10 grid md:grid-cols-[80px_minmax(0,1fr)_180px] items-baseline gap-6 group hover:bg-[color:var(--paper-deep)] -mx-3 px-3 rounded-sm transition-colors"
              >
                <span className="font-mono text-xs text-[color:var(--fg-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h2
                    className="text-display group-hover:text-[color:var(--accent)] transition-colors"
                    style={{ fontSize: "var(--step-2)", lineHeight: 1.2 }}
                  >
                    {p.title}
                  </h2>
                  {p.description && (
                    <p className="mt-3 text-[color:var(--fg-muted)] max-w-2xl">
                      {p.description}
                    </p>
                  )}
                  {p.tags && p.tags.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--fg-muted)]">
                      {p.tags.map((t) => (
                        <li key={t} className="border border-[color:var(--border)] px-2 py-0.5">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-muted)] md:text-right">
                  <div>{p.date}</div>
                  <div className="mt-1">{p.readingTime}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
