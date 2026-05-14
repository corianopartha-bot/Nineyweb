import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { site } from "@/lib/site";

export default function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-32 border-t border-[color:var(--border)]">
      <div className="mx-auto max-w-[var(--container)] px-6 lg:px-10 py-16 grid gap-12 md:grid-cols-[2fr_1fr] items-start">
        {/* Brand block */}
        <div>
          <p className="text-eyebrow mb-3">{site.handle}</p>
          <p
            className="text-display max-w-xl"
            style={{ fontSize: "var(--step-2)", lineHeight: 1.25 }}
          >
            {t("site.tagline")}
            <span className="text-[color:var(--accent)]">.</span>
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-5 font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--fg-muted)]">
            <a href={`mailto:${site.email}`} className="hover:text-[color:var(--accent)]">
              {site.email}
            </a>
            <span className="opacity-30">·</span>
            <a
              href={site.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[color:var(--accent)]"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[color:var(--fg-muted)]">
          <Link href="/writing" className="hover:text-[color:var(--fg)]">Writing</Link>
          <Link href="/projects" className="hover:text-[color:var(--fg)]">Projects</Link>
          <Link href="/about" className="hover:text-[color:var(--fg)]">About</Link>
          <Link href="/now" className="hover:text-[color:var(--fg)]">Now</Link>
          <Link href="/contact" className="hover:text-[color:var(--fg)]">Contact</Link>
          <a href="/rss.xml" className="hover:text-[color:var(--fg)]">RSS</a>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container)] px-6 lg:px-10 pb-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--fg-muted)]">
        <span>© {year} {site.name}. {t("footer.rights")}.</span>
        <span>{site.domain}</span>
      </div>
    </footer>
  );
}
